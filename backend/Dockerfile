# Builder
FROM python:3.11-slim AS builder

#RUN apt-get update && apt-get install -y libpq-dev gcc
RUN pip install --upgrade --no-cache-dir poetry==1.4.2

ENV POETRY_NO_INTERACTION=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=1 \
    POETRY_VIRTUALENVS_CREATE=1

WORKDIR /app
COPY poetry.lock pyproject.toml .

RUN poetry install --without dev --no-root

# Final
FROM python:3.11-slim

#RUN apt-get update && \
#    apt-get install -y libpq-dev && \
#    rm -rf /var/lib/apt/lists/*

ENV VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}
COPY app /app
COPY app/run.py /

RUN useradd app
USER app

EXPOSE 8000

ENTRYPOINT ["python", "/run.py"]