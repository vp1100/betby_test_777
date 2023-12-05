import os

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    URL_PREFIX: str = ""

    USE_HTTPS: bool = False
    HTTP_PORT: int = 8000
    HTTP_DOMAIN: str

    @computed_field
    @property
    def _protocol(self) -> str:
        return "https" if self.USE_HTTPS else "http"

    @computed_field
    @property
    def CORS_ORIGINS(self) -> list:  # noqa N802
        return [
            f"{self._protocol}://{self.HTTP_DOMAIN}",
        ]


config = Settings()  # type: ignore[call-arg]
