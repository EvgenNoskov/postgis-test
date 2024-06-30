import { LatLngLiteral, LatLng } from "leaflet";
import { MarkerData, GeoApi } from "./GeoApi";

export class LocalMarkersApi implements GeoApi {
    private _lastCenter?: LatLng;

    async GetLastCenter(): Promise<LatLngLiteral | null> {
        const center = localStorage.getItem("center");
        return center ? JSON.parse(center) : null;
    }
    async SetLastCenter(center: LatLngLiteral): Promise<void> {
        if (this._lastCenter?.equals(center))
            return;
        this._lastCenter = new LatLng(center.lat, center.lng);
        localStorage.setItem("center", JSON.stringify(this._lastCenter));
    }
    GetMyLocation(): Promise<LatLngLiteral | null> {
        return new Promise((resolve) => {
            const geo = navigator.geolocation;
            if (geo)
                geo.getCurrentPosition(({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }), () => resolve(null));
            else
                resolve(null);
        })
    }
    async AddMarker(marker: MarkerData): Promise<void> {
        const markers = await this.GetMarkers();
        markers.push(marker);
        localStorage.setItem("markers", JSON.stringify(markers));
    }
    async GetMarkers(): Promise<MarkerData[]> {
        let markers: MarkerData[] = []
        try {
            const str = localStorage.getItem("markers");
            if (!str)
                return [];
            const json = JSON.parse(str);
            if (Array.isArray(json))
                markers = json;
        }
        finally {
            return markers
        }
    }
}