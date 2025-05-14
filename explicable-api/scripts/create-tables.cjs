const AWS = require('aws-sdk');
const ddbRaw = new AWS.DynamoDB({ region: 'us-east-2' });

(async function createTables() {
  try {
    // DecisionTrees table
    await ddbRaw.createTable({
      TableName: 'DecisionTrees',
      KeySchema: [
        { AttributeName: 'tree_id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'tree_id', AttributeType: 'S' },
        { AttributeName: 'created_at', AttributeType: 'S' },
        { AttributeName: 'owner_id', AttributeType: 'S' }  // changed from N → S
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'CreatedAtIndex',
          KeySchema: [
            { AttributeName: 'created_at', KeyType: 'HASH' },
            { AttributeName: 'tree_id', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'OwnerCreatedAtIndex',
          KeySchema: [
            { AttributeName: 'owner_id', KeyType: 'HASH' },
            { AttributeName: 'created_at', KeyType: 'RANGE' }
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
        { AttributeName: 'node_id', AttributeType: 'S' },
        { AttributeName: 'tree_id', AttributeType: 'S' },
        { AttributeName: 'created_at', AttributeType: 'S' },
        { AttributeName: 'node_type', AttributeType: 'S' },
        { AttributeName: 'usage_views', AttributeType: 'N' },
        { AttributeName: 'usage_selections', AttributeType: 'N' }
        // You may add: { AttributeName: 'owner_id', AttributeType: 'S' } here later if needed
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'TreeCreatedAtIndex',
          KeySchema: [
            { AttributeName: 'tree_id', KeyType: 'HASH' },
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
            { AttributeName: 'node_type', KeyType: 'HASH' },
            { AttributeName: 'usage_views', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        },
        {
          IndexName: 'NodeTypeSelectionsIndex',
          KeySchema: [
            { AttributeName: 'node_type', KeyType: 'HASH' },
            { AttributeName: 'usage_selections', KeyType: 'RANGE' }
          ],
          Projection: { ProjectionType: 'ALL' },
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
        }
      ],
      ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
    }).promise();

    console.log('✅ DecisionTrees and Nodes tables created successfully.');
  } catch (err) {
    console.warn('❌ Table creation warning:', err.message);
  }
})();
