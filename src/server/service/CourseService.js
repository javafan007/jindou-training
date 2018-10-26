const getDBService = require('../db/index');

const CourseService = {
    async save () {
        const dbService = await getDBService();
        const course = dbService.collection('course');
        let r = await course.insertOne({ a: 1} );

        return r;
    }
};

module.exports = CourseService;