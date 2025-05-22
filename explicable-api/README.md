⚠️ For demonstration purposes only

This repo includes `.env` files temporarily so that interviewers can run the app end-to-end.

Please do not use these values in production environments. Tokens and API keys are test-only and may be revoked.


# Explicable API

Explicable is a decision-tree platform designed to help users build, manage, and explore interactive branching workflows for education, troubleshooting, and guided decision-making.

This repository contains the backend API built with Node.js, Express, AWS Lambda, DynamoDB, and OpenSearch — deployed using the Serverless Framework.

---

## 🚀 Features

- Modular REST API for:
  - Users
  - Decision Trees
  - Nodes
- Full-text search via OpenSearch
- Serverless infrastructure on AWS
- Fully tested via the `smoke-test-el-grande.sh` script

---

## 📁 Project Structure

src/ 
├── handler.js # Express app entrypoint (wrapped by serverless-http) 
├── routes/ # Modular route files 
│ ├── users.js 
│ ├── decisionTrees.js 
│ └── nodes.js 
├── utils/ # Helpers like OpenSearch signing and body parsing 
│ ├── normalizeBody.js 
│ └── opensearch.js scripts/ 
└── smoke-test-el-grande.sh # Full API coverage smoke test

---

## 🛠 Setup

1. **Install dependencies:**

   ```bash
   npm install

2. **Create a .env file:**

AWS_REGION=us-east-2
EXPLICABLE_BASE_URL=https://<your-api-gateway-url>
EXPLICABLE_API_KEY=your-api-key
OPENSEARCH_ENDPOINT=https://<your-opensearch-endpoint>

3. **Deploy to AWS:**

serverless deploy --stage dev --region us-east-2 --aws-profile explicable-deployer

4. **Tail logs (in separate terminal):**

sls logs -f api -s dev -r us-east-2 -t

5. **🧪 Run Smoke Test**

chmod +x scripts/smoke-test-el-grande.sh
./scripts/smoke-test-el-grande.sh

✅ The smoke test will validate health, 404s, and full CRUD operations for users, trees, and nodes.

📜 License
MIT or private — TBD.

🧠 Author
Paul Wade · github.com/prw760
