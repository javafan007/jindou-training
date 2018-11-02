const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const views = require('koa-views');
const compress = require('koa-compress');
const session = require('koa-session');
const router = require('./router/index');
require('./db/index');



let app = new Koa();

app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'login_ticket', /** 默认 */
    maxAge: 24 * 60 * 60 * 1000,  /*  cookie的过期时间        【需要修改】  */
    overwrite: true,
    httpOnly: true, /**  true表示只有服务器端可以获取cookie */
    signed: true, /** 默认 签名 */
    rolling: true,
    renew: false,
};
app.use(session(CONFIG, app));

//压缩
app.use(compress());

//bodyParser
app.use(bodyParser());

//static
app.use(static(path.join(__dirname, '../client/dist'), {
    maxage: 0.5 * 60 * 60 * 1000
}));

//view
app.use(views(path.join(__dirname, '../client/dist'), { extension: 'html' }));

//统一错误处理
app.use( async (ctx, next) => {
    try {
        await next();
    } catch ( err ) {
        ctx.response.status = err.statusCode ||err.status || 500;
        ctx.response.body = err;
        ctx.app.emit('error', err, ctx);
    }
});


//登录拦截器
app.use( async (ctx, next) => {
    if( !ctx.session.user && ctx.path.startsWith('/api') && ctx.path !== '/api/user/login') {
        ctx.throw(401, '用户未登录！');
    } else {
        await next();
    }
});


app.use(router.routes()).use(router.allowedMethods());
app.listen(3005, () => console.log(`ENV=${process.env.NODE_ENV} listening on port 3005`));