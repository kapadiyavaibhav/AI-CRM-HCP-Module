# AI CRM HCP Module

An AI-powered CRM module designed for managing Healthcare Professional (HCP) interactions using React, FastAPI, LangChain, Groq LLM, Redux Toolkit, and MySQL.

---

## Features

- AI-powered interaction extraction
- Automatic CRM field population
- HCP interaction management
- CRUD operations (Create, Edit, Delete)
- Sentiment analysis
- AI-generated follow-up suggestions
- Toast notifications
- Responsive modern UI
- Redux state management
- FastAPI backend integration

---

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Tailwind CSS
- Axios
- React Toastify

### Backend
- FastAPI
- LangChain
- Groq LLM
- MySQL
- SQLAlchemy

---

## AI Functionalities

The AI assistant automatically extracts:

- HCP Name
- Interaction Type
- Topics Discussed
- Materials Shared
- Samples Distributed
- Outcomes
- Sentiment
- Follow-up Actions
- AI Suggested Follow-ups
- Attendees
- Date & Time (when available)

---

## Project Structure

```bash
AI-CRM-Module/
│
├── backend/
│   ├── app/
│   └── ...
│
├── frontend/
│   ├── src/
│   └── ...
│
└── README.md
```

---

## Installation

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
GROQ_API_KEY=your_api_key_here
```

---

## Future Improvements

- Authentication system
- Dashboard analytics
- Voice interaction support
- PDF export
- Deployment support
- Advanced AI analytics

---

## Author

Vaibhav Kapadiya
