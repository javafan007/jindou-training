
<template>
    <el-dialog
            :visible="true"
            title="新增学员"
            @close="onClose"
            append-to-body
            width="30%">

        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="输入姓名" :max-length="30"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="form.contact" placeholder="输入联系方式"></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="school">
                <el-input v-model="form.school" placeholder="输入学校"></el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
                <el-input v-model="form.grade" placeholder="输入年级"></el-input>
            </el-form-item>
            <el-form-item label="家庭住址" prop="address">
                <el-input v-model="form.address" placeholder="输入家庭住址"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" :rows="3" v-model="form.remark"  placeholder="输入备注"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">取 消</el-button>
                <el-button type="primary" @click="doSubmit">确 定</el-button>
            </span>
    </el-dialog>
</template>

<script>
    import axios from 'axios';
    import BaseService from '../service/BaseService';

    const classesService = new BaseService('classes');

    export default {

        props: {
            classId: String,
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

                }
            }
        },

        methods: {

            doSubmit () {
                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        classesService.update(this.form) :
                        axios.put(`/api/classes/${this.classId}/createStudent`, this.form);

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