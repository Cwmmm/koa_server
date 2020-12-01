import './init'
import Koa from "koa"
import KoaBody from "koa-body"
import KoaRouter from 'koa-router'
import KoaJwt from 'koa-jwt'
import KoaStatic from 'koa-static'
import path from 'path'
import history from 'koa-connect-history-api-fallback'
import compress from 'koa-compress'
const app = new Koa()
const options = { threshold: 2048 };
app.use(compress(options));
app.use(history({ whiteList: ['/api'] }));
app.use( async(ctx,next) => {
  //跨域设置
  ctx.set('Access-Control-Allow-Origin',ctx.req.headers.origin)
  //允许携带cookie
  ctx.set('Access-Control-Allow-Credentials','true')
  if(ctx.req.method == 'OPTIONS') {
    ctx.status = 200,
    ctx.set('Access-Control-Allow-Origin',ctx.req.headers.origin)
    ctx.set('Access-Control-Allow-Credentials','true')
    ctx.set('Access-Control-Allow-Methods',"POST, GET, OPTIONS, DELETE, PUT")
    ctx.set('Access-Control-Allow-Headers','authorization')
  }
  await next()
})



app.use(KoaStatic(
  path.join(__dirname,'./public')
))

app.use(KoaBody())

app.use((ctx, next) => {
  return next().catch((err) => {
    if(err.status === 401){
      if( ctx.req.method == "OPTIONS") {
        ctx.status = 200
        return 
      }
      ctx.status = 401;
      ctx.body = {
        msg: 'token无效'
      };
    }else{
        ctx.status = 404
    }
  })
})




app.use(KoaJwt({
secret: 'secret_key',
Authorization:'Bearer'
}).unless({
path: [
  /\/api\/homepage/,
  /\/api\/common/,
  /\/api\/chapter/,
  /\/api\/comic/,
  /\/api\/user\/login/,
  /\/api\/user\/rigist/,
  /\/api\/comment\/all/,
  /\/public/,
]
}));


import common from './controller/common'
import homePage from './controller/homepage'
import comic from './controller/comic'
import user from './controller/user'
import comment from './controller/comment'
import chapter from './controller/chapter'

const router = new KoaRouter()
const allRouter = new KoaRouter()
router.use('/homepage', homePage.routes())
router.use('/common', common.routes())
router.use('/comic', comic.routes())
router.use('/user', user.routes())
router.use('/comment', comment.routes())
router.use('/chapter', chapter.routes())
allRouter.use('/api',router.routes())

app.use(allRouter.routes()).use(allRouter.allowedMethods());  
app.listen(2333)
