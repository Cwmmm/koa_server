import KoaRouter from 'koa-router'
import commentModel from '../schema/comment'
const router = new KoaRouter()
router.get('/all',async ctx => {
  try {
    const res = await commentModel.find().populate('user_id',{name:1, cover_img:1})
    ctx.body = {
      msg:'success',
      data:res
    }
  } catch {
    ctx.status = 500
    ctx.body = {
      msg: '服务器错误'
    }
  }
})
router.post('/',async ctx => {
  try {
    const doc = {
      user_id:ctx.state.user._id,
      create_time:new Date(),
      content: ctx.request.body.content,
    }
    await new commentModel(doc).save().catch(err => {ctx.status = 400; return ctx.body = { msg: '参数错误'}})
    const res = await commentModel.find()
    ctx.body = {
      msg:'success',
      data:res
    }
  } catch {
    ctx.status = 500
    ctx.body = {
      msg: '服务器错误'
    }
  }
})

router.delete('/',async ctx => {
  try {
    const res = await commentModel.find()
    ctx.body = {
      msg:'success',
      data:res
    }
  } catch {
    ctx.status = 500
    ctx.body = {
      msg: '服务器错误'
    }
  }
  
})
export default router

