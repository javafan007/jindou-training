
import axios from 'axios';
import BaseService from "./BaseService";

class ClassesService extends BaseService {
    constructor(modelName) {
        super(modelName);
    }

    createSignTable (id, signTable) {
        return axios.put(`/api/${this.model}/${id}/createSignTable`, signTable);
    }

    findTop20 () {
        return axios.get(`/api/${this.model}/top20`);
    }

    updateStudent (classId, payload) {
        return axios.put(`/api/${this.model}/${classId}/student/${payload._id}`, payload);
    }

    createStudent (classId, payload) {
        return axios.post(`/api/${this.model}/${classId}/student`, payload);
    }

    findStudent (classId, studentId) {
        return axios.get(`/api/${this.model}/${classId}/student/${studentId}`);
    }
}

export default new ClassesService('classes');