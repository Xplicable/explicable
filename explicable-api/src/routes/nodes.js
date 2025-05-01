// nodes.js 

import express from 'express';
import AWS from 'aws-sdk';
import { normalizeBody } from '../utils/normalizeBody.js';
import { randomUUID } from 'crypto';

const router = express.Router();
const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

router.get('/', async (req, res) => {
  try {
    const { limit, lastKey, tree_id, node_type, sortBy, sortOrder = 'asc' } = req.query;
    const params = {
      TableName: 'Nodes',
      ...(limit && { Limit: parseInt(limit, 10) }),
      ...(lastKey && { ExclusiveStartKey: JSON.parse(decodeURIComponent(lastKey)) }),
    };

    if (tree_id) {
      params.IndexName = 'TreeCreatedAtIndex';
      params.KeyConditionExpression = '#tid = :tid';
      params.ExpressionAttributeNames = { '#tid': 'tree_id' };
      params.ExpressionAttributeValues = { ':tid': tree_id };
      const result = await ddb.query(params).promise();
      return res.json({
        items: result.Items,
        lastKey: result.LastEvaluatedKey
          ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
          : null
      });
    }

    if (node_type) {
      let idx = 'NodeTypeCreatedAtIndex';
      if (sortBy === 'views') idx = 'NodeTypeViewsIndex';
      else if (sortBy === 'selections') idx = 'NodeTypeSelectionsIndex';

      params.IndexName = idx;
      params.KeyConditionExpression = '#nt = :nt';
      params.ExpressionAttributeNames = { '#nt': 'node_type' };
      params.ExpressionAttributeValues = { ':nt': node_type };
      params.ScanIndexForward = sortOrder.toLowerCase() === 'asc';

      const result = await ddb.query(params).promise();
      return res.json({
        items: result.Items,
        lastKey: result.LastEvaluatedKey
          ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
          : null
      });
    }

    const result = await ddb.scan(params).promise();
    res.json({
      items: result.Items,
      lastKey: result.LastEvaluatedKey
        ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
        : null
    });

  } catch (e) {
    console.error('Error fetching nodes:', e);
    res.status(500).json({ error: 'Failed to fetch nodes', details: e.message });
  }
});

router.get('/:node_id', async (req, res) => {
  const { node_id } = req.params;
  try {
    const { Item } = await ddb.get({
      TableName: 'Nodes',
      Key: { node_id }
    }).promise();
    if (!Item) return res.status(404).json({ error: 'Not found' });
    res.json(Item);
  } catch (e) {
    console.error('GET /nodes/:node_id error', e);
    res.status(500).json({ error: 'Failed to fetch node', details: e.message });
  }
});

router.post('/', async (req, res) => {
  const body = normalizeBody(req.body);
  const {
    tree_id,
    node_type,
    text = {},
    description,
    photo_url,
    additional_content = [],
    input_placeholder,
    validation
  } = body;

  if (!tree_id || !node_type || !text) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'tree_id, node_type and text are required'
    });
  }

  const now = new Date().toISOString();
  const item = {
    node_id: randomUUID(),
    tree_id,
    node_type,
    text,
    description,
    photo_url,
    additional_content,
    input_placeholder,
    validation,
    usage: { views: 0, selections: 0 },
    created_at: now,
    updated_at: now
  };

  try {
    await ddb.put({ TableName: 'Nodes', Item: item }).promise();
    res.status(201).json(item);
  } catch (e) {
    console.error('Error creating node:', e);
    res.status(500).json({ error: 'Failed to create node', details: e.message });
  }
});

router.patch('/:node_id', async (req, res) => {
  const updates = normalizeBody(req.body);
  const { node_id } = req.params;
  if (!node_id) return res.status(400).json({ error: 'Missing node_id in path' });

  const allowed = [
    'text','description','photo_url',
    'additional_content','input_placeholder',
    'validation','node_type'
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

  if ('usage' in updates) {
    setClauses.push('#usage = :usage');
    exprAttrNames['#usage'] = 'usage';
    exprAttrValues[':usage'] = updates.usage;

    setClauses.push('usage_views = :usage_views');
    exprAttrValues[':usage_views'] = updates.usage.views || 0;

    setClauses.push('usage_selections = :usage_selections');
    exprAttrValues[':usage_selections'] = updates.usage.selections || 0;
  }

  if (setClauses.length === 0) return res.status(400).json({ error: 'No valid fields to update' });

  setClauses.push('#updated_at = :updated_at');
  exprAttrNames['#updated_at'] = 'updated_at';
  exprAttrValues[':updated_at'] = new Date().toISOString();

  try {
    const { Attributes } = await ddb.update({
      TableName: 'Nodes',
      Key: { node_id },
      UpdateExpression: 'SET ' + setClauses.join(', '),
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: 'ALL_NEW'
    }).promise();
    res.json(Attributes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update node', details: e.message });
  }
});

router.delete('/:node_id', async (req, res) => {
  const { node_id } = req.params;
  try {
    await ddb.delete({ TableName: 'Nodes', Key: { node_id } }).promise();
    res.json({ message: 'Node deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete node', details: e.message });
  }
});

export default router;
