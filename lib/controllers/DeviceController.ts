import Device from '../models/Device';
import Controller from '../models/Controller';

import provider from '../providers/DeviceRequests';
import request from 'request-promise-native';

class DeviceController extends Controller {

    public createDevice(device: Device): Promise<Response> {
        return request.post(`${this.platformURL}/device`, { headers: { 'Authorization': `Bearer ${this.token}` }, body: device, json: true })
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on create device method [POST]' };
                return result;
            }).catch(error => this.newError(error));
    }

    public getOneDevice(id: string): Promise<Response> {
        return request.get(`${this.platformURL}/template/${id}`, provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any devices found with this id' };
                return result;
            }).catch(error => this.newError(error));
    }

    public getDevices(): Promise<JSON> {
        return request.get(`${this.platformURL}/device`, provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any devices found on platform' };
                return JSON.parse(result);
            }).catch(error => this.newError(error));
    }

    public getDeviceByTemplate(template_id: number): Promise<Response> {
        return request.get(`${this.platformURL}/device/template/${template_id}`, provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any devices found with given template id' };
                return result;
            }).catch(error => this.newError(error));
    };

    public getAllDevicesLabels(): Promise<any> {
        return this.getDevices()
            .then(result => {
                let labels = {};
                result.devices.forEach(device => { labels[device.id] = device.label });
                return labels;
            }).catch(error => this.newError(error));
    };

    public getAllDevicesIds(): Promise<Array<string>> {
        return this.getDevices()
            .then(result => {
                return result.devices.map(device => device.id);
            }).catch(error => this.newError(error));;
    };

    public async getAttributeValues(attributeName: string, value: any): Promise<Array<any>> {
        const devices_id = await this.getAllDevicesIds();

        const requestDevicesByAttribute = devices_id.map(id => {
            return this.getDeviceData(id, { attr: attributeName, lastN: 1 })
                .then(attr => {
                    if (attr.title) { return };
                    if (value && !attr[0].value === value) { return };
                    return attr[0].value;
                });
        });

        return Promise.all(requestDevicesByAttribute)
            .then(devices => {
                if (devices) {
                    const attributes_name = [];
                    devices.map(attribute => {
                        !attributes_name.includes(attribute) && attributes_name.push(attribute)
                    });
                    return attributes_name;
                }
            });
    };

    //FIXME: doesnt work if your have devices with no value to the attribute passed by
    public async getDevicesByAttribute(attribute: string, value: any): Promise<Object> {
        const devices_id = await this.getAllDevicesIds();
        //FIXME: dont use this function, make your own request
        const attributes_names = await this.getAttributeValues(attribute, value);

        const requestDevicesData = devices_id.map(id => {
            return this.getDeviceData(id, { lastN: 1 });
        });

        return Promise.all(requestDevicesData)
            .then(devices_data => {
                let attribute_devices = {};
                attributes_names.forEach(name => {
                    attribute_devices[name] = [];
                });
                devices_data.forEach(device => {
                    let name = device[attribute][0].value;
                    attribute_devices[name].push(device);
                });
                return attribute_devices;
            });
    };

    public updateOneDevice(id: string, newDevice: Device): Promise<Response> {
        return request.put(`${this.platformURL}/device/${id}`, { headers: { 'Authorization': `Bearer ${this.token}` }, body: newDevice, json: true })
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on update one device method [PUT]' };
                return result;
            }).catch(error => this.newError(error));
    };

    public deleteOneDevice(id: string): Promise<JSON> {
        return request.delete(`${this.platformURL}/device/${id}`, provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on delete one device method [DELETE]' };
                return JSON.parse(result);
            }).catch(error => this.newError(error));
    };

    public getDeviceData(id: string, params: any): Promise<JSON> {
        return request.get(provider.formatToRequestDeviceData(this.platformURL, id, params), provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'No data found with given device id' };
                return JSON.parse(result);
            }).catch(error => this.newError(error));
    };

    getDeviceHistory(id: string, attributeName: string, params: any): Promise<JSON> {
        return request.get(provider.formatToRequestDeviceHistory(this.platformURL, id, attributeName, params), provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'No history data found with given paramaters' };
                return JSON.parse(result);
            }).catch(error => this.newError(error));
    };

};

export = DeviceController;