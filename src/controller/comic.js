import KoaRouter from 'koa-router'
import { comicModel,chapterModel } from '../schema'
const router = new KoaRouter()
router.get('/',async ctx => {
  const comic = await comicModel.findOne(ctx.query)
  const chapters = await chapterModel.find( { comic_id:ctx.query.id } )
  if( comic === null || chapters === null) {
    ctx.status = 404
    ctx.body = {
      msg: '没有该漫画!'
    }
  } else {
    ctx.body = { comic, chapters }
  }
})
router.get('/all',async ctx => {
  ctx.body = await comicModel.find({},{id:1,title:1,category:1,tag_id:1,vertical_image_url:1,update_status:1, latest_comic_title:1,description:1,likes_count:1, created_at:1,user:1})
})

router.get('/comments',async ctx => {
  const comic = await comicModel.findOne(ctx.query)
  const chapters = await chapterModel.find( { comic_id:ctx.query.id } )
  if( comic === null || chapters === null) {
    ctx.status = 404
    ctx.body = {
      msg: '没有该漫画!'
    }
  } else {
    ctx.body = { comic, chapters }
  }
})
export default router

