'use strict'

// const util = require('util')
// const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
require('dotenv').config()

const UserController = {
    register: (req, res) => {
        const {username, email, password, full_name} = req.body

        if (!username || !email || !password || !full_name){
            return res.status(400).json({message: 'Thiếu thông tin bắt buộc'})
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(400).json({message: 'Mã hóa mật khẩu bị lỗi'})
            }

            const newUser = {username, email, password_hash : hash, full_name};
            User.create(newUser, (err, result) => {
                if (err) {
                    return res.status(500).json({message: 'Đăng kí thất bại'})
                }
                res.status(200).json({message: 'Đăng kí thành công'})
            })
        })
    },

    login: (req, res) => {
        const {username, password} = req.body

        if (!username || !password){
            return res.status(400).json({message: 'Sai tài khoản hoặc mật khẩu'})
        }

        User.findByUsername(username, (err, results) => {
            if (err) return res.status(500).json({message: 'Sai tài khoản hoặc mật khẩu'})
            if (results.length === 0 ) return res.status(500).json({message: 'Sai tài khoản hoặc mật khẩu'})
            
            const user = results[0]

            bcrypt.compare(password, user.password_hash, (err, isMatch) => {
                if (err) return res.status(500).json({message: 'Sai tài khoản hoặc mật khẩu'})
                if (!isMatch) return res.status(401).json({message: 'Sai tài khoản hoặc mật khẩu'})

                const token = jwt.sign(
                    { user_id: user.user_id, username: user.username},
                    process.env.JWT_SECRET,
                    { expiresIn: '2h'}
                )

                res.json({
                    message: 'Đăng nhập thành công',
                    token
                });
            })
        })
    }
}

module.exports = UserController


