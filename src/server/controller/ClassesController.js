
const Model = require('../db/model/Classes');
const moment = require('moment');

module.exports = self = {
    async create (ctx)  {
        const item = new Model(ctx.request.body);
        const r = await item.save();
        ctx.body = r;
    },

    async update (ctx) {
        const r = await Model.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = r;
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
        ctx.body = await Model.find({}, {_id: 1, name: 1}).limit(20).sort('-startDate');
    },

    async findById (ctx) {
        let item = await Model.findById(ctx.params.id)
            .populate('course')
            .populate('teacher')
            .exec();
        item = item.toJSON();
        item.startDate = new Date(item.startDate).getTime();

        ctx.body = item;
    },

    async deleteById (ctx) {
        await Model.findByIdAndRemove(ctx.params.id);
        ctx.body = 'ok';
    },

    //往班级中添加学员
    async createStudent (ctx) {
        const student = ctx.request.body;
        await Model.update({_id: ctx.params.id}, {$push: {studentList: student}});
        let classes = await Model.findById(ctx.params.id);

        classes.signTable.forEach( item => {
            item.studentList.push({name: student.name, status: null});
        });
        const r = await classes.save();

        ctx.body = r;
    },

    async updateStudent (ctx) {
        const { id, studentId } = ctx.params;
        const student = ctx.request.body;
        const r = await Model.update({_id: id, 'studentList._id': studentId }, {$set: {"studentList.$": student}});
        ctx.body = r;
    },

    async findStudent (ctx) {
        const { classId, studentId } = ctx.params;
        ctx.body = await Model.findById(classId, {"studentList": {$elemMatch: {"_id": studentId}}});
    },

    //签到
    async doSign (ctx) {
        const classes = await Model.findById(ctx.params.id);

        const data = ctx.request.body;
        classes.signInfo.set(data.key, data.value);

        const r = await classes.save();

        ctx.body = r;
    },

    //生成签到表
    async createSignTable (ctx) {
        const classes = await Model.findById(ctx.params.id);
        classes.signTable = ctx.request.body;
        const r = await classes.save();

        ctx.body = r;
    },

    async setSignTable (ctx) {
        const { date, name, status } = ctx.request.body;
        const classes = await Model.findById(ctx.params.id);

        let dateRecord = classes.signTable.find( item => moment(item.date).format('YYYYMMDD') == moment(new Date(date)).format('YYYYMMDD'));

        let student = dateRecord.studentList.find( item => item.name == name);
        if(student) {
            student.status = status;
        } else {
            dateRecord.studentList.push({ name, status });
        }

        ctx.body = await classes.save();
    },

    //获取签到信息
    async getSignInfo (ctx) {
        const classes = await Model.findById(ctx.params.id);

        ctx.body = classes.signInfo;
    }

    //修改班级中的学员信息
    // async updateStudent (ctx) {
    //     const student = ctx.request.body;
    //     Model.update({_id: ctx.params.id}, {$push: {studentList: }})
    //
    //     ctx.body = student;
    // }
};