import DojotRequest from '../models/DojotRequest';

class DeviceRequest extends DojotRequest {

    private formatedURL: string;

    public formatToRequestDeviceData(platformURL: string, id: string, params: Array<any>): string {
        this.formatedURL = Object.entries(params).reduce((url, param) => {
            return url + `${param[0]}=${param[1]}&`;
        }, '?');

        this.formatedURL = this.formatedURL.slice(0, this.formatedURL.length - 1);
        return `${platformURL}/history/device/${id}/history${this.formatedURL}`;
    };

    public formatToRequestDeviceHistory(platformURL: string, id: string, attributeName: string, params: Array<any>): string {
        this.formatedURL = Object.entries(params).reduce((url, param) => {
            return url + `${param[0]}=${param[1]}&`;
        }, '?');

        this.formatedURL = this.formatedURL.slice(0, this.formatedURL.length - 1);
        return `${platformURL}/history/STH/v1/contextEntities/type/device/id/${id}/attributes/${attributeName}${this.formatedURL}`;
    };

};

export = new DeviceRequest();