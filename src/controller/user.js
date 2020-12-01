import KoaRouter from 'koa-router'
import jwt from 'jsonwebtoken'
import { userModel, comicModel, messageModel } from '../schema'
const router = new KoaRouter()

//注册
router.post('/rigist',async ctx => {
  try {
    const info = ctx.request.body.data
    const mailExp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    const nameExp = /^[\w\u4e00-\u9fa5]{5,10}$/
    const passwordExp = /^\w{6,16}$/
    if( mailExp.test(info.mail) && nameExp.test(info.name) && passwordExp.test(info.password)) {
      //写入数据库
      const exitDoc = await userModel.findOne({mail: info.mail})
      info.cover_img = 'http://'+ctx.request.host + '/img/0.jpg'
      console.log(info)
      if( exitDoc === null) {
        await new userModel(info).save()
        return ctx.body = {
          msg: '注册成功!'
        }
      } else {
        ctx.status = 400
        return ctx.body = {
          msg: '该邮箱已注册'
        }
      }
  
    } else {
      ctx.status = 400
      return ctx.body = {
        msg: '参数格式错误'
      }
    }
  } catch {
    ctx.status = 500
    return ctx.body = {
      msg: '服务器错误'
    }
  }
})

//登录
router.post('/login',async ctx => {
  try {
    //前端测试加上.data(因为序列化)
    const info = ctx.request.body.data
    if(!info.mail || !info.password) {
      ctx.status = 400
      return ctx.body = {
        msg: '邮箱或密码不存在'
      }
    }
    const userDoc = await userModel.findOne({
      mail: info.mail,
      password: info.password
    })
    if( userDoc != null ) {
      const token = jwt.sign( {
        mail: userDoc.mail,
        _id: userDoc._id
      }, 'secret_key', {expiresIn: '2h'} )
      return ctx.body = {
        msg: '登录成功',
        data: token
      }
    } else {
      ctx.status = 404
      return ctx.body = {
        msg: '邮箱或者密码错误'
      }
    }
    
  } catch(err) {
    ctx.status = 404
    return ctx.body = {
      msg: '参数错误'
    }
  }
})

