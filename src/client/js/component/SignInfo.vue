
<template>
    <el-dialog
            :visible="true"
            @close="onClose"
            :fullscreen="true">

        <table v-if="classes" class="sign-list">
            <caption>{{ classes.name }} （周{{ weekDays[classes.weekday] }}）</caption>
            <thead>
                <tr>
                    <th width="80">日期</th>
                    <th width="50">课时</th>
                    <th v-for="s in classes.studentList">{{ s.name }}</th>
                </tr>
                <tr v-for="item in signList">
                    <td>{{ moment(item.date).format('MM月DD日') }}</td>
                    <td>1</td>
                    <td v-for="s in classes.studentList">&nbsp;</td>
                </tr>
            </thead>
        </table>

    </el-dialog>
</template>

<script>
    import moment from 'moment';
    import BaseService from '../service/BaseService';

    const classesService = new BaseService('classes');

    export default {
        props: {
            classId: String
        },

        data () {
            return {
                moment,
                weekDays: ['日', '一', '二', '三', '四', '五', '六'],
                classes: null,
                signList: []
            }
        },

        created () {
            classesService.findById(this.classId).then( ({ data }) => {
                this.classes = data;
                this.buildSignList()
            } );
        },

        methods: {
            onClose () {
                this.$emit('on-close');
            },

            buildSignList () {
                const classes = this.classes;
                let start = new Date(classes.startDate);

                for(let i=1; i<30; i++) {
                    let d = new Date();
                    d.setDate(start.getDate() + i);

                    console.log(d.getDay(), classes.weekday);
                    if(d.getDay() === classes.weekday) {
                        this.signList.push({ date: d });
                    }
                }
            }
        }
    }
</script>

<style>
    .sign-list {
        width: 100%;
        border-collapse: collapse;
    }
    .sign-list caption {
        padding: 20px 0;
        font-size: 20px;
    }
    .sign-list td,
    .sign-list th {
        border: 1px solid #666;
        padding: 5px 10px;
    }
</style>