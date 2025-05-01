// users.js 

import express from 'express';
import AWS from 'aws-sdk';
import { normalizeBody } from '../utils/normalizeBody.js';

const router = express.Router();
const ddb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION });

router.get('/', async (req, res) => {
  try {
    const { limit, lastKey, username, time_zone, sortOrder = 'asc' } = req.query;
    const params = {
      TableName: 'Users',
      Limit: limit ? parseInt(limit, 10) : undefined,
      ExclusiveStartKey: lastKey ? JSON.parse(decodeURIComponent(lastKey)) : undefined
    };

    if (username) {
      params.IndexName = 'UsernameIndex';
      params.KeyConditionExpression = '#uname = :uname';
      params.ExpressionAttributeNames = { '#uname': 'username' };
      params.ExpressionAttributeValues = { ':uname': username };
      const result = await ddb.query(params).promise();
      return res.json({
        items: result.Items,
        lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
      });
    }

    if (time_zone) {
      params.IndexName = 'TimeZoneCreatedAtIndex';
      params.KeyConditionExpression = '#tz = :tz';
      params.ExpressionAttributeNames = { '#tz': 'time_zone' };
      params.ExpressionAttributeValues = { ':tz': time_zone };
      const result = await ddb.query(params).promise();
      return res.json({
        items: result.Items,
        lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
      });
    }

    const result = await ddb.scan(params).promise();
    res.json({
      items: result.Items,
      lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null
    });

  } catch (e) {
    console.error('Error fetching users:', e);
    res.status(500).json({ error: 'Failed to fetch users', details: e.message });
  }
});

router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const { Item } = await ddb.get({
      TableName: 'Users',
      Key: { user_id: Number(user_id) }
    }).promise();
    if (!Item) return res.status(404).json({ error: 'Not found' });
    res.json(Item);
  } catch (e) {
    console.error('GET /users/:user_id error', e);
    res.status(500).json({ error: 'Failed to fetch user', details: e.message });
  }
});

router.post('/', async (req, res) => {
  const body = normalizeBody(req.body);
  const {
    user_id, name, username, email, mobile_number,
    isEmailVerified = false, isMobilePhoneVerified = false,
    time_zone, preferences = {}
  } = body;

  if (!user_id || !name || !username || !email || !mobile_number || !time_zone) {
    return res.status(400).json({
      error: 'Validation failed',
      message: 'user_id, name, username, email, mobile_number and time_zone are required'
    });
  }

  const now = new Date().toISOString();
  const item = {
    user_id, name, username, email, mobile_number,
    isEmailVerified, isMobilePhoneVerified, time_zone,
    preferences, created_at: now, updated_at: now
  };

  try {
    await ddb.put({ TableName: 'Users', Item: item }).promise();
    res.status(201).json(item);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create user', details: e.message });
  }
});

router.patch('/:user_id', async (req, res) => {
  const updates = normalizeBody(req.body);
  const { user_id } = req.params;
  if (!user_id) return res.status(400).json({ error: 'Missing user_id in path' });

  const allowed = ['name','username','email','mobile_number','isEmailVerified','isMobilePhoneVerified','time_zone','preferences'];
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

  setClauses.push('#updated_at = :updated_at');
  exprAttrNames['#updated_at'] = 'updated_at';
  exprAttrValues[':updated_at'] = new Date().toISOString();

  try {
    const { Attributes } = await ddb.update({
      TableName: 'Users',
      Key: { user_id: Number(user_id) },
      UpdateExpression: 'SET ' + setClauses.join(', '),
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: 'ALL_NEW'
    }).promise();
    res.json(Attributes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update user', details: e.message });
  }
});

router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const { Attributes } = await ddb.delete({
      TableName: 'Users',
      Key: { user_id: Number(user_id) },
      ReturnValues: 'ALL_OLD'
    }).promise();
    if (!Attributes) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete user', details: e.message });
  }
});

export default router;
