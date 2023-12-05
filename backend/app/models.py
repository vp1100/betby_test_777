from datetime import datetime
from typing import Any, Generic, TypeVar

from pydantic import BaseModel, field_validator

DataT = TypeVar("DataT")


class BaseResponseModel(BaseModel, Generic[DataT]):
    status: str = "success"
    detail: Any | None = None
    data: DataT | str | None = None
    total: int | None = None


class EventsResponse(BaseModel):
    id: str
    scheduled_time: datetime
    start_time: datetime | None = None
    end_time: datetime | None = None
    scheduler_id: int
    league_id: int
    league_name: str
    pair_id: int
    home_team_id: int
    home_team_name: str
    away_team_id: int
    away_team_name: str
    status: str

    @field_validator("*", mode="before")
    @classmethod
    def empty_to_none(cls, v: str) -> str | None:
        if v == "":
            return None
        return v


class EventsTable(BaseModel):
    id: str
    scheduled_time: datetime
    start_time: datetime
    end_time: datetime
    scheduler_id: int
    league_id: int
    league_name: str
    pair_id: int
    home_team_id: int
    home_team_name: str
    away_team_id: int
    away_team_name: str
    status: str
