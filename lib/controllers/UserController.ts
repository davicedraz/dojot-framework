import DojotRequest from '../models/DojotRequest';
import Controller from '../models/Controller';
import User from '../models/User';

const request = require('request-promise-native');

class UserController extends Controller {

    private provider = new DojotRequest();

    public createUser(user: User): Promise<Response> {
        return request.post(`${this.platformURL}/auth/user`, { headers: { 'Authorization': `Bearer ${this.token}` }, body: user, json: true })
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on create user method [POST]' };
                return result;
            }).catch(error => this.newError(error));
    };

    public getUsers(): Promise<Response> {
        return request.get(`${this.platformURL}/auth/user`, this.provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any users found on platform' };
                return result;
            }).catch(error => this.newError(error));
    };

    public getOneUser(id: string): Promise<Response> {
        return request.get(`${this.platformURL}/auth/user/${id}`, this.provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 404, message: 'Any user found with given id' };
                return result;
            }).catch(error => this.newError(error));
    };

    public updateOneUser(id: string, newUser: User): Promise<Response> {
        return request.put(`${this.platformURL}/auth/user/${id}`, { headers: { 'Authorization': `Bearer ${this.token}` }, body: newUser, json: true })
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on update user method [PUT]' };
                return result;
            }).catch(error => this.newError(error));
    };

    public deleteOneUser(id: string): Promise<Response> {
        return request.delete(`${this.platformURL}/auth/user/${id}`, this.provider.getHeaders(this.token))
            .then(result => {
                if (!result)
                    throw { status: 400, message: 'Dojot platform returns a error on delete user method [DELETE]' };
                return result;
            }).catch(error => this.newError(error));
    };

};

export = UserController;