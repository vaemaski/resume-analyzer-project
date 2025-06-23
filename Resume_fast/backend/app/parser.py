from io import BytesIO
from pdfminer.high_level import extract_text

def extract_text_from_pdf(pdf_bytes):
    pdf_stream = BytesIO(pdf_bytes)
    text = extract_text(pdf_stream)
    return text
