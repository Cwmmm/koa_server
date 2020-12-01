import KoaRouter from 'koa-router'
import { tagModel,updateStatusModel,headImgModel,messageModel } from '../schema'
const router = new KoaRouter()

router.get('/tag',async ctx => {
  const tags = await tagModel.find({},{tag_id:1, title:1 });
  const updateStatus = await updateStatusModel.find()
  ctx.body = {
    tags,
    updateStatus
  }
})

router.get('/allhead',async ctx => {
  const imgs = await headImgModel.find();
  ctx.body = {
    imgs
  }
})

//搜索
router.get('/search',async ctx => {
  const imgs = await headImgModel.find();
  ctx.body = {
    imgs
  }
})

router.get('/messagelist', async ctx => {
  const messageList = await messageModel.find()
  ctx.body = {
    messageList,
    msg:'success!'
  }
})

export default router
