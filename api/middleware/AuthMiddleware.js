const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
require('dotenv').config()

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(403).json({ message: 'Bạn cần đăng nhập trước khi thực hiện thao tác này' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
    }

    req.user = user
    next()
  })
}

module.exports = verifyToken