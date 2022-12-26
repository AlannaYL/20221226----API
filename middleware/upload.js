import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  // 設定儲存位置
  storage: new CloudinaryStorage({ cloudinary }),
  // 過濾檔案
  fileFilter (req, file, callback) {
    // callback(錯誤, 是否允許上傳)
    // MulterError
    // https://github.com/expressjs/multer/blob/master/lib/multer-error.js
    // 自訂錯誤訊息取跟套件錯誤一樣的格式
    if (!file.mimetype.includes('image')) {
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    } else {
      callback(null, true)
    }
  },
  limits: {
    // 限制檔案大小 1MB
    fileSize: 1024 * 1024
  }
})

export default async (req, res, next) => {
  upload.single('image')(req, res, error => {
    // 判斷錯誤是不是上傳錯誤
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(400).json({ success: false, message })
    } else if (error) {
      res.status(500).json({ success: false, message: '未知錯誤' })
    } else {
      next()
    }
  })
}
