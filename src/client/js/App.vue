
<template>
    <div class="wrap">
        <header class="header u-clear">
            <nav class="u-fl">
                <div class="company-logo"><i class="el-icon-edit">金都书院</i></div>
                <router-link :to="{name: 'classes'}" class="header-item" :class="{'header-item--selected': $route.name == 'classes'}">班级管理</router-link>
                <router-link :to="{name: 'course'}" class="header-item" :class="{'header-item--selected': $route.name == 'course'}">课程管理</router-link>
                <router-link :to="{name: 'teacher'}" class="header-item" :class="{'header-item--selected': $route.name == 'teacher'}">教师管理</router-link>
            </nav>

            <div class="u-fr">
                <span class="header-item">{{ userName }}</span>
                <a href="javascript:;" class="header-item" @click="logout">退出</a>
            </div>
        </header>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import userService from './service/UserService';

    export default {
        data () {
            return {

            }
        },

        computed: {
            userName () {
                if(localStorage.userInfo) {
                    return JSON.parse(localStorage.userInfo).name;
                }
                return '';
            }
        },

        methods: {
            logout () {
                userService.logout().then(res => {
                    delete localStorage['userInfo'];
                    this.$router.push({ name: 'login'});
                });
            }
        }
    }
</script>

<style>
    .header {
        width: 100%;
        padding: 0 50px;
        background: #409EFF;
        line-height: 38px;
    }
    .company-logo {
        display: inline-block;
        padding: 0 20px;
        color: #fff;
        font-family: Lishu;
        font-weight: 700;
        font-size: 20px;
        text-shadow: 0px 2px 2px #333;
    }

    .header-item {
        display: inline-block;
        text-decoration: none;
        color: #fff;
        height: 100%;
        padding: 0 10px;
        font-size: 14px;
        opacity: .9;
    }
    .header-item:hover {
        opacity: .7;
    }
    .header-item--selected {
        background: rgba(0, 0, 0, .3);
    }
    .content {
        padding: 20px;
    }
</style>