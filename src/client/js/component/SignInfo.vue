
<template>
    <el-dialog
            :visible="true"
            @close="onClose"
            :fullscreen="true">

        <table v-if="classes" class="sign-list">
            <caption>
                {{ classes.name }}
                （
                    周{{ weekDays[classes.weekday] }}
                    {{ classes.classtime }}
                ）
            </caption>
            <thead>
                <tr style="background: #ddd;">
                    <th width="100">日期</th>
                    <th width="50">课时</th>
                    <th v-for="s in classes.studentList">
                        {{ s.name }} <br>
                        （剩余<span class="u-danger"> {{ (classes.course.hours - computeLeftHours(s)) }}</span> 课时）</th>
                </tr>
                <tr v-for="(item, idx) in signTable">
                    <td align="center">{{ moment(item.date).format('MM月DD日') }}</td>
                    <td align="center">{{ (idx + 1) * classes.hoursOfSign }}</td>
                    <td v-for="s in classes.studentList" align="center">
                        <span v-if="getSignedStatus(item.date, s) !== undefined" class="u-icon-middle">
                            <i v-if="getSignedStatus(item.date, s) === 1" class="el-icon-success u-success"></i>
                            <i v-else="" class="el-icon-error u-danger"></i>
                        </span>
                        <span v-else>
                            <el-button type="text" size="small" @click="doSign(item.date, s, 1)">已签到</el-button>
                            <el-button type="text" size="small" @click="doSign(item.date, s,0)" class="u-danger">请假</el-button>
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
                weekDays: ['日', '一', '二', '三', '四', '五', '六'],
                classes: null,

                signTable: [],
                signInfo: {}
            }
        },

        created () {
            classesService.findById(this.classId).then( ({ data }) => {
                this.classes = data;
                this.signInfo = this.classes.signInfo;

                this._buildSignTable(data);
            });
        },

        methods: {

            //签到
            doSign (d, s, status) {
                let item = { key: this._generateSignKey(d, s), value: status };
                axios.put(`/api/classes/${this.classId}/sign`, item).then( ({ data }) => {
                    this.$set(this.signInfo, this._generateSignKey(d, s), status);
                });
            },

            //剩下多少课时
            computeLeftHours (student) {
                let sum = 0;
                this.signTable.forEach( item => {
                    if( this.getSignedStatus(item.date, student) === 1) {   //已签到
                        sum += this.classes.hoursOfSign;
                    }
                });
                return sum;
            },

            //获取签到状态
            getSignedStatus (d, s) {
                return this.signInfo[this._generateSignKey(d, s)];
            },

            onClose () {
                this.$emit('on-close');
            },

            //根据课时数以及开班起始时间，生成签到表
            _buildSignTable (classes) {

                Utils.buildPeriod()

                const totalCount = classes.course.hours / classes.hoursOfSign;   //签到次数
                const days = 365 * 2;                  //教学周期最长2年

                for(let inc = 0; inc < days; inc++) {
                    let newDate = this._getNewDate(classes.startDate, inc);

                    if(newDate.getDay() === classes.weekday) { //为上课的日期
                        this.signTable.push({ date: newDate });
                    }

                    if(this.signTable.length >= totalCount) return;
                }
            },

            _generateSignKey (date, student) {
                return moment(date).format('YYYYMMDD') + '-' + student._id;
            },

            _getNewDate(startDate, inc = 0) {
                const start = new Date(startDate);

                let newDate = new Date();
                newDate.setDate(start.getDate() + inc);

                return newDate;
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