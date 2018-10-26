
<template>
    <div>
        <div class="u-clear">
            <el-button type="success" class="u-fr" round plain size="small" @click="toForm()">+ 新增</el-button>
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
                    label="操作"
                    min-width="50">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="toForm(scope.row)"></el-button>
                    <el-button type="text" class="u-danger" icon="el-icon-delete" @click="doDelete(scope.row._id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-if="isShowDialog">
            <el-dialog
                    :visible="true"
                    title="新增教师"
                    @close="isShowDialog=false"
                    width="30%">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="微信号" prop="wechat">
                        <el-input v-model="form.wechat"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="主讲课程">
                        <el-input v-model="form.course"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isShowDialog = false">取 消</el-button>
                    <el-button type="primary" @click="doAdd">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import BaseService from '../service/BaseService';
    const teacherService = new BaseService('teacher');

    export default {

        data () {
            return {
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

                isShowDialog: false
            }
        },

        created () {
            this._loadList();
        },

        methods: {
            toForm (teacher = {name: '', wechat: '', phone: '', course: '', remark: ''}) {
                this.isShowDialog = true;
                console.log('--->', teacher)
                Object.assign(this.form, teacher);
            },

            doAdd () {
                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        teacherService.update(this.form) :
                        teacherService.create(this.form);

                    p.then( res => {
                        this._loadList();
                        this.isShowDialog = false;
                    });
                });
            },

            doDelete (id) {
                teacherService.deleteById(id).then( res => this._loadList() );
            },

            _loadList () {
                teacherService.findList().then( ({ data }) => this.list = data );
            }
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