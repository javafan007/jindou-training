
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const Login = () => import('../page/Login.vue');
const ClassesList = () => import('../page/ClassesList.vue');
const CourseList = () => import('../page/CourseList.vue');
const TeacherList = () => import('../page/TeacherList.vue');


const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', redirect: { name: 'classes' }},
        { name: 'login', path: '/login', component: Login},
        { name: 'classes', path: '/classes', component: ClassesList},
        { name: 'course', path: '/course', component: CourseList},
        { name: 'teacher', path: '/teacher', component: TeacherList}
    ]
});

export default router;