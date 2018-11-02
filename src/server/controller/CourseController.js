
const Model = require('../db/model/Course');

module.exports = {
    async create (ctx)  {
        ctx.body = await Model.insert(ctx.request.body);
    },

    async update (ctx) {
        ctx.body = await Model.findByIdAndUpdate(ctx.params.id, ctx.request.body);;
    },

    async findList (ctx) {
        ctx.body = await Model.find({});
    },

    async deleteById (ctx) {
        ctx.body = await Model.findByIdAndRemove(ctx.params.id);;
    }
};