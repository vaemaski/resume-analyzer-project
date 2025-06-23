from sklearn.feature_extraction.text import TfidfVectorizer
import os

def match_resume_with_role(resume_text, job_role):
    # Load the job description
    base_path = os.path.dirname(os.path.abspath(__file__))  # path to matcher.py
    role_path = os.path.join(base_path, "../job_roles", f"{job_role}.txt")

    if not os.path.exists(role_path):
        raise FileNotFoundError(f"Job description for role '{job_role}' not found.")

    with open(role_path, "r", encoding="utf-8") as file:
        job_description = file.read()

    # Prepare the documents for TF-IDF
    documents = [resume_text, job_description]

    # Vectorize both texts using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Compute cosine similarity between resume and job description
    similarity_score = (tfidf_matrix[0] @ tfidf_matrix[1].T).toarray()[0][0] * 100

    # Keyword analysis
    job_keywords = set(job_description.lower().split())
    resume_words = set(resume_text.lower().split())

    matched = list(job_keywords & resume_words)
    missing = list(job_keywords - resume_words)

    return round(similarity_score, 2), matched, missing
def generate_remark_tfidf(score, matched, missing):
    if score > 0.75:
        base = "✅ Great match! Your resume is well-aligned with the job role."
    elif score > 0.5:
        base = "🟡 Moderate match. Consider improving some areas."
    else:
        base = "🔴 Low match. Significant improvements needed to align with the role."

    details = f"""
Matched Keywords: {', '.join(matched) if matched else 'None'}
Missing Keywords: {', '.join(missing) if missing else 'None'}
"""

    return base + "\n\n" + details.strip()
