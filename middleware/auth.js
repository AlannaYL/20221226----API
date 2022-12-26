import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用 login 的驗證方式
  // { session: false } 停用cookie
  //  (error, user, info) 對應到驗證方式 done 的三個參數值
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      // POST 進來的資料少了 usernameField 和 passwordField 定義的欄位
      if (info.message === 'Missing credentials') info.message = '缺少欄位錯誤'
      res.status(400).json({ success: false, message: info.message })
      return
    }
    // 把查詢到的 user 放進 req 裡面，給之後的使用
    req.user = user
    // 繼續下一個 middleware
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 如果是 JWT 解譯錯誤，可能是過期、格式不對
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        if (info.name === 'TokenExpiredError') {
          res.status(400).json({ success: false, message: 'JWT 過期' })
        } else {
          res.status(400).json({ success: false, message: 'JWT 錯誤' })
        }
      } else {
        res.status(400).json({ success: false, message: info.message })
      }
      return
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
