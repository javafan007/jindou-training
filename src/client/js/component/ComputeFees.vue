
<template>
    <div class="u-inblock">
        <el-button type="text" icon="el-icon-view" @click="isShowDialog=true"></el-button>
        <el-dialog
                v-if="isShowDialog"
                :visible="true"
                :title="teacher.name + '的本月课时费'"
                @close="isShowDialog=false"
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
                </div>
                <div class="u-fr" style="font-size: 20px;">
                    <span class="u-ml20">总课时：<span class="u-danger u-num-fz-large">{{ totalHours }}</span></span>
                    <span class="u-ml20">总收入：<span class="u-danger u-num-fz-large">{{ totalFees }}</span> 元</span>
                </div>
            </div>

            <table class="fees-list" v-for="item in feesList">
                <caption class="fees-title">
                    <h2>{{ item.classes.name }}</h2>
                    <p class="u-mt10">
                        <span class="u-ml20">总课时：<span class="u-danger u-num-fz-middle">{{ item.totalHours }}</span></span>
                        <span class="u-ml20">课时费：<span class="u-danger u-num-fz-middle">{{ item.classes.fees }}</span> 元</span>
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
                        <el-tag type="success" v-if="s.status === 1" size="mini">{{ s.status * item.classes.hoursOfSign }} h</el-tag>
                        <el-tag type="danger" v-else-if="s.status === 0" size="mini">请假</el-tag>
                        <el-tag type="info" v-else size="mini">未打卡</el-tag>
                    </td>
                </tr>
                </thead>
            </table>
            <div v-if="feesList.length == 0" class="fees-no-result">您本月没有课时费哟 *^_^*</div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
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
                feesList: [],
                totalHours: 0,      //本月总课时
                totalFees: 0,       //本月总课时费
                isShowDialog: false
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
                        this.feesList = data;
                        this._setTotalHoursAndFees(data);
                    });
            },

            _setTotalHoursAndFees (feesList = []) {
                this.totalHours = this.totalFees = 0;
                feesList.forEach( cls => {
                    const { hoursOfSign, fees } = cls.classes;

                    //本月总签到次数
                    let totalSign = 0;
                    cls.signTable.forEach( dateRow => {
                        totalSign += dateRow.studentList.filter( stu => stu.status === 1 ).length;
                    });

                    cls.totalHours = totalSign * hoursOfSign;   //班级总课时
                    cls.totalFees = cls.totalHours * fees;  //班级总课时费

                    this.totalHours += cls.totalHours;  //本月所有班级总课时
                    this.totalFees += cls.totalFees;    //本月所有班级总课时费
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