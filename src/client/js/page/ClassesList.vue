
<template>
    <div>
        <div class="class-search-filter u-clear">
            <el-select v-model="params.classId" placeholder="请选择班级" clearable filterable size="small" class="u-fl">
                <el-option
                        v-for="item in top20List"
                        :key="item._id"
                        :label="item.name"
                        :value="item._id">
                </el-option>
            </el-select>

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
            </el-table-column>
            <el-table-column
                    prop="course.name"
                    label="课程"
                    min-width="60">
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
                    {{ moment(scope.row.startDate).format('YYYY-MM-DD') }}
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="50">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="toForm(scope.row._id)"></el-button>
                    <el-button type="text" class="u-primary" icon="el-icon-tickets" @click="buildSign(scope.row._id)"></el-button>
                    <el-button type="text" class="u-danger" icon="el-icon-delete" @click="doDelete(scope.$index)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <class-form
                :classId="editClassId"
                @on-close="isShowDialog=false"
                @on-success="onSaveSuccess"
                v-if="isShowDialog">
        </class-form>

        <student-manage :classId="manageStudentClassId"
                        @on-close="manageStudentClassId=null"
                        v-if="manageStudentClassId">
        </student-manage>

        <sign-info :classId="signClassId"
                   @on-close="isShowSignDialog=false"
                   v-if="isShowSignDialog">
        </sign-info>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import ClassForm from '../component/ClassesForm.vue';
    import StudentManage from '../component/StudentManage.vue';
    import SignInfo from '../component/SignInfo.vue';
    import BaseService from '../service/BaseService';

    const classesService = new BaseService('classes');

    export default {
        components: {
            ClassForm,
            StudentManage,
            SignInfo
        },

        data () {
            return {
                moment,
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
            buildSign (classId) {
                this.signClassId = classId;
                this.isShowSignDialog = true;
            },

            _findTop20 () {
                axios.get('/api/classes/top20').then( ({ data }) => this.top20List = data );
            },

            _loadList () {
                classesService.findList(this.params).then( ({ data }) => this.list = data );
            }
        }
    }
</script>