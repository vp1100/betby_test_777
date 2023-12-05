import uvicorn
from app.config import config


def run() -> None:
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=config.HTTP_PORT,
        reload=True,
        proxy_headers=True,
    )


if __name__ == "__main__":
    run()
