from pydantic import BaseModel

class UploadResponse(BaseModel):
    id: int
    filename: str
    message: str

class QuestionRequest(BaseModel):
    text_id: int
    question: str

class AnswerResponse(BaseModel):
    answer: str
