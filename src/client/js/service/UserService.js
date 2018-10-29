


import axios from 'axios';
import BaseService from "./BaseService";

class UserService extends BaseService {
    constructor(model) {
        super(model);
    }

    login (data) {
        return axios.post(`/api/${this.model}/login`, data);
    }

    logout () {
        return axios.post(`/api/${this.model}/logout`);
    }
}

export default new UserService('user');