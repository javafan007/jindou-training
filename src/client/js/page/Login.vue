

<template>
    <el-dialog v-cloak
               title="用户登录"
               :show-close="false"
               :visible="true"
               width="30%">

        <el-form ref="form" :model="form" label-width="80px" :rules="rules" style="width: 90%;">
            <el-form-item label="用户名" prop="name">
                <el-input v-model.trim="form.name" placeholder="工号" :maxlength="10" autofocus clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model.trim="form.password" @keyup.enter.native="doLogin" placeholder="密码" :maxlength="15" clearable></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="doLogin" :disabled="isLogin">登录</el-button>
          </span>
    </el-dialog>
</template>


<script>
    import axios from 'axios';

    import userService from '../service/UserService';

    export default {
        data () {
            return {
                form: {
                    name: '',
                    password: '',
                },
                rules: {
                    name: [{ required: true, message: '请输入用户名', trigger: 'change' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'change' }]
                },
                isLogin: false
            }
        },

        methods: {
            doLogin: function () {
                if(this.isLogin) return;

                this.$refs['form'].validate( valid => {
                    if(!valid) return;

                    this.isLogin = true;
                    userService.login(this.form).then( ({ data }) => {
                        this.isLogin = false;
                        localStorage['userInfo'] = JSON.stringify(data);
                        this.$router.replace({name: 'classes'});
                    }).catch( e => {
                        this.isLogin = false;
                        this.$message.error('用户名或密码错误');
                    });
                });
            }
        }
    }
</script>