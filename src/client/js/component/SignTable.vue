
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
                    {{ s.name }} <br>
                    （剩余<span class="u-danger"> {{ (classes.course.hours - learnedHours[s.name] ) }}</span> 课时）</th>
            </tr>
            <tr v-for="(item, dateIdx) in signTable">
                <td align="center">{{ moment(item.date).format('MM月DD日') }}</td>
                <td align="center">{{ (dateIdx + 1) * classes.hoursOfSign }}</td>
                <td v-for="(s, stuIdx) in item.studentList" align="center">
                    <span v-if="s.status !== null" class="u-icon-middle">
                        <i v-if="s.status === 1" class="el-icon-success u-success"></i>
                        <i v-else="" class="el-icon-error u-danger"></i>
                    </span>
                    <span v-else>
                        <el-button type="text" size="small" @click="doSign(item.date, s, 1, dateIdx, stuIdx)">已签到</el-button>
                        <el-button type="text" size="small" @click="doSign(item.date, s, 0, dateIdx, stuIdx)" class="u-danger">请假</el-button>
                    </span>
                </td>
            </tr>
            </thead>
        </table>

    </el-dialog>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import BaseService from '../service/BaseService';
    import Utils from '../utils/Utils';

    const classesService = new BaseService('classes');

    export default {
        props: {
            classId: String
        },

        data () {
            return {
                moment,
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
                            result[stuRow.name] += this.classes.hoursOfSign;
                        }
                    });
                });

                return result;
            }
        },

        methods: {
            doSign (d, s, status) {
                const data = {date: d, name: s.name, status: status};
                axios.put(`/api/classes/${this.classId}/setSignTable`, data)
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