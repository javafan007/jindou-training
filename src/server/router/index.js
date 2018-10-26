

const Router = require('koa-router');
const CourseController = require('../controller/CourseController');
const TeacherController = require('../controller/TeacherController');
const ClassesController = require('../controller/ClassesController');

const router = new Router();


router.post('/api/course', CourseController.create);
router.put('/api/course/:id', CourseController.update);
router.get('/api/course', CourseController.findList);
router.delete('/api/course/:id', CourseController.deleteById);

router.post('/api/teacher', TeacherController.create);
router.put('/api/teacher/:id', TeacherController.update);
router.get('/api/teacher', TeacherController.findList);
router.delete('/teacher/:id', TeacherController.deleteById);

router.post('/api/classes', ClassesController.create);
router.put('/api/classes/:id', ClassesController.update);
router.put('/api/classes/:id/createStudent', ClassesController.createStudent);
router.get('/api/classes', ClassesController.findList);
router.get('/api/classes/top20', ClassesController.findTop20);
router.get('/api/classes/:id', ClassesController.findById);
router.delete('/api/classes/:id', ClassesController.deleteById);


router.get('*', async ctx => {
    await ctx.render('index');
});

module.exports = router;