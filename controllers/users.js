import users from '../models/users.js'
import jwt from 'jsonwebtoken'

// 註冊
export const createUser = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(400).json({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(409).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const loginUser = async (req, res) => {
  try {
    // jwt.sign(保存的資料, SECRET, 設定)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getCurrentUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: '',
    result: {
      account: req.user.account,
      avatar: req.user.avatar
    }
  })
}

export const editUserAvatar = async (req, res) => {
  try {
    console.log(req.file)
    req.user.avatar = req.file.path
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.file.path })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: false, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
