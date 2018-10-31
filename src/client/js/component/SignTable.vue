
<template>
    <el-dialog
            :visible="true"
            @close="onClose"
            :fullscreen="true">

        <!-- 签到表单 -->
        <table v-if="classes && isShowPrintPreview === false" class="sign-list">
            <caption class="u-clear">
                {{ classes.name }}
                （周{{ Utils.getWeekDay([classes.weekday]) }}
                {{ classes.classtime }}）

                <el-button type="success" plain round class="u-fr" @click="isShowPrintPreview=true">打印预览签到表</el-button>
            </caption>
            <thead>
            <tr class="sign-header-row">
                <th>日期</th>
                <th>课时</th>
                <th v-for="s in classes.studentList">
                    {{ s.name }}
                    <p>（剩余<span class="u-danger u-num-fz-middle"> {{ (classes.course.hours - learnedHours[s._id] ) }}</span> 课时）</p>
                </th>
            </tr>
            <tr v-for="item in signTable">
                <td align="center">
                    <el-date-picker style="width: 150px;"
                            :editable="false"
                            :clearable="false"
                            size="small"
                            v-model="item.date"
                            type="date"
                            @change="updateSignItem(item)"
                            placeholder="选择日期">
                    </el-date-picker>
                </td>
                <td align="center">{{ item.hours }}</td>
                <td v-for="student in item.studentList" align="center">
                        <el-radio-group v-model="student.status" @change="updateSignItem(item)">
                            <el-radio :label="1">签到</el-radio>
                            <el-radio :label="0">请假</el-radio>
                        </el-radio-group>
                </td>
            </tr>
            </thead>
        </table>

        <!-- 打印预览 -->
        <div v-if="isShowPrintPreview">
            <div class="u-center">
                <el-button plain round @click="isShowPrintPreview=false">取消</el-button>
                <el-button type="success" plain round @click="print">打印</el-button>
            </div>
            <div id="printArea">
                <table v-if="classes" style="width: 100%; border-collapse: collapse;">
                    <caption style="font-size: 24px;padding: 20px 0;">
                        {{ classes.name }}
                        （周{{ Utils.getWeekDay([classes.weekday]) }}
                        {{ classes.classtime }}）
                    </caption>
                    <thead>
                    <tr>
                        <th width="150" style="padding: 5px 10px;border: 1px solid #333;">日期</th>
                        <th width="80" style="padding: 5px 10px;border: 1px solid #333;">课时</th>
                        <th v-for="s in classes.studentList" style="padding: 5px 10px;border: 1px solid #333;">
                            {{ s.name }}
                        </th>
                    </tr>
                    <tr v-for="item in signTable">
                        <td align="center" style="padding: 5px 10px;border: 1px solid #333;">
                            {{ item.date | moment('YYYY年MM月DD日') }}
                        </td>
                        <td align="center" style="padding: 5px 10px;border: 1px solid #333;">{{ item.hours }}</td>
                        <td v-for="student in item.studentList" align="center" style="padding: 5px 10px;border: 1px solid #333;"></td>
                    </tr>
                    </thead>
                </table>
            </div>
        </div>

    </el-dialog>
</template>

<script>
    import classesService from '../service/ClassesService';
    import Utils from '../utils/Utils';

    export default {
        props: {
            classId: String
        },

        data () {
            return {
                Utils,
                classes: null,
                signTable: [],

                isShowPrintPreview: false
            }
        },

        created () {
            this._loadDetail();
        },

        computed: {
            //计算已学完的课时数
            learnedHours () {
                let result = {};
                this.classes.studentList.forEach( item => result[item._id] = 0 );
                this.signTable.forEach( dateRow => {
                    dateRow.studentList.forEach( stuRow => {
                        if(stuRow.status === 1) {
                            result[stuRow.studentId] += dateRow.hours;
                        }
                    });
                });

                console.log('--->', result)

                return result;
            }
        },

        methods: {
            onClose () {
                this.$emit('on-close');
            },

            updateSignItem (signItem) {
                classesService.sign(this.classId, signItem)
                    .then( ({ data }) => this._loadDetail() );
            },

            print: function () {
                var el = document.getElementById('printArea');
                var iframe = document.createElement('IFRAME');
                var doc = null;
                iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
                document.body.appendChild(iframe);
                doc = iframe.contentWindow.document;
                doc.write('<div>' + el.innerHTML + '</div>');
                doc.close();
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                if (navigator.userAgent.indexOf("MSIE") > 0) {
                    document.body.removeChild(iframe);
                }
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
        color: #333;
        padding: 20px 0;
        font-size: 24px;
    }
    .sign-header-row {
        background: #333;
        color: #fff;
    }
    .sign-header-row th {
        padding: 5px;
    }
    .sign-list td {
        border: 1px solid #ddd;
        padding: 5px 10px;
    }
</style>