import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號欄位'],
    unique: true,
    minlength: [4, '帳號必須大於4個字']
  },
  password: {
    type: String,
    required: [true, '缺少密碼欄位']
  },
  avatar: {
    type: String
  },
  tokens: {
    type: [String]
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼必須 4 個字以上' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼必須 4 個字以上' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
