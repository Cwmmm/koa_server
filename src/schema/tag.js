import mongoose from 'mongoose'

const tagSchema = mongoose.Schema({
  tag_id:Number,
  title:String
})

const tagModel = mongoose.model('tag',tagSchema)
export default tagModel