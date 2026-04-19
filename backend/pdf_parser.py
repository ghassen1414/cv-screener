import fitz

def extract_text_from_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    text = "\n".join(page.get_text("text") for page in doc)
    doc.close()
    return text.strip()
