import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
  name: String,
  password: String,
  mail: String,
  cover_img: String,
  reading_record: Array,
  collect: Array,
  like:Array,
  my_comment: Array,
})

const userModel = mongoose.model('user',userSchema)
export default userModel