from datetime import datetime

from app.crud import read_csv
from app.models import BaseResponseModel, EventsResponse
from fastapi import APIRouter

router = APIRouter()


# multiple documents
@router.get("", response_model=BaseResponseModel[list[EventsResponse]])
def get_documents(
    skip: int = 0,
    limit: int = 5,
    start_date: datetime | None = datetime.now().replace(day=1),
    end_date: datetime | None = datetime.now(),
) -> dict:
    data, total = read_csv("/data/events.csv", skip, limit, start_date, end_date)

    return {"data": data, "total": total}
