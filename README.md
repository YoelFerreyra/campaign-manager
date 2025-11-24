# Campaign manager

## Table of Contents

- [Project Overview](#project-overview)
- [Live Version Here](#live-version-here)
- [Backend API](#backend-api)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Running the Project](#running-the-project)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Author](#author)
- [CI/CD-ready pipeline for GitHub Actions](#CI/CD)
- [License](#license)

## Project Overview

This project implements a full-stack Campaign Manager using a fully serverless architecture, deployed and managed with AWS SAM and Infrastructure as Code (IaC).

# [Live Version Here](http://campaign-frontend-us-media.s3-website-us-east-1.amazonaws.com/)

# Backend API
The backend is built using AWS Lambda + API Gateway, fully defined using AWS SAM.
It includes:

- CRUD operations for campaigns
- Image upload using presigned URLs
- OpenAPI documentation rendered with Swagger
- Image Upload Flow

  - Frontend requests a presigned URL via /upload-url

  - The backend generates an S3 presigned PUT URL

  - React uploads the file directly to S3

  - The campaign stores only the image key

  - AWS Lambda generates a public GET URL when needed
  
[Live Openapi Here](https://o6ryv1dc68.execute-api.us-east-1.amazonaws.com/Prod/openapi/)

## Architecture

```bash
React SPA → S3 Static Hosting → CloudFront (optional)
                  ↓
           API Gateway (REST)
                  ↓
             AWS Lambda (Python)
                  ↓
        DynamoDB (Campaign Storage)

```

## Features

- Full CRUD operations for campaigns
- Frontend SPA with responsive design
- Serverless architecture for scalability and low maintenance
- Infrastructure as Code (IaC) using AWS SAM
- Backend API documentation via OpenAPI
- CI/CD-friendly for GitHub Actions deployments

## Tech Stack
- Frontend
  - React
  - Vite
  - Radix UI
  - Lucide Icons
  - Fetch-based API client

- Backend
  - Python 3.11
  - AWS Lambda
  - API Gateway
  - DynamoDB
  - boto3

- Infrastructure
  - AWS SAM
  - S3 for hosting
  - CloudFront (optional CDN layer)
  - AWS CLI

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
sam deploy
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

### Deploy to S3:

You can deploy the frontend (React or any static website) to Amazon S3 and make it publicly accessible.
Below are the steps to create the bucket, configure permissions, enable static hosting, and deploy.

1. Create an S3 Bucket
```bash
aws s3 mb s3://your-frontend-bucket --region us-east-1
```

2. Enable Static Website Hosting
```bash
aws s3 website s3://your-frontend-bucket --index-document index.html --error-document index.html
```

3. Allow Public Read Access (Bucket Policy)
Create a file bucket-policy.json

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-frontend-bucket/*"
    }
  ]
}
```
Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-frontend-bucket \
  --policy file://bucket-policy.json
```

4. Deploy the React App to S3

```bash
aws s3 sync build/ s3://your-frontend-bucket --delete
```

5. Access Your Deployed Site
```bash
http://your-frontend-bucket.s3-website-us-east-1.amazonaws.com
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

## CI/CD
The project supports GitHub Actions workflows for:

- Validating SAM templates

- Auto-deploying backend

- Building and deploying frontend to S3

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.
