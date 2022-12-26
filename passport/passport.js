import passport from 'passport'
import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import users from '../models/users.js'

// 引用 passport 的帳號密碼驗證策略
const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

// 使用驗證策略寫驗證方式
// passport.use(驗證方式, 策略)
passport.use('login', new LocalStrategy({
  // 預設帳號密碼使用的欄位是 username 和 password
  // 改為跟資料庫一樣
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  // done(錯誤, 傳到下一步的資料, 放進 info 的內容)
  try {
    const user = await users.findOne({ account })
    if (!user) {
      return done(null, false, { message: '帳號不存在' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

passport.use('jwt', new JWTStrategy({
  // 設定驗證 Header 的 Bearer Token
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // JWT 的 SECRET
  secretOrKey: process.env.JWT_SECRET,
  // 讓後面的 function 可以用 req
  passReqToCallback: true
}, async (req, payload, done) => {
  // payload 是 JWT 解譯後的資料
  // done 跟上面一樣
  const token = req.headers.authorization.split(' ')[1]

  try {
    // 找出解譯出來的使用者，且該使用者有目前傳入的 JWT
    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (user) {
      return done(null, { user, token })
    } else {
      return done(null, false, { message: '使用者不存在或 JWT 無效' })
    }
  } catch (error) {
    return done(error, false)
  }
}))
