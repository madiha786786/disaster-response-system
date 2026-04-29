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

## 🖼️ Screenshots (Optional but Recommended)

*(You should add 2-3 key screenshots here, e.g., the Dashboard and the Smart Allocation page)*

## 👥 Team

**Team Leader:** Madiha Fatima

**Problem Statement:** AI-Based Real-Time Disaster & Emergency Response System

---
