import { MarkerData, GeoApi } from "./GeoApi";
import { LocalMarkersApi } from "./LocalGeoApi";

export class RemoteGeoApi extends LocalMarkersApi implements GeoApi {
    private readonly _endpoint: string = "/api";


    override async AddMarker(marker: MarkerData): Promise<void> {
        return fetch(this.getEndpoint("/markers/"), {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(marker)
        })
            .then(() => { })
            .catch(err => {
                this.onError(err);
                throw err;
            })
    }

    override  async GetMarkers(): Promise<MarkerData[]> {
        return fetch(this.getEndpoint("/markers/")).then(r => r.json()).catch((err) => {
            this.onError(err);
            return [];
        })
    }


    private getEndpoint(route: string): string {
        return this._endpoint + route;
    }

    private onError(error: Error): void {
        console.debug(error);
    }
}