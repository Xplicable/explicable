// scripts/scan-node-languages.js

import AWS from 'aws-sdk';

const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-2' });

async function getSupportedLanguages() {
  try {
    const result = await ddb.scan({
      TableName: 'Nodes',
      ProjectionExpression: '#textField',
      ExpressionAttributeNames: {
        '#textField': 'text'
      },
      Limit: 20
    }).promise();

    const allKeys = new Set();

    result.Items.forEach(item => {
      if (item.text && typeof item.text === 'object') {
        Object.keys(item.text).forEach(lang => allKeys.add(lang));
      }
    });

    console.log("Languages found in Nodes.text:", Array.from(allKeys));
  } catch (e) {
    console.error("Error scanning Nodes table:", e.message);
  }
}

getSupportedLanguages();
