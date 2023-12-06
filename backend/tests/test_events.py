from app.config import config
from tests.client import client


def test_get_events():
    response = client.get(
        f"{config.URL_PREFIX}/events",
    )

    assert response.status_code == 200
    assert response.json().get("data")
    assert isinstance(response.json().get("data"), list)
