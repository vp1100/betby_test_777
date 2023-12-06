import csv
import os.path
from datetime import datetime
from typing import Literal, Tuple

import pytz
from app.config import ROOT_DIR
from fastapi import HTTPException


def sampling(selection: list, offset: int = 0, limit: int | None = None) -> list:
    return selection[offset : (limit + offset if limit is not None else None)]


def read_csv(
    path: str,
    skip: int,
    limit: int,
    start_date: datetime,
    end_date: datetime,
) -> Tuple[list[dict], int]:
    if not os.path.isfile(ROOT_DIR + path):
        raise HTTPException(404, "Data not found")

    if start_date and end_date:
        if start_date > end_date:
            raise HTTPException(400, "Wrong date period")

    if skip < 0:
        raise HTTPException(400, "Skip should be 0 or more")

    if limit <= 0:
        raise HTTPException(400, "Limit should not be less than 0")

    rows = []

    with open(ROOT_DIR + path, "r") as file:
        csv_reader = csv.DictReader(file)

        for row in csv_reader:
            try:
                # suppose that the date is in ISO format and UTC timezone
                scheduled_time = datetime.fromisoformat(row.get("scheduled_time"))  # type: ignore [arg-type]
                scheduled_time = scheduled_time.replace(tzinfo=pytz.utc)
            except ValueError:
                continue

            if scheduled_time is None:
                continue

            if scheduled_time >= start_date and scheduled_time <= end_date:
                rows.append(row)

    total = len(rows)

    return rows, total


def sort_rows(
    rows: list, sort: str | None = None, order: Literal["asc", "desc"] | None = "asc"
):
    if sort is None:
        return rows

    if sort not in list(rows[0].keys()):
        return rows

    reverse = True if order == "asc" else False

    return sorted(rows, key=lambda x: x[sort], reverse=reverse)
