// 📁 src/handler.js

import express from 'express';
import serverless from 'serverless-http';
import usersRoutes from './routes/users.js';
import treesRoutes from './routes/decisionTrees.js';
import nodesRoutes from './routes/nodes.js';

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors());

app.use('/users', usersRoutes);
app.use('/decisionTrees', treesRoutes);
app.use('/nodes', nodesRoutes);

app.get('/', (req, res) => res.json({ message: 'Hello from explicable-api!' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

export const handler = serverless(app);

//========================================================================

// === DynamoDB table creation (uncomment to execute once) ===
/*

const ddbRaw = new AWS.DynamoDB({ region: 'us-east-2' });

(async function createTables() {
  try {
    // Users table
    await ddbRaw.createTable({
      TableName: 'Users',
      KeySchema: [
        { AttributeName: 'user_id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'user_id',       AttributeType: 'N' },
        { AttributeName: 'username',      AttributeType: 'S' },
        { AttributeName: 'time_zone',     AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UsernameIndex',
          KeySchema: [
            { AttributeName: 'username', KeyType: 'HASH' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'TimeZoneCreatedAtIndex',
          KeySchema: [
            { AttributeName: 'time_zone',  KeyType: 'HASH' },
            { AttributeName: 'created_at', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();

    // DecisionTrees table
    await ddbRaw.createTable({
      TableName: 'DecisionTrees',
      KeySchema: [
        { AttributeName: 'tree_id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'tree_id',     AttributeType: 'S' },
        { AttributeName: 'created_at',  AttributeType: 'S' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'CreatedAtIndex',
          KeySchema: [
            { AttributeName: 'created_at', KeyType: 'HASH' },
            { AttributeName: 'tree_id',    KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();

    // Nodes table
    await ddbRaw.createTable({
      TableName: 'Nodes',
      KeySchema: [
        { AttributeName: 'node_id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'node_id',          AttributeType: 'S' },
        { AttributeName: 'tree_id',          AttributeType: 'S' },
        { AttributeName: 'created_at',       AttributeType: 'S' },
        { AttributeName: 'node_type',        AttributeType: 'S' },
        { AttributeName: 'usage_views',      AttributeType: 'N' },
        { AttributeName: 'usage_selections', AttributeType: 'N' }
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'TreeCreatedAtIndex',
          KeySchema: [
            { AttributeName: 'tree_id',    KeyType: 'HASH' },
            { AttributeName: 'created_at', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'NodeTypeCreatedAtIndex',
          KeySchema: [
            { AttributeName: 'node_type', KeyType: 'HASH' },
            { AttributeName: 'created_at', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'NodeTypeViewsIndex',
          KeySchema: [
            { AttributeName: 'node_type',    KeyType: 'HASH' },
            { AttributeName: 'usage_views',  KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'NodeTypeSelectionsIndex',
          KeySchema: [
            { AttributeName: 'node_type',         KeyType: 'HASH' },
            { AttributeName: 'usage_selections', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();

    console.log('All tables created or already exist');
  } catch (err) {
    console.warn('Table creation warning:', err.message);
  }
})();
*/