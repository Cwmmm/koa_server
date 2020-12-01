import mongoose from 'mongoose'

const chapterListSchema = mongoose.Schema({
  comic_id: Number,
  chapter_id: { type: Number, default: 0},//自增
  cover_image_url: String,
  title: String,
  likes_count: Number,
  upload_time: Date,
  img_list:Array
})

const chapterModel = mongoose.model('chapter',chapterListSchema)
export default chapterModel