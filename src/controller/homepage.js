import KoaRouter from 'koa-router'
import { comicModel, tagModel } from '../schema'
const router = new KoaRouter()
//轮播图
router.get('/banner',async ctx => {
  ctx.body = await comicModel.find().limit(6)
})
//热搜
router.get('/hotSearch',async ctx => {
  try{ 
    const docs = await  comicModel.find({},{id: 1 ,title: 1}).limit(3)
    ctx.body = docs
  } catch(err) {
    ctx.body = err
  }
})
//推荐&&分类
router.get('/suggest',async ctx => {
  try {
    const tagIds = await tagModel.find({tag_id:{$ne:0}},{tag_id:1,title:1}).limit(3)
    const suggests = await  comicModel.find().limit(10)
    const rank = await  comicModel.find().limit(10)
    const promiseSome = tagIds.map(async (id) => {
      const docs = await comicModel.find({tag_id:id.tag_id},{id:1, title:1, description:1, cover_image_url:1}).limit(4)
      return {title:id.title, comics: docs }
    })
    const classify = await Promise.all(promiseSome)
    return ctx.body = {
      suggests,
      rank,
      classify
    }
  } catch(err) {
    ctx.body = err
  }
})
export default router

