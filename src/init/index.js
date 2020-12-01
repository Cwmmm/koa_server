import mongoose from 'mongoose'
//连接
mongoose.connect('mongodb://localhost/acgbook',{
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const db = mongoose.connection
db.on("open",() => {
  console.log('mongoDB connect success!!')
})

// import('./add')