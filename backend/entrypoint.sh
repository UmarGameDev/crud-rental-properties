#!/bin/sh

# Run database migrations
poetry run alembic upgrade head

# Start the FastAPI app
poetry run uvicorn --host 0.0.0.0 --port 8000 backend.main:app
