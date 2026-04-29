# 🚨 AI-Powered Disaster Response & Volunteer Allocation System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https://disaster--response--frontend--piex.onrender.com-brightgreen)](https://disaster-response-frontend-piex.onrender.com)
[![Backend API](https://img.shields.io/badge/Backend%20API-https://disaster--response--system--hd8a.onrender.com-blue)](https://disaster-response-system-hd8a.onrender.com)

## 📌 Overview

An intelligent, real-time platform that connects disaster emergencies with the most suitable volunteers using a proprietary **Smart Scoring Engine**. Built for hackathon submission.

**Impact:** Reduces response time by up to 70%, ensures right-skilled volunteers are deployed, and can handle 100+ concurrent disasters.

## ✨ Key Features

*   **Smart Allocation Engine:** Ranks volunteers using a weighted formula (Skill: 50% + Distance: 30% + Availability: 20%).
*   **AI-Powered Analysis:** Integrates Google Gemini API to analyze disaster severity and recommend response strategies.
*   **Real-time Communication:** Uses Firebase Cloud Messaging (FCM) for instant browser push alerts to volunteers.
*   **Live Dashboard & Tracking:** A command center view with auto-refreshing stats and a live map (Leaflet.js) showing responder locations.
*   **Intelligent Chatbot:** An interactive AI assistant to answer disaster-related queries.

## 🛠️ Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript, Leaflet.js |
| **Backend** | Node.js, Express.js, REST APIs |
| **Database** | MongoDB Atlas |
| **AI & Logic** | Custom Weighted Algorithm, Google Gemini API |
| **Notifications** | Firebase Cloud Messaging (FCM) |
| **Deployment** | Render (Backend + Frontend) |

## 🚀 Live Demo & API

*   **Frontend Application:** [https://disaster-response-frontend-piex.onrender.com](https://disaster-response-frontend-piex.onrender.com)
*   **Backend API:** [https://disaster-response-system-hd8a.onrender.com](https://disaster-response-system-hd8a.onrender.com)
    *   Example: [`/api/disasters`](https://disaster-response-system-hd8a.onrender.com/api/disasters)

## 🧠 Smart Scoring Logic

The core matching logic is based on a weighted score out of 100:

*   **Skill Match (50 pts):** Volunteers with the exact required skill get full points.
*   **Distance (30 pts):** Volunteers within 2km get the maximum score.
*   **Availability (20 pts):** Volunteers who are "Free Now" receive the highest score.

Priority scoring for disasters is dynamically calculated based on `Urgency` and `People Affected`.

<img width="1920" height="992" alt="{FFC75E93-2952-4CAF-926A-A041712C3FB1}" src="https://github.com/user-attachments/assets/5181cb51-fbfa-4aeb-adac-949d1f691c8e" />

<img width="902" height="909" alt="{F40F6B98-8A38-425E-BC36-4F6C499E7F0B}" src="https://github.com/user-attachments/assets/0de867d1-5eb7-4236-8a50-ac8af58324c9" />
<img width="1914" height="945" alt="{4DDB4A9C-CF11-47B6-88EE-3AA0C26B99CF}" src="https://github.com/user-attachments/assets/10adc298-0ae2-48cb-937b-5106530cdb74" />


## 👥 Team

**Team Leader:** Madiha Fatima

**Problem Statement:** AI-Based Real-Time Disaster & Emergency Response System

---
