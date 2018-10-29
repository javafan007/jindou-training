
<template>
    <div>
        <div class="u-clear">
            <el-button type="success" class="u-fr" round plain size="small" @click="toForm()">+ 新增教师</el-button>
        </div>

        <el-table
                :data="list"
                :cell-style="{padding: '3px 0'}"
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="姓名"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="wechat"
                    label="微信号"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="course"
                    label="主讲课程"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注"
                    min-width="80">
                <template slot-scope="scope">
                    <span class="u-ellipsis">{{ scope.row.remark }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="教授班级"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="left-start"
                            width="700"
                            trigger="click">
                        <el-table :data="currentClasses" empty-text="还没有安排授课班级">
                            <el-table-column min-width="80" property="name" label="班级名称"></el-table-column>
                            <el-table-column min-width="80" property="course.name" label="课程名称"></el-table-column>
                            <el-table-column min-width="60" property="startDate" label="开班时间">
                                <template slot-scope="scope">
                                    {{ scope.row.startDate | moment('YYYY-MM-DD') }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="100" property="weekday" label="上课时间">
                                <template slot-scope="scope">
                                    每周{{ Utils.getWeekDay(scope.row.weekday) }} {{ scope.row.classtime }}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="text" slot="reference" @click="showClasses(scope.row._id)">查看</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="50">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="toForm(scope.row)"></el-button>
                    <el-tooltip content="查询课时费" placement="top-start">
                        <compute-fees :teacher="scope.row"></compute-fees>
                    </el-tooltip>
                    <el-button type="text" class="u-danger" icon="el-icon-delete" @click="doDelete(scope.row._id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-if="isShowFormDialog">
            <el-dialog
                    :visible="true"
                    title="新增教师"
                    @close="isShowFormDialog=false"
                    width="30%">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name" :maxlength="20" placeholder="输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="微信号" prop="wechat">
                        <el-input v-model="form.wechat" :maxlength="30" placeholder="输入微信号"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.phone" :maxlength="20" placeholder="输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="主讲课程">
                        <el-input v-model="form.course" :maxlength="20" placeholder="输入主讲课程"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="3" :maxlength="500" placeholder="输入描述" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShowFormDialog = false">取 消</el-button>
                    <el-button type="primary" @click="doSubmit">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import teacherService from '../service/TeacherService';
    import ComputeFees from '../component/ComputeFees.vue';
    import Utils from '../utils/Utils';

    export default {

        data () {
            return {
                Utils,
                list: [],

                form: {
                    name: '',
                    wechat: '',
                    phone: '',
                    course: '',
                    remark: ''
                },

                rules: {
                    name: [{ required: true, message: '请输入教师姓名', trigger: 'blur' }],
                    wechat: [{ required: true, message: '请输入微信号', trigger: 'blur' }]
                },

                isShowFormDialog: false,
                isShowFeesDialog: false,
                currentTeacher: null,
                currentClasses: []
            }
        },

        created () {
            this._loadList();
        },

        methods: {
            toForm (teacher) {
                this.isShowFormDialog = true;
                Object.assign(this.form, teacher || getEmptyForm());
            },

            //显示教师课时费
            showFeesDialog (teacher) {
                this.isShowFeesDialog = true;
                this.currentTeacher = teacher;
            },

            //显示当前教师所授课程
            showClasses (id) {
                teacherService.findClassesByTeacherId(id).then( ({ data = [] }) => {
                    this.currentClasses = data;
                });
            },

            doSubmit () {
                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        teacherService.update(this.form) :
                        teacherService.create(this.form);

                    p.then( res => {
                        this._loadList();
                        this.isShowFormDialog = false;
                    });
                });
            },

            doDelete (id) {
                teacherService.findClassesByTeacherId(id).then( ({ data = [] }) => {
                    if(data.length > 0) {
                        this.$message.warning('该教师已经有关联的班级，不能删除！');
                    } else {
                        teacherService.deleteById(id).then( res => this._loadList() );
                    }
                });
            },

            _loadList () {
                teacherService.findList().then( ({ data }) => this.list = data );
            }
        },

        components: {
            ComputeFees
        }
    }

    function getEmptyForm () {
        return {
            name: '',
            wechat: '',
            phone: '',
            course: '',
            remark: ''
        };
    }
</script>