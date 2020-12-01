import KoaRouter from 'koa-router'
import { getImgUrl } from '../service/captureimg'
import {comicModel, chapterModel} from '../schema'
const router = new KoaRouter()
//漫画信息和章节列表
router.get('/',async ctx=> {
  try {
    const comicInfo = await comicModel.findOne({ "id": ctx.query.comicId},{ id: 1, title: 1});
    const chapterList = await chapterModel.find( {comic_id: ctx.query.comicId},{chapter_id: 1, title: 1})
    return ctx.body = {
      msg:'success',
      comicInfo,
      chapterList,
    }
  } catch {
    ctx.status = 404
    ctx.body = {
      msg: '无该漫画'
    }
  }
})
//章节图片列表
router.get('/imgList',async ctx=> {
  try {
    const imgList = await getImgUrl(ctx.query.chapterId)
    return ctx.body = {
      msg:'success',
      imgList
    }
  } catch {
    ctx.status = 404
    ctx.body = {
      msg: '无该漫画'
    }
  }
})
router.put('/collect',async ctx=> {
  try {
    // const imgList = await getImgUrl(ctx.query.chapterId)
    // console.log(imgList.length)
    // return ctx.body = {
    //   msg:'success',
    //   imgList
    // }
  } catch {
    ctx.status = 404
    ctx.body = {
      msg: '无该漫画'
    }
  }
  
})

export default router

