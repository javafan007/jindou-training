
<template>
    <el-dialog
            :visible="true"
            title="新增班级"
            @close="onClose"
            width="30%">

        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="班级名称" prop="name">
                <el-input v-model="form.name" :maxlength="30" placeholder="请输入班级名称"></el-input>
            </el-form-item>
            <el-form-item label="教师" prop="teacher">
                <el-select v-model="form.teacher" placeholder="请选择教师" style="width: 100%;">
                    <el-option
                            v-for="item in teacherList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="课程" prop="course">
                <el-select v-model="form.course" placeholder="请选择课程" style="width: 100%;">
                    <el-option
                            v-for="item in courseList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开班日期" prop="startDate">
                <el-date-picker style="width: 100%;"
                        v-model="form.startDate"
                        value-format="timestamp"
                        type="date"
                        placeholder="请选择开班日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="每周几上课" prop="startDate">
                <el-select v-model="form.weekday" style="width: 100%;" placeholder="请选择周几上课">
                    <el-option :label="'周' + weekday" :value="(idx + 1) % 7" v-for="(weekday, idx) in weekDays"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="onClose">取 消</el-button>
            <el-button type="primary" @click="doSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>


<script>
    import BaseService from '../service/BaseService';

    const courseService = new BaseService('course');
    const teacherService = new BaseService('teacher');
    const classesService = new BaseService('classes');

    export default {
        props: {
            classId: String
        },

        data () {
            return {
                weekDays: ['一', '二', '三', '四', '五', '六', '日'],
                courseList: [],
                teacherList: [],
                form: getEmptyForm(),
                rules: {
                    name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
                    course: [{ required: true, message: '请选择课程', trigger: 'blur' }],
                    teacher: [{ required: true, message: '请选择老师', trigger: 'blur' }],
                    startDate: [{ required: true, message: '请选择开班时间', trigger: 'blur' }],
                }
            }
        },

        created () {
            courseService.findList().then( ({ data }) => this.courseList = data );
            teacherService.findList().then( ({ data }) => this.teacherList = data );

            if(this.classId) {
                classesService.findById(this.classId)
                    .then( ({ data }) => Object.assign(this.form, data) )
            }
        },

        methods: {
            doSubmit () {
                console.log(this.form);

                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        classesService.update(this.form) :
                        classesService.create(this.form);

                    p.then( res => this.$emit('on-success') );
                });
            },

            onClose () {
                this.$emit('on-close');
            }
        }
    }

    function getEmptyForm () {
        return {
            name: '',           //班级名称
            course: null,     //课程
            teacher: null,    //教师
            startDate: null,    //开班时间
            weekday: null,
            remark: ''
        };
    }
</script>