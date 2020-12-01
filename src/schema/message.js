import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
  user_id: String,
  cover_img:String,
  name:String,
  create_time: Date,
  content: String,
})

const messageModel = mongoose.model('message',messageSchema)
export default messageModel