import mongoose from 'mongoose'

const comicSchema = mongoose.Schema({
  "id": Number,
  "title" : String,
  tag_id: Array,
  "vertical_image_url" : String,
  "cover_image_url" : String,
  "description" : String,
  "update_status" : Number,
  "is_free" : Boolean,
  "category" : Array,
  "view_count" : Number,
  "latest_comic_title" : String,
  "comic_count" : Number,
  "likes_count" : Number,
  "created_at" : Date,
  "user_id" : Number,
  "user" : {
    "id" : Number,
    "nickname" : String
  },
})
const comicModel = mongoose.model('comic',comicSchema)
export default comicModel