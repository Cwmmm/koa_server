import mongoose from 'mongoose'

const commentSchema = mongoose.Schema({
  user_id: { type: mongoose.SchemaTypes.ObjectId, ref: 'user' },
  comic_id:Number,
  create_time: Date,
  content: String
})

const commentModel = mongoose.model('comment',commentSchema)
export default commentModel