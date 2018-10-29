
<template>
    <el-dialog
            :visible="true"
            @close="onClose"
            :fullscreen="true">

        <table v-if="classes" class="sign-list">
            <caption>
                {{ classes.name }}
                （周{{ Utils.getWeekDay([classes.weekday]) }}
                {{ classes.classtime }}）
            </caption>
            <thead>
            <tr style="background: #ddd;">
                <th width="100">日期</th>
                <th width="50">课时</th>
                <th v-for="s in classes.studentList">
                    {{ s.name }}
                    <p>（剩余<span class="u-danger"> {{ (classes.course.hours - learnedHours[s.name] ) }}</span> 课时）</p>
                </th>
            </tr>
            <tr v-for="item in signTable">
                <td align="center">{{ item.date | moment('MM月DD日') }}</td>
                <td align="center">{{ item.hours }}</td>
                <td v-for="student in item.studentList" align="center">
                    <el-select v-model="student.status" @change="doSign(item.date, student)" size="mini">
                        <el-option :value="1" label="已签到"></el-option>
                        <el-option :value="0" label="请假"></el-option>
                    </el-select>
                    <el-tag type="success" v-if="student.status == 1" size="small">已签到</el-tag>
                    <el-tag type="danger" v-if="student.status == 0" size="small">请假</el-tag>
                </td>
            </tr>
            </thead>
        </table>

    </el-dialog>
</template>

<script>
    import classesService from '../service/ClassesService';
    import Utils from '../utils/Utils';

    export default {
        props: {
            classId: String
        },

        data () {
            return {
                Utils,
                classes: null,
                signTable: []
            }
        },

        created () {
            this._loadDetail();
        },

        computed: {
            //计算已学完的课时数
            learnedHours () {
                let result = {};
                this.classes.studentList.forEach( item => result[item.name] = 0 );
                this.signTable.forEach( dateRow => {
                    dateRow.studentList.forEach( stuRow => {
                        if(stuRow.status === 1) {
                            result[stuRow.name] += dateRow.hours;
                        }
                    });
                });

                return result;
            }
        },

        methods: {
            doSign (d, s) {
                const data = {date: d, name: s.name, status: s.status};
                classesService.sign(this.classId, data)
                    .then( ({ data }) => this._loadDetail() );
            },

            onClose () {
                this.$emit('on-close');
            },

            _loadDetail () {
                classesService.findById(this.classId).then( ({ data }) => {
                    this.classes = data;
                    this.signTable = this.classes.signTable;
                });
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