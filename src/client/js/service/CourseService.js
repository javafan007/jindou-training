

import BaseService from "./BaseService";

class CourseService extends BaseService {
    constructor(modelName) {
        super(modelName);
    }
}

export default new CourseService('course');