

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
                    label="名称"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="hours"
                    label="课时数"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="备注"
                    min-width="100">
            </el-table-column>
            <el-table-column
                    label="操作"
                    min-width="40">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" @click="toForm(scope.row)"></el-button>
                    <el-button type="text" class="u-danger" icon="el-icon-delete" @click="doDelete(scope.row._id)"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-if="isShowDialog">
            <el-dialog
                    :visible="true"
                    title="新增课程"
                    @close="isShowDialog=false"
                    width="30%">
                <el-form ref="form" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="form.name" placeholder="输入课程名称" :max-length="30"></el-input>
                    </el-form-item>
                    <el-form-item label="课时数" prop="name">
                        <el-input v-model="form.hours" placeholder="输入课时数"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="3" v-model="form.remark"  placeholder="输入备注"></el-input>
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

    const courseService = new BaseService('course');

    export default {
        data () {
            return {
                list: [],
                form: getEmptyForm(),

                rules: {
                    name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
                    hours: [{ required: true, message: '请输入课时数', trigger: 'blur' }]
                },

                isShowDialog: false
            }
        },

        created () {
            this._loadList();
        },

        methods: {
            toForm (course) {
                this.isShowDialog = true;
                Object.assign(this.form, course || getEmptyForm());
            },

            doAdd () {
                this.$refs.form.validate( valid => {
                    if(!valid) return;

                    let p = this.form._id ?
                        courseService.update(this.form) :
                        courseService.create(this.form);

                    p.then( res => {
                        this._loadList();
                        this.isShowDialog = false;
                    });
                });
            },

            doDelete (id) {
                courseService.deleteById(id).then( res => this._loadList() );
            },

            _loadList () {
                courseService.findList().then( ({ data }) => this.list = data );
            }
        }
    }

    function getEmptyForm () {
        return {
            _id: null,
            name: '',
            hours: null,
            remark: ''
        };
    }
</script>