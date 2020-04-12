
class Controller {

    public token: string;
    public platformURL: string;

    constructor(platformURL, token) {
        this.platformURL = platformURL;
        this.token = token;
    }

    public newError(error) {
        throw { status: error.status || error.statusCode || 500, message: error.message || error };
    }

};

export = Controller;