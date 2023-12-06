from datetime import datetime, timezone
from typing import Literal

from app.crud import read_csv, sampling, sort_rows
from app.models import BaseResponseModel, EventsResponse, EventsTable
from fastapi import APIRouter

router = APIRouter()


@router.get("/schema", response_model=BaseResponseModel)
def get_schema() -> dict:
    data = {"table": EventsTable.schema()}

    return {"data": data}


@router.get("", response_model=BaseResponseModel[list[EventsResponse]])
def get_events(
    skip: int = 0,
    limit: int = 5,
    start_date: datetime | None = datetime.now(timezone.utc).replace(day=1),
    end_date: datetime | None = datetime.now(timezone.utc),
    sort: str | None = None,
    order: Literal["asc", "desc"] | None = None,
) -> dict:
    rows, total = read_csv("/data/events.csv", skip, limit, start_date, end_date)

    rows = sort_rows(rows, sort, order)

    rows = sampling(rows, skip, limit)

    return {"data": rows, "total": total}
