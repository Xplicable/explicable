# 📘 Reviewer Access Guide – Explicable Project

**Author:** Paul Wade  (paulwade@gmail.com)
**Domain:** https://xplika.com  
**Project:** Explicable – A cloud-native React + AWS Amplify portfolio app  
**Purpose:** Secure, read-only access for technical reviewers

---

## 🔐 AWS Console Access

Each reviewer has their own IAM user with read-only permissions scoped to the project’s AWS resources.

| Reviewer         | IAM Username | Access Level |
|------------------|--------------|---------------|
| Chris Boesch     | `scboesch`   | Read-Only     |
| Adam Dejardin    | `adejardi`   | Read-Only     |
| Vikas Kanhaua    | `kanhauav`   | Read-Only     |

---

### ✅ Login URL

https://730355210046.signin.aws.amazon.com/console


📎 *You should have received an email from paul with a temporary password.*


---


## 🔍 What You Can Access

| Service     | Permissions         |
|-------------|---------------------|
| **AWS Amplify** | View deployments, logs, custom domains, env vars |
| **Route 53 / SSL** | View domain/subdomain mappings |
| **IAM Console** | View your own user profile only |

---

### 🛑 Restricted Permissions

Reviewers cannot:
- Modify or deploy Amplify apps
- Change environment variables
- Create or remove IAM users
- Access private credentials or secrets

---

## 🌐 Live Environment Matrix

| Environment | URL                          | Branch        | Env Flag      |
|-------------|------------------------------|---------------|---------------|
| Production  | https://xplika.com           | `main`        | `main`        |
| QA          | https://qa.xplika.com        | `qa`          | `qa`          |
| Staging     | https://staging.xplika.com   | `v0.4.0-dev`  | `staging`     |

---

## 🧪 What to Explore

- Amplify > Hosting > Environment Variables  
- Branch-level deployments (`main`, `qa`, `v0.4.0-dev`)
- Domain mappings + SSL status
- Build logs for each deployment

---

## 📅 Access Expiration

All IAM reviewer accounts will **expire on July 31, 2025**  
Your access is read-only and auditable in AWS CloudTrail.

---

## 💬 Questions?

Feel free to reach out to Paul Wade at mesapaul@amazon.com or paulwade@gmail.com

Thanks again for reviewing this project!
