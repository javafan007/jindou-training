
<template>
    <div class="wrap">
        <el-tabs v-model="activeItem" @tab-click="handleClick">
            <el-tab-pane label="班级管理" name="classes"></el-tab-pane>
            <el-tab-pane label="课程管理" name="course"></el-tab-pane>
            <el-tab-pane label="教师管理" name="teacher"></el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                activeItem: 'classes'
            }
        },

        methods: {
            handleClick() {
                this.$router.push({ name: this.activeItem });
            }
        }
    }
</script>