import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import userRoute from './routes/users.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)

const app = express()

app.use(express.json())

app.use('/users', userRoute)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
