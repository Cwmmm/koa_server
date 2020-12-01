import mongoose from 'mongoose'

const headImgSchema = mongoose.Schema({
  id:Number,
  url:String,
})

const headImgModel = mongoose.model('headImg',headImgSchema)
export default headImgModel