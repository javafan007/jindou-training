
import axios from 'axios';
import BaseService from "./BaseService";

class TeacherService extends BaseService {
    constructor(modelName) {
        super(modelName);
    }


    findSignTablesByTeacherId (id, params) {
        return axios.get(`/api/teacher/${id}/signTable`, { params });
    }

    findClassesByTeacherId (id) {
        return axios.get(`/api/teacher/${id}/classes`);
    }
}

export default new TeacherService('teacher');