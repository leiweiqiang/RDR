import os
from contextlib import asynccontextmanager
from typing import List

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from base import Base
from database import engine
from dependencies import get_db
import models  # noqa: F401
import schemas
from models import Item as ItemModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    flag = os.getenv("CREATE_SCHEMA_ON_STARTUP", "1").strip().lower()
    if flag in ("1", "true", "yes"):
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="RDR API",
    description="Minimal API for RDR",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "RDR API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/items/", response_model=List[schemas.Item])
def list_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(ItemModel).offset(skip).limit(limit).all()


@app.post("/items/", response_model=schemas.Item)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    row = ItemModel(name=payload.name)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
