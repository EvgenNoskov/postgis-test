import { FormEvent, useState } from "react";
import { LatLng, Map as LMap } from "leaflet";
import { GeoApi } from "@/external";
import { MarkerWidget } from "./MarkerWidget";
import cls from "./Sidebar.module.css";

export function Sidebar(props: { map: LMap | null; center: LatLng; zoom: number; onSetCenter: (center: LatLng) => void; onSetZoom: (zoom: number) => void; }) {
    const { map, center, onSetCenter, zoom, onSetZoom } = props;
    const [hidden, setHidden] = useState(false)

    const onGetMyLocation = () => {
        if (!map)
            return;
        GeoApi().GetMyLocation().then(v => {
            if (v)
                onSetCenter(new LatLng(v.lat, v.lng));
        });
    };
    const onZoomChange = (ev: FormEvent<HTMLInputElement>) => {
        if (!map)
            return;
        const value = (ev.target as HTMLInputElement).value;
        const zoom = Math.max(0, Math.min(map.getMaxZoom(), parseInt(value)));
        onSetZoom(zoom);
    };

    const hide = () => {
        setHidden(true);
        setTimeout(() => map?.invalidateSize());
    }

    const show = () => {
        setHidden(false);
        setTimeout(() => map?.invalidateSize());
    }

    if (hidden)
        return <button className={cls.menuBtn} onClick={show}>Show sidebar</button>

    return (
        <div className={`${cls.sidebarBlock} ${hidden ? cls.hidden : ""}`}>
            <button className={cls.closeBtn} onClick={hide}>Hide sidebar</button>
            <div className={cls.sidebar}>
                <div className={cls.separator}></div>
                
                <button onClick={onGetMyLocation} className={cls.sidebarRow} disabled={!GeoApi().CanGetMyLocation()}>Center on my location</button>
                <span>Latitude:</span>
                <span className={cls.sidebarText}>{center.lat}</span>
                <span>Longitude:</span>
                <span className={cls.sidebarText}>{center.lng}</span>
                <span>Zoom:</span>
                <input type="number" value={zoom} onInput={onZoomChange} className={cls.zoomInput}/>

                <div className={cls.separator}></div>

                {map && <MarkerWidget map={map} />}
            </div>
        </div>
    );
}
