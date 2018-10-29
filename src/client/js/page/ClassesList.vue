
<template>
    <div>
        <div class="class-search-filter u-clear">
            <div class="u-fl">
                <el-select v-model="params.classId" placeholder="请选择班级" clearable filterable size="small" class="u-fl">
                    <el-option
                            v-for="item in top20List"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                    </el-option>
                </el-select>
                <el-date-picker class="u-ml20"
                        v-model="dateRange"
                        size="small"
                        @change="changeDateRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开班开始日期"
                        end-placeholder="开班结束日期">
                </el-date-picker>
            </div>


            <div class="u-fr">
                <el-button type="success" plain round size="small" @click="toForm()">+ 新增班级</el-button>
            </div>
        </div>

        <el-table
                :data="list"
                :cell-style="{padding: '3px 0'}"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="班级名称"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="teacher.name"
                    label="教师"
                    min-width="50">
                <template slot-scope="scope">
                    <el-popover
                            placement="left-start"
                            width="300"
                            trigger="click">
                        <ul style="line-height: 1.8;">
                            <li>教师姓名：{{ scope.row.teacher.name }}</li>
                            <li>微信号：{{ scope.row.teacher.wechat }}</li>
                            <li>电话：{{ scope.row.teacher.phone }}</li>
                            <li>备注：{{ scope.row.teacher.remark }}</li>
                        </ul>
                        <el-button type="text" slot="reference" @click="currentTeacher=scope.row.teacher">{{ scope.row.teacher.name }}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="course.name"
                    label="课程"
                    min-width="60">
                <template slot-scope="scope">
                    <el-popover
                            placement="left-start"
                            width="300"
                            trigger="click">
                        <ul style="line-height: 1.8;">
                            <li>课程名：{{ scope.row.course.name }}</li>
                            <li>课时数：{{ scope.row.course.hours }}</li>
                            <li>备注：{{ scope.row.course.remark }}</li>
                        </ul>
                        <el-button type="text" slot="reference">{{ scope.row.course.name }}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="学员信息"
                    min-width="40">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit-outline" @click="manageStudentClassId=scope.row._id">管理学员</el-button>
                </template>
            </el-table-column>
            <el-table-column
                    prop="startDate"
                    label="开班时间"
                    min-width="60">
                <template slot-scope="scope">
                    {{ scope.row.startDate | moment('YYYY-MM-DD') }}
                </template>
            </el-table-column>
            <el-table-column
                    prop="classtime"
                    label="上课时间"
                    min-width="60">
                <template slot-scope="scope">
                    每周{{ Utils.getWeekDay(scope.row.weekday) }} {{ scope.row.classtime }}
                </template>
            </el-table-column>
            <el-table-column
                    prop="hoursOfSign"
                    label="每次签到课时"
                    min-width="60">
                <template slot-scope="scope">
                    {{ scope.row.hoursOfSign }}课时
                </template>
            </el-table-column>
            <el-table-column
                    prop="fees"
                    label="课时费"
                    min-width="60">
                <template slot-scope="scope">
                    {{ scope.row.fees }}元
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="80">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="toForm(scope.row._id)"></el-button>
                    <el-button type="text" class="u-primary" icon="el-icon-tickets" v-if="isGenerateSignTable(scope.row)" @click="displaySignTable(scope.row._id)"></el-button>
                    <el-button type="text" class="u-primary" icon="el-icon-plus" v-else @click="generateSignTable(scope.row)">生成签到表</el-button>
                    <el-button type="text" class="u-danger" icon="el-icon-delete" @click="doDelete(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增或编辑班级 -->
        <class-form
                :classId="editClassId"
                @on-close="isShowDialog=false"
                @on-success="onSaveSuccess"
                v-if="isShowDialog">
        </class-form>

        <!-- 学员管理 -->
        <student-manage :classId="manageStudentClassId"
                        @on-close="manageStudentClassId=null"
                        v-if="manageStudentClassId">
        </student-manage>

        <!-- 签到表 -->
        <sign-table :classId="signClassId"
                    @on-close="isShowSignDialog=false"
                    v-if="isShowSignDialog">
        </sign-table>
    </div>
</template>

<script>
    import ClassForm from '../component/ClassesForm.vue';
    import StudentManage from '../component/StudentManage.vue';
    import SignTable from '../component/SignTable.vue';
    import classesService from '../service/ClassesService';
    import Utils from '../utils/Utils';

    export default {
        components: {
            ClassForm,
            StudentManage,
            SignTable
        },

        data () {
            return {
                Utils,
                dateRange: [],
                params: {
                    classId: '',
                    startDate: '',
                    endDate: '',
                    teacherId: '',
                    courseId: ''
                },
                list: [],

                top20List: [],
                editClassId: null,
                manageStudentClassId: null,
                signClassId: null,

                currentTeacher: null,

                isShowDialog: false,
                isShowSignDialog: false,
            }
        },

        watch: {
            params: {
                handler: function () {
                    this._loadList();
                },
                deep: true
            }
        },

        created () {
            this._loadList();
            this._findTop20();
        },

        methods: {
            toForm (editClassId) {
                this.editClassId = editClassId;
                this.isShowDialog = true;
            },

            setParam (key, value) {
                this.params[key] = value;
            },

            onSaveSuccess () {
                this._loadList();
                this.isShowDialog = false;
            },

            //生成签到表
            displaySignTable (classId) {
                this.signClassId = classId;
                this.isShowSignDialog = true;
            },

            //生成签到表
            generateSignTable (classes) {
                classesService.findById(classes._id).then( ({ data }) => {
                    if( this.isGenerateSignTable(data) ) return;

                    let { _id, startDate, hoursOfSign, weekday, course } = classes;
                    let studentList = data.studentList.map( s => ({ name: s.name, status: null }) );

                    let period = Utils.buildPeriod(course.hours, hoursOfSign, startDate, weekday);
                    let signTable = period.map( item => ({ date: item.date, hours: item.hours, studentList }) );

                    classesService.createSignTable(_id, signTable).then( res => {
                        this.$message.success('创建成功！');
                        this._loadList();
                    });
                });
            },

            changeDateRange () {
                this.setParam('startDate', this.dateRange ? this.dateRange[0] : '');
                this.setParam('endDate', this.dateRange? this.dateRange[1] : '');
            },

            isGenerateSignTable (cls) {
                return cls.signTable && cls.signTable.length > 0;
            },

            _findTop20 () {
                classesService.findTop20().then( ({ data }) => this.top20List = data );
            },

            _loadList () {
                classesService.findList(this.params).then( ({ data }) => this.list = data );
            }
        }
    }
</script>