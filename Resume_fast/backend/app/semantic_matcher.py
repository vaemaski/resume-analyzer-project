from sentence_transformers import SentenceTransformer, util
from ner_helper import compare_entities

# Load BERT model once
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_semantic_score(resume_text, jd_text):
    embeddings = model.encode([resume_text, jd_text], normalize_embeddings=True)
    score = util.cos_sim(embeddings[0], embeddings[1]).item()
    return round(score * 100, 2)

def generate_remark_semantic(score, resume_text, jd_text):
    matched, missing = compare_entities(resume_text, jd_text)

    # Semantic score comment
    if score > 80:
        base = "✅ Strong semantic alignment with the job description."
    elif score > 60:
        base = "🟡 Moderate alignment. Some important points are missing."
    else:
        base = "🔴 Weak alignment. Consider rewriting your resume to match the job description."

    # Entity-based feedback
    entity_summary = f"""
Matched skills: {', '.join(matched) if matched else 'None'}
Missing skills: {', '.join(missing) if missing else 'None'}
"""

    return base + "\n\n" + entity_summary.strip()
