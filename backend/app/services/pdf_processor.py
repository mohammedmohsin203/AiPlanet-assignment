import pymupdf  

def process_pdf(contents: bytes) -> str:
    pdf = pymupdf.open(stream=contents, filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    return text
