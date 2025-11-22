# Campaign manager

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Live Version Here](#live-version-here)
  - [Features](#features)
  - [Running the Project](#running-the-project)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [Author](#author)
  - [License](#license)

## Project Overview

This project implements a full-stack Campaign Manager using a fully serverless architecture, deployed and managed with AWS SAM and Infrastructure as Code (IaC).

## Project Structure

```bash
campaign-manager/
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

# [Live Version Here](http://campaign-frontend-us-media.s3-website-us-east-1.amazonaws.com/)

## Architecture

```bash
React SPA → CloudFront/S3 → API Gateway → Lambda (Python) → DynamoDB/RDS
```

## Features

- Full CRUD operations for campaigns
- Frontend SPA with responsive design
- Serverless architecture for scalability and low maintenance
- Infrastructure as Code (IaC) using AWS SAM
- Optional backend API documentation via OpenAPI
- CI/CD-friendly for GitHub Actions deployments

## Running the Project

### Prerequisites

- AWS account with IAM user and access keys
- Node.js >= 20.19.5
- npm or yarn
- Python 3.11
- AWS CLI and SAM CLI installed

### Setup

Backend:

```bash
cd backend
pip install -r requirements.txt
sam build --use-container
sam deploy --stack-name campaign-manager --capabilities CAPABILITY_IAM --resolve-s3
```

Frontend:

Set the backend API URL as an environment variable:
```bash
export REACT_APP_API_URL=https://your-api-url.execute-api.us-east-1.amazonaws.com/Prod
```

Install dependencies and build:

```bash
cd frontend
npm install
npm run build
```

Deploy to S3:

```bash
aws s3 sync build/ s3://your-frontend-bucket --delete
```

## Author

<table style="width:100%">
  <tr>
    <td>
        <div align="center">
            <a href="./docs/img/photo.png" target="_blank" rel="author">
                <img src="https://media.licdn.com/dms/image/v2/C4D03AQHiV6tKBXHe2g/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1655254800968?e=1765411200&v=beta&t=Fg8BWGu5PT8PKcpS373v18Zyn55GpQMdR4hoG0zR1jw" style="border-radius: 10%; min-width: 100px;" alt="Yoel Ferreyra's Photo" width="200px">
            </a>
            <h2>
                <a href="https://eric-ferreyra.github.io/" target="_blank" rel="author">
                    Yoel Ferreyra
                </a>
            </h2>
        </div>
    </td>
    <td>
        <div align="center">
            <a href="mailto:yoelferreyra24@gmail.com" target="_blank" rel="author">
                <img src="https://img.icons8.com/color/48/000000/message-squared.png" alt="My GitHub" height="45px">
            </a>
            <h3>
                <a href="mailto:yoelferreyra24@gmail.com" target="_blank" rel="author">
                    Email me to yoelferreyra24@gmail.com
                </a>
            </h3>
            <a href="https://www.linkedin.com/in/yoelferreyra/" target="_blank" rel="author">
                <img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="My Linkedin" height="45px">
            </a>
            <h3>
                <a href="https://www.linkedin.com/in/yoelferreyra/" target="_blank" rel="author">
                    Connect to my Linkedin
                </a>
            </h3>
            <a href="https://github.com/yoelferreyra" target="_blank" rel="author">
                <img src="https://img.icons8.com/color/48/000000/github--v1.png" alt="My GitHub" height="45px">
            </a>
            <h3>
                <a href="https://github.com/yoelferreyra" target="_blank" rel="author">
                    Check my GitHub Profile
                </a>
            </h3>
        </div>
    </td>
  </tr>
</table>

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.
