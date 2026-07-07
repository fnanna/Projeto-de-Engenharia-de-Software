from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine

app = FastAPI(title="PES Backend")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend rodando!"}

@app.get("/health/db")
def check_db():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "detail": str(e)}