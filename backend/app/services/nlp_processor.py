from tabnanny import verbose
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import google.generativeai as genai
import os

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3) 

def generate_answer(question: str, context: str) -> str:
    print("Generating answer...") 

    prompt_template = """
    Answer the question as detailed as possible based on the provided context. 
    If the answer is not found in the context, simply state "Answer not available in the context."

    Context:
    {context}

    Question:
    {question}

    Answer:
    """

    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

  
    chain = LLMChain(
        llm = llm,
        prompt = prompt,
        verbose = True
    )

    response = chain.invoke(input={"question": question, "context": context})

    return response["text"]