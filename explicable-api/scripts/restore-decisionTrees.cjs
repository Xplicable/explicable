const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');

const trees = JSON.parse(fs.readFileSync('decisionTrees-flat.json', 'utf8'));

const API_URL = 'https://kym19kis0l.execute-api.us-east-2.amazonaws.com/dev';
const API_KEY = 'TNqG6DHCUk2AM1FkiLUGt8V2XpBq6Llw7d19MPIB';

(async () => {
  for (const tree of trees) {
    try {
      const response = await fetch(`${API_URL}/decisionTrees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(tree)
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to post tree ${tree.tree_id}: ${error}`);
      } else {
        console.log(`✅ Tree ${tree.tree_id} restored`);
      }
    } catch (err) {
      console.error(`💥 Error restoring tree ${tree.tree_id}:`, err.message);
    }
  }
})();
