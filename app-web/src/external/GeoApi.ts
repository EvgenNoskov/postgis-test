import { InjectableSingleton } from "@/common";
import {LatLngLiteral} from "leaflet";

export interface MarkerData extends LatLngLiteral {
    label?: string
}
export interface GeoApi {
    GetLastCenter(): Promise<LatLngLiteral | null>;
    SetLastCenter(center: LatLngLiteral): Promise<void>;

    GetMyLocation(): Promise<LatLngLiteral| null>;

    GetMarkers(): Promise<MarkerData[]>
    AddMarker(marker: MarkerData): Promise<void>;
}

export const GeoApi = InjectableSingleton<GeoApi>({ label: "MarkersApi" })