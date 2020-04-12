const request = require('request-promise-native');
const sio = require('socket.io-client');

class SocketService {

    platformUrl: any;
    username: any;
    passwd: any;

    constructor(platformUrl, username, passwd) {
        this.platformUrl = platformUrl;
        this.username = username;
        this.passwd = passwd;
    }

    _startupSocket(url, token) {
        const query = {
            query: {
                token,
            },
            transports: ["polling"],
        };

        return sio(url, query);
    }

    async _getAuth() {
        const options = {
            method: 'POST',
            url: `${this.platformUrl}/auth`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: {
                username: this.username,
                passwd: this.passwd
            },
            json: true
        };
        return await request(options)
            .then(result => result.jwt)
            .catch(err => {
                return err
            });
    }

    startSocket(socketService) {
        this._getAuth().then(async (jwtKey) => {
            const options = {
                method: 'GET',
                url: `${this.platformUrl}/stream/socketio`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': `Bearer ${jwtKey}`
                },
                json: true
            };
            return request(options)
                .then((response) => {
                    let socket = this._startupSocket(this.platformUrl, response.token);
                    socket.on(`all`, (data) => {
                        socketService.getDataFromSocket(data);
                    });
                })
                .catch(error => {
                    console.log(`Erro: ${error} on connect to Dojot Socket`);
                });
        }).catch((error) => {
            console.log(`Erro: ${error} on try to authenticate to Dojot platform`);
        });
    }
};

export = SocketService;