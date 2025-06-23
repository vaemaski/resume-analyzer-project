import spacy 
nlp = spacy.load("en_core_web_sm")

TECH_KEYWORDS = {"Python", "TensorFlow", "SQL", "Docker", "AWS", "NLP", "Pandas", "Java", "C++", "React", "Node.js"}

def extract_entities(text):
    doc = nlp(text)
    entities = set()

    for token in doc:
        if token.text in TECH_KEYWORDS:
            entities.add(token.text)

    return entities
def compare_entities(resume_text, jd_text):
    resume_entities = extract_entities(resume_text)
    jd_entities = extract_entities(jd_text)

    matched = resume_entities.intersection(jd_entities) 

    missing = jd_entities - resume_entities

    return list(matched), list(missing)