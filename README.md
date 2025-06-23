# Resume Analyzer Project

## 📋 Description
A full-stack web application that analyzes resumes and matches them with job descriptions using NLP and machine learning techniques.

## ✨ Features
- Resume parsing and text extraction
- Job description matching
- Skills gap analysis
- Interactive web interface
- Real-time analysis results

## What it does
- Upload a PDF resume
- Choose between two AI analysis types:
  - **TF-IDF Matching**: Matches resume with a selected job role using keyword relevance.
  - **Semantic Matching**: Evaluates resume compatibility based on contextual similarity with a pasted job description.
- Extracts entities from resume (name, email, phone, skills, education, etc.)
- Displays:
  - 📈 Match score (TF-IDF or semantic)
  - ✅ Matched / missing keywords (TF-IDF)
  - 🤖 AI-generated remarks
- Clean, responsive modern UI using TailwindCSS

  ## 🛠️ Tech Stack
**Frontend:** 
- React
- Vite
- TailwindCSS v4

**Backend:**
- Python
- FastAPI
- Natural Language Processing libraries
- Machine Learning models

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- pip
