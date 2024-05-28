from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base

class PDFText(Base):
    __tablename__ = "pdf_texts"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    text = Column(Text, nullable=False)
