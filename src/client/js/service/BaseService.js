
import axios from 'axios';



export default class BaseService {
    constructor(model) {
        this.model = model;
    }

    create (document) {
        return axios.post(`/api/${this.model}`, document);
    }

    update (document) {
        return axios.put(`/api/${this.model}/${document._id}`, document);
    }

    deleteById (id) {
        return axios.delete(`/api/${this.model}/${id}`);
    }

    findById (id) {
        return axios.get(`/api/${this.model}/${id}`);
    }

    findList (params = {}) {
        return axios.get(`/api/${this.model}`, { params })
    }
}