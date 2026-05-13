import os
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine

from base import Base

load_dotenv()

DB_USER = os.getenv("DB_USER", "rdr")
DB_PASSWORD = os.getenv("DB_PASSWORD", "rdr_password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "rdr")

_safe_password = quote_plus(DB_PASSWORD)
SQLALCHEMY_DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{_safe_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 10},
)

__all__ = ["engine", "Base"]
