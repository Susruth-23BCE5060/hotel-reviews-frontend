# 🏨 Smart Hotel Review Platform

An interactive, AI-powered system designed to bridge the gap between customer feedback and administrative action. This platform allows customers to submit detailed reviews, which are then analyzed in real-time for aspect-based sentiment. Hotel administrators receive actionable insights through a visual dashboard and automated daily reports.

---

## 🎯 Objective
To develop a smart and interactive hotel review platform where customers can submit and explore feedback, while hotel administrators gain actionable insights through real-time, AI-powered sentiment analysis. The system provides visual analytics, automated daily alerts with actionable suggestions, and a gamified user experience to support continuous service enhancement and customer satisfaction.

## 🚀 Key Features

*   **AI-Powered Aspect-Based Sentiment Analysis**: Securely utilizes the Hugging Face API to extract key aspects (e.g., "room", "service", "cleanliness") and their sentiments in real-time.
*   **Admin Analytics Dashboard**: Provides a separate, real-time visual dashboard using Chart.js to visualize sentiment trends, aspect frequency, and overall satisfaction scores.
*   **Proactive Daily Alerts**: An Amazon EventBridge rule triggers a Lambda function daily to analyze feedback. If negative/neutral feedback for any aspect exceeds a 50% threshold, an email with suggestions is sent via Amazon SES.
*   **Gamified User Experience**: Enhances engagement by awarding badges (e.g., "Top Reviewer", "Early Bird") using a dedicated AWS Lambda function (`badgeEngine`).
*   **Secure Authentication**: Role-based access and user login for guests and admins are managed through AWS Cognito via the AWS Amplify framework.

---

## 🛠️ Technology Stack

### **Frontend**
*   **Technologies**: HTML/CSS, React.js
*   **Visualization**: Chart.js, heatmap.js

### **Backend (Serverless Architecture)**
*   **Orchestration**: AWS Amplify (Gen 2, TypeScript)
*   **Compute**: AWS Lambda (Node.js & Python)
*   **Database**: Amazon DynamoDB
*   **API**: AWS API Gateway / Amplify Data

### **AI & Cloud Services**
*   **NLP Models**: Google Gemini API / Hugging Face API
*   **Authentication**: Amazon Cognito
*   **Notifications**: Amazon SES (Simple Email Service)
*   **Scheduling**: Amazon EventBridge
*   **Monitoring**: AWS CloudWatch
*   **Security**: AWS Secrets Manager (for API keys), AWS IAM (role-based permissions)

---

## 📂 Project Structure

*   `/src`: Frontend React components (`App.js`, `AdminDashboard.js`, `ReviewForm.js`, `ReviewList.js`).
*   `/backend`: Core serverless backend logic including:
    *   `get_reviews.py`: API endpoint to fetch reviews.
    *   `badge_engine.py`: Gamification logic for awarding badges.
    *   `generate_review_report.py`: Aggregates sentiment scores for the admin dashboard.
    *   `dailyReviewAnalyzer.js`: Node.js function for scheduled threshold analysis and SES emailing.
    *   `submit_review.py`: Real-time sentiment mapping utilizing the Hugging Face API.

---
## 🚀 AWS Architecture & Deployment Guide

**⚠️ Note on Architecture:** For a complete understanding of the system architecture, data flow, and component interactions, **please refer to the project documentation PDF included in this repository.** The following sections outline the practical steps to configure and deploy the necessary AWS services.

### 1. Prerequisites

Before deploying the backend services, ensure you have the following installed and configured:
*   [AWS CLI](https://aws.amazon.com/cli/) installed and authenticated with your AWS account credentials.
*   An active AWS account with permissions to create IAM roles, Lambda functions, API Gateways, and DynamoDB tables.

### 2. DynamoDB Setup

DynamoDB serves as the primary NoSQL database for this project.

1.  Navigate to the **DynamoDB Console** in your AWS dashboard.
2.  Click **Create table**.
3.  **Configure Table Details:**
    *   **Table name:** Enter your specific table name (e.g., `MainDataStore`).
    *   **Partition key:** Define the primary key (e.g., `id` of type String).
    *   **Sort key (Optional):** Add a sort key if your data access patterns require it (e.g., `timestamp`).
4.  **Capacity Settings:** Leave the default settings (Provisioned or On-Demand depending on your expected traffic pattern) and click **Create table**.
5.  *Important:* Note down the **Table ARN** from the table's overview page. You will need this to configure IAM permissions for your Lambda functions.

### 3. AWS Lambda Configuration

AWS Lambda handles the serverless execution of your backend logic.

1.  Navigate to the **Lambda Console** and click **Create function**.
2.  Choose **Author from scratch**.
3.  **Basic Information:**
    *   **Function name:** Name your function clearly based on its task.
    *   **Runtime:** Select the appropriate runtime for your code (e.g., Node.js 20.x, Python 3.12).
    *   **Architecture:** Choose x86_64 or arm64 based on your deployment package.
4.  **Configure Environment Variables:**
    *   Navigate to the **Configuration > Environment variables** tab.
    *   Add key-value pairs your code relies on (e.g., Key: `TABLE_NAME`, Value: `YourDynamoDBTableName`).
5.  **Set Up IAM Permissions (Crucial Step):**
    *   Go to **Configuration > Permissions** and click the role name under **Execution role**.
    *   In the IAM console, attach an inline policy granting this role permissions to interact with DynamoDB. At minimum, you will need `dynamodb:PutItem`, `dynamodb:GetItem`, `dynamodb:UpdateItem`, and `dynamodb:Scan`/`Query` limited specifically to the Table ARN you noted in Step 2.

### 4. API Gateway Configuration (The "Other Things")

To make your Lambda functions accessible to your frontend or external services via HTTP requests, configure an API Gateway.

1.  Navigate to the **API Gateway Console**.
2.  Click **Create API** and choose **HTTP API** (recommended for standard integrations).
3.  **Add Integrations:** Click **Add integration**, select **Lambda**, and choose the specific Lambda function you created in Step 3.
4.  **Configure Routes:** Define the HTTP method (e.g., `GET`, `POST`) and the resource path (e.g., `/api/data`).
5.  **Deploy:** Leave the default deployment stage (usually `$default`) or create a new one. The console will generate an **Invoke URL**. 
6.  Use this Invoke URL as the base endpoint in your frontend application's API calls.

---

### 📚 Need More Architectural Context?

If you are looking to understand the theoretical reasoning behind these design choices, the specific NoSQL data schemas used in DynamoDB, or the detailed sequence diagrams of how the client interacts with this AWS backend, **please consult the accompanying project PDF document.** It contains the comprehensive architectural breakdown and rationale.

---

## 👤 Author

**Posem Reddy Susruth**

---
*This full-stack project was integrated and deployed using AWS Free Tier services.*
