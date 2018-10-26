
const Model = require('../db/model/Teacher');

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
        ctx.body = await Model.find({});
    },

    async deleteById (ctx) {
        await Model.findByIdAndRemove(ctx.params.id);

        ctx.body = 'ok';
    }
};