
<template>
        <el-dialog
                :visible="true"
                :title="teacher.name + '的本月课时费'"
                @close="onClose"
                width="60%">

            <div class="class-search-filter">
                <div class="u-fl">
                    月份：
                    <el-select v-model="params.date" placeholder="请选择月份" filterable size="small" @change="loadClasses">
                        <el-option
                                v-for="item in _buildDateRange()"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="success" plain round @click="exportExcel" size="small" class="u-ml10">导出excel</el-button>
                </div>
                <div class="u-fr" style="font-size: 20px;">
                    <span class="u-ml20">总课时：<span class="u-danger u-num-fz-large">{{ totalHours }}</span></span>
                    <span class="u-ml20">总收入：<span class="u-danger u-num-fz-large">{{ totalFees }}</span> 元</span>
                </div>
            </div>

            <table class="fees-list" v-for="item in classesList">
                <caption class="fees-title">
                    <h2>{{ item.cls.name }}</h2>
                    <p class="u-mt10">
                        <span class="u-ml20">总课时：<span class="u-danger u-num-fz-middle">{{ item.totalHours }}</span></span>
                        <span class="u-ml20">课时费：<span class="u-danger u-num-fz-middle">{{ item.cls.fees }}</span> 元</span>
                        <span class="u-ml20">收入：<span class="u-danger u-num-fz-middle">{{ item.totalFees }}</span> 元</span>
                    </p>
                </caption>
                <thead>
                <tr>
                    <th width="100">日期</th>
                    <th v-for="s in item.signTable[0].studentList">
                        {{ s.name }}
                    </th>
                </tr>
                <tr v-for="row in item.signTable">
                    <td align="center">{{ moment(row.date).format('MM月DD日') }}</td>
                    <td v-for="s in row.studentList" align="center">
                        <el-tag type="success" v-if="s.status === 1" size="mini">{{ s.status * item.cls.hoursOfSign }} h</el-tag>
                        <el-tag type="danger" v-else-if="s.status === 0" size="mini">请假</el-tag>
                        <el-tag type="info" v-else size="mini">未打卡</el-tag>
                    </td>
                </tr>
                </thead>
            </table>
            <div v-if="classesList.length == 0" class="fees-no-result">您本月没有课时费哟 *^_^*</div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">取 消</el-button>
            </span>
        </el-dialog>
</template>

<script>
    import moment from 'moment';
    import teacherService from '../service/TeacherService';

    export default {
        props: {
            teacher: Object
        },

        data () {
            return {
                moment,
                params: {
                    date: moment(new Date()).format('YYYY-MM-DD')
                },

                /**
                 *  {
                 *  totalHours,
                 *  totalFees,
                 *  classesList: [
                 *      {totalHours, totalFees, cls: {}, signTable: [] }
                 *  ] }
                 */
                classesList: [],
                totalHours: 0,      //本月总课时
                totalFees: 0       //本月总课时费
            }
        },

        created () {
            this.loadClasses();
            this._buildDateRange();
        },

        methods: {
            loadClasses () {
                teacherService.findSignTablesByTeacherId(this.teacher._id, this.params)
                    .then( ({ data }) => {
                        this.classesList = data.classesList;
                        this.totalHours = data.totalHours;
                        this.totalFees = data.totalFees;
                    });
            },

            _buildDateRange () {
                let end = new Date();
                let result = [];

                //可查看最近12个月的课时费
                for(let i=12; i>=0; i--) {
                    let d = new Date();
                    d.setMonth(end.getMonth() - i);
                    
                    result.push({
                       value: moment(d).format('YYYY-MM-DD'),
                       label: moment(d).format('YYYY年MM月')
                    });
                }
                return result.reverse();
            },

            exportExcel () {
                window.location = `/api/teacher/${this.teacher._id}/export?date=${this.params.date}`;
            },

            onClose () {
                this.$emit('on-close');
            }
        }
    }
</script>

<style>
    .fees-list {
        width: 100%;
        border-collapse: collapse;
        box-shadow: 0px 0px 1px 0 #ccc;
    }
    .fees-title {
        padding: 40px 0 10px 0;
    }
    .fees-list th {
        padding: 5px 10px;
        font-weight: normal;
        background: #409EFF;
        color: rgba(255, 255, 255, .8);
    }
    .fees-list td {
        padding: 10px;
    }
    .fees-list tr:nth-child(odd) {
        background: rgba(0, 0, 0, .04);
    }

    .fees-no-result {
        font-size: 20px;
        padding-top: 50px;
        text-align: center;
    }
</style>