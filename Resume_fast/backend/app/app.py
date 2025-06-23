from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from parser import extract_text_from_pdf 
import os
from matcher import match_resume_with_role 
from semantic_matcher import get_semantic_score, generate_remark_semantic
from matcher import generate_remark_tfidf


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Resume Fast API"}

@app.get("/job_roles/")
def get_job_roles():
    base_path = os.path.dirname(os.path.abspath(__file__))
    job_roles_path = os.path.join(base_path, "../job_roles")
    files = os.listdir(job_roles_path)

    return [f.replace(".txt", "") for f in files if f.endswith(".txt")]


@app.post("/analyze/")
async def analyze_resume(file: UploadFile = File(...),method : str = Form(...), job_role: Optional[str] = Form(None), job_description: Optional[str] = Form(None)):
    content = await file.read()
    if not content:
        return {"error": "File is empty or not provided"}
    resume_text = extract_text_from_pdf(content)

    if method == "tfidf":
        if not job_role or job_role.strip() == "":
            return {"error": "Job role is required for TF-IDF method"}

        
        score, matched, missing = match_resume_with_role(resume_text, job_role)
        remark = generate_remark_tfidf(score/100, matched, missing)  # ← You’ll define this function
        return {
            "method": "tfidf",
            "result": {
                "score": score,
                "matched": matched,
                "missing": missing,
                "remark" : remark
            }
        }
    
    elif method == "semantic":
        if not job_description or job_description.strip() == "":
            return {"error": "Job description is required for semantic analysis"}

        score = get_semantic_score(resume_text, job_description)
        remark = generate_remark_semantic(score, resume_text, job_description)
        return {
            "method": "semantic",
            "result": {
                "score": score,
                "remark": remark
            }
        }
    return {"error": "Invalid method. Choose either 'tfidf' or 'semantic'."}
   