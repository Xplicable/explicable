// src/utils/opensearch.js

import fetch from 'node-fetch';
import aws4 from 'aws4';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { URL } from 'url';

export async function searchDecisionTrees(queryBody, endpointUrl, region) {
  const credentials = await defaultProvider()();
  const endpoint = new URL(`${endpointUrl}/decisiontrees/_search`);

  const request = {
    host: endpoint.hostname,
    path: endpoint.pathname,
    service: 'es',
    region,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queryBody)
  };

  aws4.sign(request, {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken
  });

  const response = await fetch(endpoint.href, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenSearch failed: ${response.status} ${text}`);
  }

  return response.json();
}
