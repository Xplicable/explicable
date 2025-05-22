⚠️ For demonstration purposes only

This repo includes `.env` files temporarily so that interviewers can run the app end-to-end.

Please do not use these values in production environments. Tokens and API keys are test-only and may be revoked.


# Explicable UI

🧠 A React-based frontend for the Explicable project — a modern, serverless user profile app powered by AWS Cognito, Lambda, and DynamoDB.

---

## 🚀 What This App Does

Explicable provides:

- Google login via AWS Cognito
- User profile management (name, email, phone, time zone, profile photo)
- Time zone auto-detection + smart dropdown with UTC offsets
- Profile photo fallback avatar support
- Responsive UI, organized architecture
- Clean AWS Lambda integration (for backend persistence)

This project is designed as a **demonstration of front-end + cloud-integrated architecture** and is used for technical evaluation and portfolio purposes.

---

## ⚙️ Tech Stack

| Area            | Stack                      |
|-----------------|----------------------------|
| UI Framework    | React (Create React App)   |
| Auth            | AWS Cognito                |
| Backend API     | AWS Lambda + API Gateway   |
| DB              | DynamoDB (Users table)     |
| Deploy          | Manual CLI Deploy          |
| Language        | JavaScript (ES6)           |

---

## 📦 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/Xplicable/explicable.git
cd explicable/explicable-ui
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the App

```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🔐 `.env` File Notice

⚠️ **For demonstration/interview purposes only**

This repo **includes `.env` and `.env.local` files** temporarily so interviewers can run the project and validate backend integrations (e.g. Cognito setup, Dynamo endpoints).

- **DO NOT use these values in production**
- All tokens are restricted to test-mode IAM users
- `.env` will be removed in production branches

---

## 🧪 Features To Test

- Login with Google
- Profile editing
- Time zone selection
- Phone number field
- Avatar rendering & fallback
- Data persistence via Lambda

---

## 📁 Project Structure

```
explicable-ui/
├── public/                 # Static assets and HTML shell
├── src/
│   ├── assets/             # Avatar fallback image, etc.
│   ├── components/         # Reusable React components
│   ├── constants/          # Shared constants like DEFAULT_AVATAR
│   ├── pages/              # Page-level components
│   ├── utils/              # Helper functions (e.g., timezones)
│   ├── App.js              # Main app wrapper
│   └── index.js            # CRA entry point
```

---

## 🧠 Developer Notes

- Clean separation of concerns
- Designed for future TypeScript conversion
- Highly composable and testable

---

## ✅ Author

**Paul W.**  
[GitHub: @prw760](https://github.com/prw760)  
This is a project submitted for technical review.

---
