from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from app.services.pdf_processor import process_pdf
from app.services.nlp_processor import generate_answer
from app.db.base import SessionLocal, get_db
from app.db.models import PDFText
from app.schemas.schema import UploadResponse, QuestionRequest, AnswerResponse
from botocore.exceptions import NoCredentialsError

router = APIRouter()

@router.post("/upload/", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDFs are allowed.")

    contents = await file.read()
    text = process_pdf(contents)

    # Save text to PostgreSQL
    pdf_text = PDFText(filename=file.filename, text=text)
    db.add(pdf_text)
    db.commit()
    db.refresh(pdf_text)

    # Save PDF to S3
    from app.core.config import s3_client, S3_BUCKET_NAME
    try:
        s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=file.filename, Body=contents)
    except NoCredentialsError:
        raise HTTPException(status_code=500, detail="Credentials not available")

    return {"id": int(pdf_text.id), "filename": file.filename, "message": "File successfully uploaded and text extracted."}

@router.post("/ask/", response_model=AnswerResponse)
async def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
   
    pdf_text = db.query(PDFText).filter(PDFText.id == request.text_id).first()
    if not pdf_text:
        raise HTTPException(status_code=404, detail="PDF text not found")

    answer = generate_answer(request.question, pdf_text.text)
    return {"answer": answer}
