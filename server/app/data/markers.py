from .entities import Marker
from .db import get_db
from sqlalchemy import text


def get_markers() -> list[Marker]:
    markers = []
    with get_db() as db:
        sql = "SELECT id, label, ST_X(geom) as lat, ST_Y(geom) as lng FROM public.markers LIMIT 100;"
        rows = db.execute(text(sql))
        for id, label, lat, lng in rows:
            markers.append(Marker(id=id, label=label, lat=lat, lng=lng))
    return markers


def add_marker(marker: Marker):
    with get_db() as db:
        sql = "INSERT INTO public.markers(label, geom) VALUES (:label, ST_SetSRID(ST_MakePoint(:lat, :lng), 4326));"
        db.execute(
            text(sql), {"label": marker.label, "lat": marker.lat, "lng": marker.lng}
        )
        db.commit();
