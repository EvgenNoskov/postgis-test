import { Map as LMap, marker, Marker, popup } from "leaflet";
import React, { FormEvent, useState } from "react";
import cls from "./MapView.module.css";
import { GeoApi } from "@/external";

export function MarkerWidget(props: { map: LMap }) {
    const map = props.map;
    const [adding, setAdding] = useState<Marker | null>(null);
    const [label, setLabel] = useState("Marker label");
    const maxLabelLen = 64;

    const begin = () => {
        if (adding)
            return;
        const m = marker(map.getCenter(), { draggable: true, opacity: 0.7, zIndexOffset: 1000 }).addTo(map);
        setAdding(m);
    };

    const commit = () => {
        if (!adding)
            return;

        const latLong = adding.getLatLng();
        adding.setOpacity(1);
        adding.setZIndexOffset(0);
        adding.dragging?.disable();
        if (label)
            adding.bindPopup(popup({ content: label }));

        GeoApi().AddMarker({ lat: latLong.lat, lng: latLong.lng, label });
        setAdding(null);
    };

    const revert = () => {
        if (!adding)
            return;
        adding.remove();
        setAdding(null);
    };

    const onChangeLabel = (ev: FormEvent<HTMLInputElement>) => {
        const str = (ev.target as HTMLInputElement).value;

        setLabel(str.substring(0, maxLabelLen));
    };

    if(!adding)
        return <button onClick={begin} className={cls.sidebarRow}>Add marker</button>

    return <>
        <button onClick={begin} className={cls.sidebarRow} disabled={true}>Add marker</button>
        <input value={label} className={cls.sidebarRow} onInput={onChangeLabel} maxLength={maxLabelLen} />
        <span className={cls.sidebarRow}>Drag marker and click OK to save the location</span>
        <button onClick={commit} className={cls.sidebarRow}>OK</button>
        <button onClick={revert} className={cls.sidebarRow}>Cancel</button>
    </>;
}
