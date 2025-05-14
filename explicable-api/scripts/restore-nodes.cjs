const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');

const nodes = JSON.parse(fs.readFileSync('nodes-flat.json', 'utf8'));

const API_URL = 'https://kym19kis0l.execute-api.us-east-2.amazonaws.com/dev';
const API_KEY = 'TNqG6DHCUk2AM1FkiLUGt8V2XpBq6Llw7d19MPIB';

(async () => {
  for (const node of nodes) {
    try {
      const response = await fetch(`${API_URL}/nodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(node)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to post node ${node.node_id}: ${error}`);
      } else {
        console.log(`✅ Node ${node.node_id} restored`);
      }
    } catch (err) {
      console.error(`💥 Error restoring node ${node.node_id}:`, err.message);
    }
  }
})();
