import DojotRequest from '../models/DojotRequest';
import Attribute from '../models/Attribute';

class TemplateRequest extends DojotRequest {

    private formatedURL: string;

    public formatToRequestTemplates(platformURL: string, attr: Attribute, params: Array<any>): string {
        if (params) {
            this.formatedURL = Object.entries(params).reduce((url, param) => {
                return url + `${param[0]}=${param[1]}&`;
            }, '?');
            this.formatedURL = this.formatedURL.slice(0, this.formatedURL.length - 1);
        }

        if (!params && !attr) return `${platformURL}/template`;
        return attr ? `${platformURL}/template?attr=${attr.label}=${attr.value}` : `${platformURL}/template${this.formatedURL}`;
    };

};

export = new TemplateRequest();