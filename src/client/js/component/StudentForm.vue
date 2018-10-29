
<template>
        <el-dialog
                :visible="true"
                title="新增学员"
                @close="onClose"
                append-to-body
                width="30%">

            <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="form.name" placeholder="注：创建后姓名不可以更改" :max-length="30"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="contact">
                    <el-input v-model="form.contact" placeholder="输入联系方式" :max-length="20"></el-input>
                </el-form-item>
                <el-form-item label="学校" prop="school">
                    <el-input v-model="form.school" placeholder="输入学校":max-length="30"></el-input>
                </el-form-item>
                <el-form-item label="年级" prop="grade">
                    <el-input v-model="form.grade" placeholder="输入年级":max-length="20"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" prop="address">
                    <el-input v-model="form.address" placeholder="输入家庭住址":max-length="100"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="3" v-model="form.remark" :max-length="500" placeholder="输入备注"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="doSubmit">确 定</el-button>
            </span>
        </el-dialog>
</template>

<script>
    import classesService from '../service/ClassesService';

    export default {

        props: {
            classId: String,
            studentId: String
        },

        data () {
            return {
                form: {
                    name: '',
                    contact: '',
                    school: '',
                    grade: '',
                    address: '',
                    remark: ''
                },

                rules: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
                    school: [{ required: true, message: '请输入学校', trigger: 'blur' }],
                    grade: [{ required: true, message: '请输入年级', trigger: 'blur' }]
                }
            }
        },

        created () {
            classesService.findStudent(this.classId, this.studentId).then( ({ data }) => {
                if(data.studentList.length > 0 ){
                    Object.assign(this.form, data.studentList[0]);
                }
            });
        },

        methods: {
            doSubmit () {
                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        classesService.updateStudent(this.classId, this.form) :
                        classesService.createStudent(this.classId, this.form);

                    p.then( res => {
                        this.$message.success('添加成功！');
                        this.$emit('on-success');
                    } );
                });
            },

            onClose () {
                this.$emit('on-close');
            }
        }
    }
</script>