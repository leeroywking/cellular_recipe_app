from pathlib import Path

from dotenv import load_dotenv

from app import create_app


load_dotenv(Path(__file__).resolve().parent.parent / ".env")

app = create_app()
