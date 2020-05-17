const koa = require('koa')
const Router = require('koa-router')
const locale = require('koa-locale');
const logger = require('koa-logger');
const cors = require('@koa/cors');

const app = new koa()
const router = new Router()

router.get('/', (ctx) => {
  ctx.body = "Welcome! To the Koala Book of Everything!"
})

locale(app);

// CORS
app.use(cors({
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Origin, Accept-Language, Authorization, X-Requested-With, Content-Type, Accept',
	'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, PATCH, OPTIONS',
}));

app.use(logger());
app.use(router.routes()).use(router.allowedMethods())

app.listen(1234, () => console.log('running on port 1234'))