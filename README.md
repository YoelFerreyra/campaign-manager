# Campaign manager

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
```bash
React SPA → CloudFront/S3 → API Gateway → Lambda (Python) → DynamoDB/RDS
```
