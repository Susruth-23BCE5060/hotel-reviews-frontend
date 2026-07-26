# 🏨 Smart Hotel Review Platform

An interactive, AI-powered system designed to bridge the gap between customer feedback and administrative action[cite: 1]. This platform allows customers to submit detailed reviews, which are then analyzed in real-time for aspect-based sentiment[cite: 1]. Hotel administrators receive actionable insights through a visual dashboard and automated daily reports[cite: 1].

---

## 🎯 Objective
To develop a smart and interactive hotel review platform where customers can submit and explore feedback, while hotel administrators gain actionable insights through real-time, AI-powered sentiment analysis[cite: 1]. The system provides visual analytics, automated daily alerts with actionable suggestions, and a gamified user experience to support continuous service enhancement and customer satisfaction[cite: 1].

## 🚀 Key Features

*   **AI-Powered Aspect-Based Sentiment Analysis**: Securely utilizes the Hugging Face API to extract key aspects (e.g., "room", "service", "cleanliness") and their sentiments in real-time[cite: 1].
*   **Admin Analytics Dashboard**: Provides a separate, real-time visual dashboard using Chart.js to visualize sentiment trends, aspect frequency, and overall satisfaction scores[cite: 1].
*   **Proactive Daily Alerts**: An Amazon EventBridge rule triggers a Lambda function daily to analyze feedback[cite: 1]. If negative/neutral feedback for any aspect exceeds a 50% threshold, an email with suggestions is sent via Amazon SES[cite: 1].
*   **Gamified User Experience**: Enhances engagement by awarding badges (e.g., "Top Reviewer", "Early Bird") using a dedicated AWS Lambda function (`badgeEngine`)[cite: 1].
*   **Secure Authentication**: Role-based access and user login for guests and admins are managed through AWS Cognito via the AWS Amplify framework[cite: 1].

---

## 🛠️ Technology Stack

### **Frontend**
*   **Technologies**: HTML/CSS, React.js[cite: 1]
*   **Visualization**: Chart.js, heatmap.js[cite: 1]

### **Backend (Serverless Architecture)**
*   **Orchestration**: AWS Amplify (Gen 2, TypeScript)[cite: 1]
*   **Compute**: AWS Lambda (Node.js & Python)[cite: 1]
*   **Database**: Amazon DynamoDB[cite: 1]
*   **API**: AWS API Gateway / Amplify Data[cite: 1]

### **AI & Cloud Services**
*   **NLP Models**: Google Gemini API / Hugging Face API[cite: 1]
*   **Authentication**: Amazon Cognito[cite: 1]
*   **Notifications**: Amazon SES (Simple Email Service)[cite: 1]
*   **Scheduling**: Amazon EventBridge[cite: 1]
*   **Monitoring**: AWS CloudWatch[cite: 1]
*   **Security**: AWS Secrets Manager (for API keys), AWS IAM (role-based permissions)[cite: 1]

---

## 📂 Project Structure

*   `/src`: Frontend React components (`App.js`, `AdminDashboard.js`, `ReviewForm.js`, `ReviewList.js`)[cite: 1].
*   `/backend`: Core serverless backend logic including:
    *   `get_reviews.py`: API endpoint to fetch reviews[cite: 1].
    *   `badge_engine.py`: Gamification logic for awarding badges[cite: 1].
    *   `generate_review_report.py`: Aggregates sentiment scores for the admin dashboard[cite: 1].
    *   `dailyReviewAnalyzer.js`: Node.js function for scheduled threshold analysis and SES emailing[cite: 1].
    *   `submit_review.py`: Real-time sentiment mapping utilizing the Hugging Face API[cite: 1].

---

## 👤 Author

**Posem Reddy Susruth**
*Registration Number: 23BCE5060*[cite: 1]

---
*This full-stack project was integrated and deployed using AWS Free Tier services[cite: 1].*
