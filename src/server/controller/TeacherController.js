
const Model = require('../db/model/Teacher');
const Classes = require('../db/model/Classes');
const moment = require('moment');

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

    async findSignTablesByTeacherId (ctx) {
        const tearcherId = ctx.params.id;

        let d = ctx.query.date && new Date(ctx.query.date) || new Date();
        let y = d.getFullYear();
        let m = d.getMonth();
        let start = moment(new Date(y, m, 1)).format('YYYY-MM-DD');
        let end = moment(new Date(y, m + 1, 0)).format('YYYY-MM-DD');

        let classes = await Classes.find({teacher: tearcherId,
            'signTable.date': {$gt: start, $lte: end}});

        let result = classes.map( cls => {
            return { classes: cls, signTable: cls.signTable.filter(isBetween) }
        });

        function isBetween (item) {
            let d = moment(item.date).format('YYYY-MM-DD');
            return d > start && d < end;
        }

        ctx.body = result;
    },

    async findClassesByTeacherId (ctx) {
        ctx.body = await Classes.find({teacher: ctx.params.id})
            .populate('course');
    },

    async deleteById (ctx) {
        await Model.findByIdAndRemove(ctx.params.id);

        ctx.body = 'ok';
    }
};