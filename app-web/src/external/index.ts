import { LocalMarkersApi } from "./LocalGeoApi";
import { GeoApi } from "./GeoApi";

GeoApi.Inject(new LocalMarkersApi())

export * from "./GeoApi";
