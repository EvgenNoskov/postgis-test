import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng, Map as LMap, marker, popup } from "leaflet";
import { Sidebar } from "./Sidebar";
import { GeoApi } from "@/external";
import "leaflet/dist/leaflet.css";
import cls from "./MapView.module.css";

const defLocation = new LatLng(51, 0);
const defZoom = 12;

export default function MapView() {
    const [map, setMap] = useState<LMap | null>(null);
    const [zoom, setZoom] = useState<number>(defZoom);
    const [center, setCenter] = useState<LatLng>(defLocation);

    const mapRef = useCallback((node: LMap) => {
        if (!node)
            return;
        setMap(node);
        node.addEventListener("zoomend", () => setZoom(node.getZoom()))
        node.addEventListener("moveend", () => setCenter(node.getCenter()))
        const api = GeoApi();
        api.GetLastCenter().then(center => {
            if (center) {
                setCenter(new LatLng(center.lat, center.lng));
                return;
            }
            api.GetMyLocation().then(loc => setCenter(loc ? new LatLng(loc.lat, loc.lng) : defLocation))
        })

        api.GetMarkers().then(markers => {
            for (const item of markers) {
                const m = marker(item).addTo(node);
                if (item.label)
                    m.bindPopup(popup({ content: item.label }));
            }
        })
    }, []);

    const updateMapState = () => {
        if (!map)
            return;
        const c = map.getCenter();
        const z = map.getZoom();
        GeoApi().SetLastCenter(c);
        if (c.equals(center) && z === zoom)
            return;
        map.setView(center, zoom)
    }

    useEffect(updateMapState, [zoom]);
    useEffect(updateMapState, [center]);

    return (
        <div className={cls.view}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={cls.mapView} ref={mapRef}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
            <Sidebar map={map} center={center} zoom={zoom} onSetCenter={setCenter} onSetZoom={setZoom}/>
        </div>
    )
}
