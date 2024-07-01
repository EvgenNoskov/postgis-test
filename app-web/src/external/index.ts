import { RemoteGeoApi } from "./RemoteGeoApi";
import { GeoApi } from "./GeoApi";

GeoApi.Inject(new RemoteGeoApi())

export * from "./GeoApi";
