import Controller from '../models/Controller';
import Template from '../models/Template';
import Attribute from '../models/Attribute';

import provider from '../providers/TemplateRequests';
import request from 'request-promise-native';

class TemplateController extends Controller {

    public createTemplate(template: Template): Promise<Template> {
        return request.post(`${this.platformURL}/template`, { headers: { 'Authorization': `Bearer ${this.token}` }, body: template, json: true })
            .then(response => {
                if (response.result !== 'ok')
                    throw { status: 400, message: 'Dojot platform returns a error on create template method [POST]' };
                return response.template;
            }).catch(error => this.newError(error));
    };

    public getTemplates(attr: Attribute, params: Array<any>): Promise<JSON> {
        return request.get(provider.formatToRequestTemplates(this.platformURL, attr, params), provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any templates found with this attribute or parameters' };
                return JSON.parse(result);
            }).catch(error => this.newError(error));
    };

    getOneTemplate(id: string): Promise<Template> {
        return request.get(`${this.platformURL}/template/${id}?attr_format=split`, provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any templates found with given id' };
                return result;
            }).catch(error => this.newError(error));
    };

};

export = TemplateController;