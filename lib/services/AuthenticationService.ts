import request from 'request-promise-native';

class AuthenticationService {

    private username: string;
    private platformUrl: string;
    private passwd: string;

    constructor(platformUrl, username, passwd) {
        this.platformUrl = platformUrl;
        this.username = username;
        this.passwd = passwd;
    }

    public getToken(): Promise<string> {
        return this.login(this.username, this.passwd)
            .then((result) => result.jwt);
    };

    public login(username: string, passwd: string): Promise<Response> {
        return request({
            method: 'POST',
            url: `${this.platformUrl}/auth`,
            headers: { 'Content-Type': 'application/json; charset=utf-8', },
            body: { username, passwd },
            json: true
        });
    };

    public async getSocketToken(): Promise<string> {
        const jwtKey = await this.getToken();
        console.log("TCL: AuthenticationService -> getSocketToken -> jwtKey", jwtKey)
        const options = {
            method: 'GET',
            url: `${this.platformUrl}/stream/socketio`,
            json: true,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${jwtKey}`
            }
        };
        return request(options)
            .then((response) => {
                console.log("TCL: AuthenticationService -> getSocketToken -> response", response)
                return response.token;
            });
    };

};

export = AuthenticationService;