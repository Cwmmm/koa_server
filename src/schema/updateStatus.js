import mongoose from 'mongoose'

const updateStatusSchema = mongoose.Schema({
  code: Number,
  description:String
})
const updateStatusModel = mongoose.model('updateStatus',updateStatusSchema)
export default updateStatusModel