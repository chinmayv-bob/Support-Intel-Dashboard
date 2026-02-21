# Support Intel Dashboard 📊

> **Providing 30 minutes of daily sync-up insight in a 5-minute glance.**

Support Intel is an AI-driven dashboard designed to provide high-fidelity insights into customer support operations. By automating the extraction of trends, risks, and quality signals from support tickets, it enables support leadership to move from "feeling" to "knowing."

## 🚀 The Impact
- **Efficiency**: Replace a **30-minute daily sync-up** with a **5-minute glance**.
- **Accuracy**: Eliminates manual bias by using LLMs to categorize and score 100% of tickets.
- **Proactive Risk Management**: Identifies churn and SLA risks before they escalate.

## ✨ Key Features

### 1. Focus View (The Executive Daily)
- **Daily AI Brief**: A high-level summary of the last 24 hours.
- **System Risk Monitors**: Real-time health scores for different support panels.
- **Critical Ticket Feed**: Instant visibility into high-frustration/high-impact tickets.

### 2. Analytics View
- **Trend Detection**: Automatically groups tickets into emerging trends with AI-generated root cause analysis.
- **Growth Tracking**: Monitor how fast specific issues are scaling.

### 3. Quality & Coaching
- **Sentiment Analysis**: Tracks sentiment shifts throughout a conversation.
- **Redundant Reply Detection**: Identifies efficiency leaks where agents are sending multiple non-value-add messages.
- **AI Coaching**: Automated feedback on wins, risks, and action items.

### 4. Intel Library
- **Knowledge Base Automation**: Suggests new KB articles based on recurring trends.
- **FAQ Generation**: Automatically drafts FAQs for common customer queries.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion (Animations), Lucide (Icons).
- **Backend**: Google Apps Script (GAS) serving a JSON API.
- **Data Layer**: Google Sheets (used as a lightweight, collaborative database).
- **AI Engine**: Sim.AI (Workflow automation for ticket summarization and sentiment scoring).

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/support-intel-dashboard.git
   cd support-intel-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root and add your Apps Script API URL:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/.../exec
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📐 Architecture

The system follows a decoupled architecture:
1. **Extraction**: Sim.AI workflows process incoming tickets via webhooks.
2. **Storage**: Processed data is written to structured Google Sheets.
3. **Bridge**: Google Apps Script acts as a RESTful middleware, exposing sheets data via `doGet`.
4. **Presentation**: The React SPA fetches data and provides a high-performance, interactive UI.

---

*Built for Support Leaders who value data-driven decisions.*
