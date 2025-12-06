#!/bin/sh
PORT=${PORT:-8000}
poetry run alembic upgrade head
poetry run uvicorn backend.main:app --host 0.0.0.0 --port $PORT
