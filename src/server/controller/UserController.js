
const Model = require('../db/model/User');


module.exports = {

    async login (ctx) {
        let { name, password } = ctx.request.body;
        let user = await Model.findOne({ name, password});

        if(user) {
            ctx.session.user = user;
            ctx.body = { name: user.name };
        } else {
            ctx.throw(417, '用户名或密码有误');
        }
    },

    async logout(ctx, next)  {
        ctx.session = null;
        ctx.body = 'success';
    }
};