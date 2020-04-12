
class DojotRequest {

    public getHeaders(token: string): Object {
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    };

};

export = DojotRequest;