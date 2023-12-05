import time
from typing import Callable

from app.config import config
from app.models import BaseResponseModel
from app.router import router
from fastapi import FastAPI, Request, Response
from fastapi.exceptions import ResponseValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Process-Time"],
)

app.include_router(router, prefix=f"{config.URL_PREFIX}/events")


@app.exception_handler(ResponseValidationError)
async def http_exception_handler(request, exc):
    response = BaseResponseModel(status="error", detail=str(exc))
    return JSONResponse(response.model_dump(), status_code=400)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next: Callable) -> Response:
    start_time = time.time()

    response = await call_next(request)

    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)

    return response