//获取用户信息
router.post('/info', async ctx => {
  try {
    const userDoc = await userModel.findOne({mail: ctx.state.user.mail})
    if( userDoc ) {
      return ctx.body = {
        msg: 'success!',
        data: userDoc
      }
    }else {
      ctx.status = 404;
      return ctx.body = {
        msg: "无该用户!"
      }
    }
    
  } catch {
    ctx.status = 500;
    return ctx.body = {
      msg: '服务器错误'
    }
  }
})
//修改头像
router.post('/changeheadimg',async ctx => {
  try {
    await userModel.updateOne({_id:ctx.state.user._id},{$set:{cover_img: ctx.request.body.data.id}})
    return ctx.body = {
      msg: 'success'
    }
  } catch {
    ctx.status = 400;
    return ctx.body = {
      msg:'参数错误'
    }
  }
})
//修改昵称
router.post('/changenickname',async ctx => {
  try {
    const nameExp = /^[\w\u4e00-\u9fa5]{5,10}$/
    if(nameExp.test(ctx.request.body.data.name)) {
      await userModel.updateOne({_id:ctx.state.user._id},{$set:{name: ctx.request.body.data.name}})
      return ctx.body = {
        msg: 'success'
      }
    }else {
      return ctx.body = {
        msg: '参数格式错误'
      }
    }
  } catch {
    ctx.status = 400;
    return ctx.body = {
      msg: '参数错误'
    }
  }
})
//修改密码
router.post('/changepsd',async ctx => {
  try {
    const passwordExp = /^\w{6,16}$/
    if( ctx.request.body.data.psd ) {
      if(passwordExp.test(ctx.request.body.data.psd)) {
        await userModel.updateOne({_id:ctx.state.user._id},{$set:{password: ctx.request.body.data.psd}})
        return ctx.body ={
          msg: 'success'
        }
      }else {
        ctx.body = {
          msg: '参数格式错误'
        }
      }
    }else {
      ctx.body = {
        msg: '参数为空'
      }
    }
  } catch {
    ctx.status = 400;
    return ctx.body = {
      msg: '参数错误'
    }
  }
})
//点赞
//如果该comic已被自己点赞则会被取消点赞
router.post('/like',async ctx => {
  try{
    const likeDoc = await userModel.findOne({_id: ctx.state.user._id},{like:1})
    let exist;
    if(likeDoc.like) {
      exist = likeDoc.like.some(e => e == ctx.request.body.data.comic_id)
    }else {
      exist = false;
    }
    if(exist) {
      likeDoc.like.splice(likeDoc.like.indexOf(ctx.request.body.data.comic_id), 1);
      await userModel.updateOne({_id: ctx.state.user._id},{$set:{like: likeDoc.like}})
      return ctx.body = {
        msg: '取消点赞成功'
      }
    } else {
      likeDoc.like.push(ctx.request.body.data.comic_id)
      await userModel.updateOne({_id: ctx.state.user._id},{$set:{like: likeDoc.like}})
      return ctx.body = {
        msg: '点赞成功'
      }
    }
    }catch {
        ctx.status = 400;
        return ctx.body = {
          msg: '参数错误'
        }
    }
})
//添加收藏
router.post('/collect',async ctx => {
  try {
    const collectDoc = await userModel.findOne({_id: ctx.state.user._id},{collect:1})
    let exist;
    if(collectDoc.collect) {
      exist = collectDoc.collect.some(e => e == ctx.request.body.data.comic_id)
    }else {
      exist = false;
    }
    if(exist) {
      collectDoc.collect.splice(collectDoc.collect.indexOf(ctx.request.body.data.comic_id), 1);
      await userModel.updateOne({_id: ctx.state.user._id},{$set:{collect: collectDoc.collect}})
      return ctx.body = {
        msg: '取消添加成功'
      }
    } else {
      collectDoc.collect.push(ctx.request.body.data.comic_id)
      await userModel.updateOne({_id: ctx.state.user._id},{$set:{collect: collectDoc.collect}})
      return ctx.body = {
        msg: '添加成功'
      }
    }
  } catch {
    ctx.status = 400;
    return ctx.body = {
      msg: '参数错误'
    }
  }
})

//添加历史记录
router.post('/addrecord',async ctx => {
  try {
    const {comic_id,chapter_id,title,chapter_title } = ctx.request.body.data
    if(comic_id && chapter_id) {
      const {reading_record} = await userModel.findOne({_id: ctx.state.user._id},{reading_record:1})
      let exist = true;
      reading_record.forEach(e => {
        if( e.comic_id == comic_id) {
          e.chapter_id = chapter_id;
          e.time = new Date()
          e.title =title
          e.chapter_title =chapter_title
          exist = false;
        } })

      if( exist ) {
        reading_record.push({
          comic_id,
          chapter_id,
          time: new Date(),
          title,
          chapter_title
        })
      }
      await userModel.updateOne({_id: ctx.state.user._id},{$set:{reading_record : reading_record}})
      ctx.body = {
        msg: '添加历史记录成功'
      }
    }else {
      ctx.body = {
        msg:'参数为空'
      }
    }
  } catch {
    ctx.state = 400;
    ctx.body = {
      msg: '参数错误'
    }
  }
})


//添加评论
router.post('/leavemessage',async ctx => {
  try {
    console.log( ctx.request.body.data.cover_img)
    console.log( ctx.request.body.data.name)

    if(ctx.request.body.data.message && ctx.request.body.data.cover_img && ctx.request.body.data.name) {
      console.log({user_id:ctx.state.user._id,content:ctx.request.body.data.message, create_time:new Date(), cover_img:ctx.request.body.data.cover_img, name:ctx.request.body.data.name})
      await new messageModel({user_id:ctx.state.user._id,content:ctx.request.body.data.message, create_time:new Date(), cover_img:ctx.request.body.data.cover_img, name:ctx.request.body.data.name}).save()
      const messageList = await messageModel.find()
      ctx.body = {
        msg:'success',
        messageList
      }
    }else {
      ctx.body = {
        msg:'内容为空！'
      }
    }
  } catch {
    ctx.status = 404;
    ctx.body = {
      msg:'参数错误！'
    }
  }
})

export default router
