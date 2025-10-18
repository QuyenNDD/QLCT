'use strict'
const Category = require('../models/CategoryModel')

const CategoryController = {
  //Lấy danh mục chi tiêu
  getExpenseCategory: (req, res) => {
    Category.getExpenseCategory(null, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Bị lỗi khi lấy danh mục' })
      }
      res.status(200).json(result)
    })
  },

  //Lấy danh mục thu nhập
  getIncomeCategory: (req, res) => {
    Category.getIncomeCategory(null, (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Bị lỗi khi lấy danh mục' })
      }
      res.status(200).json(result)
    })
  }
}

module.exports = CategoryController
