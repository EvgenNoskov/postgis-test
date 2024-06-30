import { MapContainer, TileLayer } from "react-leaflet";
import { LatLng, Map as LMap, marker, Marker } from "leaflet";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import cls from "./MapView.module.css";
import { GeoApi } from "@/external";

const defLocation = new LatLng(51, 0);
const defZoom = 12;

export default function MapView() {
    const [map, setMap] = useState<LMap | null>(null);
    const [zoom, setZoom] = useState<number>(defZoom);
    const [center, setCenter] = useState<LatLng>(defLocation);

    const [addingMarker, setAddingMarker] = useState<Marker | null>(null);

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
            for (const m of markers) {
                marker(m).addTo(node);
            }
        })
    }, []);



    useEffect(updateMapState, [zoom]);
    useEffect(updateMapState, [center]);


    const onSetMyLocation = () => {
        if (!map)
            return;
        GeoApi().GetMyLocation().then(v => {
            if (!v)
                return;
            setCenter(new LatLng(v.lat, v.lng))
        })
    }


    const onSetZoom = (ev: FormEvent<HTMLInputElement>) => {
        if (!map)
            return;
        const value = (ev.target as HTMLInputElement).value;
        const zoom = Math.max(0, Math.min(map.getMaxZoom(), parseInt(value)));
        setZoom(zoom);
    }

    const onStartAddingMarker = () => {
        if (!map || addingMarker)
            return;
        const m = marker(center, { draggable: true })
        m.addTo(map)
        setAddingMarker(m);
    }

    const commitMarker = () => {
        if (!map || !addingMarker)
            return;

        const latLong = addingMarker.getLatLng();
        GeoApi().AddMarker({ lat: latLong.lat, lng: latLong.lng })
        setAddingMarker(null)
    }

    const abortMarker = () => {
        if (!map || !addingMarker)
            return;
        addingMarker.remove();
        setAddingMarker(null);
    }

    return (
        <div className={cls.view}>
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className={cls.mapView} ref={mapRef}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
            <div className={cls.sidebar}>
                <span>Latitude:</span>
                <span className={cls.sidebarText}>{center.lat}</span>
                <span>Longitude:</span>
                <span className={cls.sidebarText}>{center.lng}</span>
                <button onClick={onSetMyLocation} className={cls.sidebarRow}>Center on my location</button>
                <input type="number" value={zoom} onInput={onSetZoom} className={cls.sidebarRow} />
                <button onClick={onStartAddingMarker} className={cls.sidebarRow} disabled={addingMarker != null}>Add marker</button>
                {addingMarker && <button onClick={commitMarker} className={cls.sidebarRow}>Commit</button>}
                {addingMarker && <button onClick={abortMarker} className={cls.sidebarRow}>Revert</button>}
            </div>
        </div>
    )
}