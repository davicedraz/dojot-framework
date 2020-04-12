import AuthenticationService from './services/authentication-service';
import TemplateController from './controllers/template-controller'
import DeviceController from './controllers/device-controller';
import UserController from './controllers/user-controller';

import SocketService from './services/socket-service';

import Configuration from './models/Configuration';
import Controller from './models/Controller';

class Dojot {

    private platformURL: string;
    private username: string;
    private passwd: string;

    public authentication: AuthenticationService;
    public templates: Controller;
    public devices: Controller;
    public users: Controller;
    public socket: Object;

    constructor(config: Configuration) {
        this.platformURL = config.platformURL;
        this.username = config.credentials.username;
        this.passwd = config.credentials.passwd;
        this.services();
    };

    public init(): Promise<Dojot> {
        this.authentication = new AuthenticationService(this.platformURL, this.username, this.passwd);
        return this.authentication.getToken()
            .then(token => {
                this.templates = new TemplateController(this.platformURL, token);
                this.devices = new DeviceController(this.platformURL, token);
                this.users = new UserController(this.platformURL, token);
                return this;
            });
    };

    private services(): void {
        this.socket = new SocketService(this.platformURL, this.username, this.passwd);
    };

};

export = Dojot;