from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# MYSQL DATABASE URL

DATABASE_URL = "mysql+pymysql://root:@localhost/ai_crm_db"

# ENGINE

engine = create_engine(
    DATABASE_URL
)

# SESSION

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# BASE

Base = declarative_base()