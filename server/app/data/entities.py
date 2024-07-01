from dataclasses import dataclass
from typing import Optional


@dataclass
class Marker:
    lat: float
    lng: float
    label: str
    id: Optional[int] = None
