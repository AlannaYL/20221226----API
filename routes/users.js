import { Router } from 'express'
import { createUser, loginUser, getCurrentUser, editUserAvatar, logoutUser } from '../controllers/users.js'
import { login, jwt } from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = Router()

router.post('/', createUser)
router.post('/login', login, loginUser)
router.get('/me', jwt, getCurrentUser)
// 先驗證在上傳檔案
router.patch('/avatar', jwt, upload, editUserAvatar)
router.delete('/logout', jwt, logoutUser)

export default router
