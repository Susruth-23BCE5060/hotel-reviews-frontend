# 🏨 Smart Hotel Review Platform

An interactive, AI-powered system designed to bridge the gap between customer feedback and administrative action. This platform allows customers to submit detailed reviews, which are then analyzed in real-time for aspect-based sentiment. Hotel administrators receive actionable insights through a visual dashboard and automated daily reports.

---

## 🚀 Key Features

- **AI-Powered Aspect-Based Sentiment Analysis**: Automatically extracts specific aspects (e.g., room, service, cleanliness) from reviews and determines sentiment using NLP.
- **Admin Analytics Dashboard**: Real-time visualization of sentiment trends and aspect frequency using interactive charts.
- **Proactive Daily Alerts**: An automated system scans daily reviews and emails administrators about critical areas needing immediate attention.
- **Gamified User Experience**: Encourages engagement by awarding badges (e.g., "Top Reviewer", "Enthusiast") based on user activity.
- **Secure Authentication**: Role-based access control for both customers and admins.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React.js
- **Visualization**: Chart.js, heatmap.js
- **Styling**: AWS Amplify UI Components

### **Backend (Serverless Architecture)**
- **Orchestration**: AWS Amplify (Gen 2, TypeScript)
- **Compute**: AWS Lambda (Node.js & Python)
- **Database**: Amazon DynamoDB
- **API**: AWS AppSync (GraphQL) / API Gateway

### **AI & Integration**
- **NLP Models**: Hugging Face API / Google Gemini API
- **Authentication**: AWS Cognito
- **Notifications**: Amazon SES (Simple Email Service)
- **Scheduling**: Amazon EventBridge

---

## 🏗️ System Architecture & Modules

### 1. User Authentication
Managed via **AWS Cognito**, providing secure sign-up and login flows with role-based permissions to distinguish between guests and hotel administrators.

### 2. Review Submission & Processing
- The **React frontend** sends review data to a secure GraphQL API.
- A **Lambda function (`submitReview`)** triggers sentiment analysis and stores the structured result in **DynamoDB**.

### 3. Sentiment Analysis Workflow
Uses the **Hugging Face API** to parse reviews into a sentiments map (e.g., "Service: Positive", "Cleanliness: Negative"). This data is stored directly in the review item for instant retrieval by the dashboard.

### 4. Admin Alert System
**Amazon EventBridge** triggers a Lambda function every 24 hours to analyze the last day's feedback. If negative sentiment for any aspect exceeds a 50% threshold, an automated email is sent via **Amazon SES** with specific improvement suggestions.

### 5. Badge Engine
A dedicated Lambda function processes user data to award badges such as "First Review" or "Top Contributor," displayed alongside reviews to enhance engagement.

---

## 📂 Project Structure

- `/src`: Frontend React components (AdminDashboard, ReviewForm, ReviewList).
- `/amplify`: Backend definitions including Lambda functions, data models, and auth configurations.
- `/functions`: Core Lambda logic for `badge_engine`, `submit_review`, and `dailyReviewAlert`.

---

## 👤 Author

**Posem Reddy Susruth** *Registration Number: 23BCE5060*

---
*This project was developed using AWS Free Tier services and follows the AWS Well-Architected Framework for security and scalability.*
