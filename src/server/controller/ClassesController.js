
const Model = require('../db/model/Classes');

module.exports = {
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
        const { classId } = ctx.query;
        let params = {};
        if(classId) {
            params._id = classId;
        }

        ctx.body = await Model.find(params)
            .populate({path: 'course', select: 'name'})
            .populate({path: 'teacher', select: 'name'});
    },

    async findTop20 (ctx) {
        ctx.body = await Model.find({}, {_id: 1, name: 1}).limit(20).sort('-startDate');
    },

    async findById (ctx) {
        let item = await Model.findById(ctx.params.id);
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
        const r = await Model.update({_id: ctx.params.id}, {$push: {studentList: student}});

        ctx.body = r;
    },

    //修改班级中的学员信息
    // async updateStudent (ctx) {
    //     const student = ctx.request.body;
    //     Model.update({_id: ctx.params.id}, {$push: {studentList: }})
    //
    //     ctx.body = student;
    // }
};