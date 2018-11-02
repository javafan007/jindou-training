
const Model = require('../db/model/Classes');
const moment = require('moment');

module.exports = self = {
    async create (ctx)  {
        ctx.body = await Model.insert(ctx.request.body);
    },

    async update (ctx) {
        ctx.body = await Model.findByIdAndUpdate(ctx.params.id, ctx.request.body);
    },

    async findList (ctx) {
        const { classId, startDate, endDate } = ctx.query;
        let params = {};
        if(classId) {
            params._id = classId;
        }
        if(startDate && endDate ) {
            params.startDate = {
                $gt: startDate,
                $lte: endDate
            }
        }
        ctx.body = await Model.find(params)
            .populate({path: 'course'})
            .populate({path: 'teacher'});
    },

    async findTop20 (ctx) {
        ctx.body = await Model.find({}, {_id: 1, name: 1})
            .limit(20)
            .sort('-startDate');
    },

    async findById (ctx) {
        let item = await Model.findById(ctx.params.id)
            .populate('course')
            .populate('teacher');

        item = item.toJSON();
        item.startDate = new Date(item.startDate).getTime();

        ctx.body = item;
    },

    async deleteById (ctx) {
        ctx.body = await Model.findByIdAndRemove(ctx.params.id);
    },

    //往班级中添加学员
    async createStudent (ctx) {
        let classes = await Model.findById(ctx.params.id);
        let stuList = classes.studentList;
        stuList.push(ctx.request.body);

        classes.signTable.forEach( item => {
            item.studentList.push({studentId: stuList[stuList.length - 1]._id, status: null});
        });

        ctx.body = await classes.save();
    },

    //修改班级中的学员信息
    async updateStudent (ctx) {
        const { id, studentId } = ctx.params;
        const student = ctx.request.body;

        ctx.body = await Model.update(
            {_id: id, 'studentList._id': studentId },
            {$set: {"studentList.$": student}}
        );
    },

    //查询学员详情
    async findStudentById (ctx) {
        const { id, studentId } = ctx.params;
        const classes = await Model.findById(id,
            {"studentList": {$elemMatch: {"_id": studentId}}}
        );
        ctx.body = classes.studentList[0];
    },

    //生成签到表
    async createSignTable (ctx) {
        ctx.body = await Model.update(
            {_id: ctx.params.id},
            {$set: {signTable: ctx.request.body}}
        );
    },

    //更改签到信息
    async saveSignItem (ctx) {
        const { id, signId } = ctx.params;

        ctx.body = await Model.update(
            {_id: id, 'signTable._id': signId},
            {$set: {'signTable.$': ctx.request.body}}
        );
    }
};