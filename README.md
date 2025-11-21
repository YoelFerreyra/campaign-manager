# Campaign manager
This project implements a full-stack Campaign Manager using a fully serverless architecture, deployed and managed with AWS SAM and Infrastructure as Code (IaC).

## Project Structure
```bash
campaign-manager-pro/
├─ backend/
│  ├─ campaigns_handler.py
│  ├─ requirements.txt
├─ frontend/
│  ├─ package.json
│  ├─ public/
│  │  └─ index.html
│  └─ src/
│     ├─ index.js
│     ├─ App.jsx
│     ├─ api.js
│     ├─ components/
│     │  ├─ CampaignList.jsx
│     │  └─ CampaignForm.jsx
│     └─ styles.css
├─ template.yaml
├─ openapi.yaml
└─ README.md
```

## Serverless Architecture
```bash
React SPA → CloudFront/S3 → API Gateway → Lambda (Python) → DynamoDB/RDS
```
