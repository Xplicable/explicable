// decisionTrees.js 

import express from 'express';
import AWS from 'aws-sdk';
import { normalizeBody } from '../utils/normalizeBody.js';
import { searchDecisionTrees } from '../utils/opensearch.js';
import { randomUUID } from 'crypto';

const router = express.Router();
const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });
const OPENSEARCH_ENDPOINT = process.env.OPENSEARCH_ENDPOINT;
const REGION = process.env.AWS_REGION;

router.get('/', async (req, res) => {
  const { limit, lastKey, owner_id, publication_status, sortBy, sortOrder = 'asc' } = req.query;
  const parsedLimit = limit ? parseInt(limit, 10) : undefined;

  let filterExpr = [];
  let exprAttrNames = {};
  let exprAttrValues = {};

  if (owner_id) {
    filterExpr.push('#owner = :owner');
    exprAttrNames['#owner'] = 'owner_id';
    exprAttrValues[':owner'] = Number(owner_id);
  }
  if (publication_status) {
    filterExpr.push('#pub = :pub');
    exprAttrNames['#pub'] = 'publication_status';
    exprAttrValues[':pub'] = publication_status;
  }

  try {
    if (owner_id && !publication_status) {
      const data = await ddb.query({
        TableName: 'DecisionTrees',
        IndexName: 'OwnerCreatedAtIndex',
        KeyConditionExpression: '#owner = :owner',
        ExpressionAttributeNames: { '#owner': 'owner_id' },
        ExpressionAttributeValues: { ':owner': Number(owner_id) },
        Limit: parsedLimit,
        ScanIndexForward: sortOrder === 'asc',
        ExclusiveStartKey: lastKey ? JSON.parse(decodeURIComponent(lastKey)) : undefined
      }).promise();
      return res.json({
        items: data.Items,
        lastKey: data.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(data.LastEvaluatedKey)) : null
      });
    }

    if (publication_status && !owner_id) {
      const data = await ddb.query({
        TableName: 'DecisionTrees',
        IndexName: 'StatusUpdatedAtIndex',
        KeyConditionExpression: '#pub = :pub',
        ExpressionAttributeNames: { '#pub': 'publication_status' },
        ExpressionAttributeValues: { ':pub': publication_status },
        Limit: parsedLimit,
        ScanIndexForward: sortOrder === 'asc',
        ExclusiveStartKey: lastKey ? JSON.parse(decodeURIComponent(lastKey)) : undefined
      }).promise();
      return res.json({
        items: data.Items,
        lastKey: data.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(data.LastEvaluatedKey)) : null
      });
    }

    const scanParams = {
      TableName: 'DecisionTrees',
      ...(parsedLimit && { Limit: parsedLimit }),
      ExclusiveStartKey: lastKey ? JSON.parse(decodeURIComponent(lastKey)) : undefined,
      ...(filterExpr.length && {
        FilterExpression: filterExpr.join(' AND '),
        ExpressionAttributeNames: exprAttrNames,
        ExpressionAttributeValues: exprAttrValues
      })
    };

    const scanResult = await ddb.scan(scanParams).promise();
    let items = scanResult.Items || [];

    if (sortBy === 'created_at') {
      items.sort((a, b) => {
        const ta = new Date(a.created_at).getTime();
        const tb = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? ta - tb : tb - ta;
      });
      if (parsedLimit) items = items.slice(0, parsedLimit);
    }

    return res.json({
      items,
      lastKey: scanResult.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(scanResult.LastEvaluatedKey)) : null
    });

  } catch (e) {
    console.error('Error fetching decision trees:', e);
    res.status(500).json({ error: 'Failed to fetch decision trees', details: e.message });
  }
});

router.get('/:tree_id', async (req, res) => {
  const { tree_id } = req.params;
  try {
    const { Item } = await ddb.get({
      TableName: 'DecisionTrees',
      Key: { tree_id }
    }).promise();
    if (!Item) return res.status(404).json({ error: 'Not found' });
    res.json(Item);
  } catch (e) {
    console.error('GET /decisionTrees/:tree_id error', e);
    res.status(500).json({ error: 'Failed to fetch decision tree', details: e.message });
  }
});

router.post('/', async (req, res) => {
  const body = normalizeBody(req.body);
  const {
    owner_id, category_id, subcategory_id,
    title, description, tags = [],
    access_config = { access_type: 'only_me', allowed_accounts: [], allowed_groups: [] }
  } = body;

  if (!owner_id || !category_id || !subcategory_id || !title || !description) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'owner_id, category_id, subcategory_id, title, and description are required'
    });
  }

  const now = new Date().toISOString();
  const item = {
    tree_id: randomUUID(),
    owner_id, category_id, subcategory_id,
    title, description, tags,
    version: 1,
    publication_status: 'draft',
    access_config,
    flags: [],
    shared_with: [],
    history: [],
    moderation_info: {
      flagged_by: [],
      flag_count: 0,
      last_moderation_check: now,
      rekognition_analysis: {}
    },
    created_at: now,
    updated_at: now
  };

  try {
    await ddb.put({ TableName: 'DecisionTrees', Item: item }).promise();
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create decision tree', details: e.message });
  }
});

router.post('/search', async (req, res) => {
  try {
    const queryBody = normalizeBody(req.body);
    const response = await searchDecisionTrees(queryBody, OPENSEARCH_ENDPOINT, REGION);

    const hits = (response.hits?.hits || []).map(hit => hit._source);
    const total = typeof response.hits?.total === 'object'
      ? response.hits.total.value
      : response.hits?.total ?? hits.length;

    return res.status(200).json({ hits, total });

  } catch (err) {
    console.error('❌ ES search failed:', err);
    return res.status(500).json({
      error: 'Search failed',
      message: err.message,
      ...(err.stack && { stack: err.stack })
    });
  }
});

router.patch('/:tree_id', async (req, res) => {
  const updates = normalizeBody(req.body);
  const { tree_id } = req.params;
  if (!tree_id) return res.status(400).json({ error: 'Missing tree_id in path' });

  const allowed = [
    'category_id', 'subcategory_id', 'title',
    'description', 'tags', 'access_config', 'publication_status'
  ];
  const setClauses = [];
  const exprAttrNames = {};
  const exprAttrValues = {};

  for (const key of allowed) {
    if (key in updates) {
      setClauses.push(`#${key} = :${key}`);
      exprAttrNames[`#${key}`] = key;
      exprAttrValues[`:${key}`] = updates[key];
    }
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  setClauses.push('#version = #version + :inc');
  exprAttrNames['#version'] = 'version';
  exprAttrValues[':inc'] = 1;

  setClauses.push('#updated_at = :updated_at');
  exprAttrNames['#updated_at'] = 'updated_at';
  exprAttrValues[':updated_at'] = new Date().toISOString();

  try {
    const { Attributes } = await ddb.update({
      TableName: 'DecisionTrees',
      Key: { tree_id },
      UpdateExpression: 'SET ' + setClauses.join(', '),
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(tree_id)'
    }).promise();
    res.json(Attributes);
  } catch (e) {
    if (e.code === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Not found' });
    }
    console.error('PATCH /decisionTrees/:tree_id error', e);
    res.status(500).json({ error: 'Failed to update decision tree', details: e.message });
  }
});

router.delete('/:tree_id', async (req, res) => {
  const { tree_id } = req.params;
  try {
    await ddb.delete({
      TableName: 'DecisionTrees',
      Key: { tree_id }
    }).promise();
    res.json({ message: 'Decision tree deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete decision tree', details: e.message });
  }
});

export default router;
