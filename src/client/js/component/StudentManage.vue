
<template>
    <div>
        <el-dialog
                :visible="true"
                title="学员管理"
                @close="onClose"
                width="60%">

            <div class="u-clear">
                <el-button type="success" round plain size="small" class="u-fr" @click="isShowDialog=true">+ 新增学员</el-button>
            </div>
            <el-table
                    class="u-mt20"
                    :data="list"
                    :cell-style="{padding: '3px 0'}"
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="姓名"
                        min-width="50">
                </el-table-column>
                <el-table-column
                        prop="contact"
                        label="联系方式"
                        min-width="60">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="学校"
                        min-width="60">
                </el-table-column>
                <el-table-column
                        prop="grade"
                        label="年级"
                        min-width="40">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="家庭住址"
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

            <span slot="footer" class="dialog-footer">
                <el-button @click="onClose">关闭</el-button>
            </span>
        </el-dialog>

        <!--学员表单-->
        <student-form :classId="classId"
                      @on-close="isShowDialog=false"
                      @on-success="onSaveSuccess"
                      v-if="isShowDialog">
        </student-form>
    </div>
</template>

<script>
    import StudentForm from './StudentForm.vue';
    import BaseService from '../service/BaseService';

    const classService = new BaseService('classes');

    export default {

        props: {
            classId: String
        },

        components: {
            StudentForm
        },

        data () {
            return {
                list: [],
                isShowDialog: false
            }
        },

        created () {
            this._loadList();
        },

        methods: {
            toForm () {
                this.isShowDialog = true;
            },

            onSaveSuccess () {
                this.isShowDialog = false;
                this._loadList();
            },

            _loadList () {
                classService.findById(this.classId).then( ({ data }) => {
                    this.list = data.studentList;
                })
            },

            onClose () {
                this.$emit('on-close');
            }
        }
    }
</script>