

const Router = require('koa-router');
const UserController = require('../controller/UserController');
const CourseController = require('../controller/CourseController');
const TeacherController = require('../controller/TeacherController');
const ClassesController = require('../controller/ClassesController');

const router = new Router();

router.post('/api/user/login', UserController.login);
router.post('/api/user/logout', UserController.logout);

router.post('/api/course', CourseController.create);
router.put('/api/course/:id', CourseController.update);
router.get('/api/course', CourseController.findList);
router.delete('/api/course/:id', CourseController.deleteById);

router.post('/api/teacher', TeacherController.create);
router.put('/api/teacher/:id', TeacherController.update);
router.get('/api/teacher/:id/signTable', TeacherController.findSignTablesByTeacherId);
router.get('/api/teacher/:id/export', TeacherController.exportExcel);
router.get('/api/teacher/:id/classes', TeacherController.findClassesByTeacherId);
router.get('/api/teacher', TeacherController.findList);
router.delete('/api/teacher/:id', TeacherController.deleteById);


router.post('/api/classes', ClassesController.create);
router.put('/api/classes/:id', ClassesController.update);
router.post('/api/classes/:id/student', ClassesController.createStudent);
router.put('/api/classes/:id/student/:studentId', ClassesController.updateStudent);
router.get('/api/classes/:id/student/:studentId', ClassesController.findStudentById);

router.put('/api/classes/:id/createSignTable', ClassesController.createSignTable);
router.put('/api/classes/:id/sign/:signId', ClassesController.saveSignItem);

router.get('/api/classes', ClassesController.findList);
router.get('/api/classes/top20', ClassesController.findTop20);
router.get('/api/classes/:id', ClassesController.findById);
router.delete('/api/classes/:id', ClassesController.deleteById);


router.get('*', async ctx => {
    await ctx.render('index');
});

module.exports = router;