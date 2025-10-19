'use strict'
const Transaction = require('../models/TransactionModel')

const TransactionController = {
  //Thêm chi tiêu
  addExpense: (req, res) => {
    const {category_id, amount, description, transaction_date} = req.body
    const user_id = req.user.user_id

    if (!category_id || !amount || !transaction_date){
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    const newTransaction = { user_id, category_id, amount, description, transaction_date}

    Transaction.addExpense(newTransaction, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi thêm giao dịch' })
      res.status(200).json({message: 'Thêm chi tiêu thành công'})
    })
  },

  //Sửa giao dịch
  update: (req, res) => {
    const {category_id, amount, description, transaction_date, transaction_id} = req.body

    if (!category_id || !transaction_date || !transaction_id) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    const newTransaction = { category_id, amount, description, transaction_date, transaction_id}

    Transaction.update(newTransaction, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi sửa giao dịch' })
      res.status(200).json({message: 'Sửa chi tiêu thành công'})
    })
  },

  //Xóa giao dịch
  delete: (req, res) => {
    const transaction_id = req.params.id 
    Transaction.delete(transaction_id, (err, result) => {
      if (err || result.affectedRows === 0) {
        return res.status(500).json({ message: 'Lỗi khi xóa khoản chi tiêu'})
      }
      res.status(200).json({message: 'Xóa chi tiêu thành công'})
    })
  },
  //Thêm thu nhập
  addIncome: (req, res) => {
    const {category_id, amount, description, transaction_date} = req.body
    const user_id = req.user.user_id

    if (!category_id || !amount || !transaction_date){
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    const newTransaction = { user_id, category_id, amount, description, transaction_date}

    Transaction.addIncome(newTransaction, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi thêm giao dịch' })
      res.status(200).json({message: 'Thêm thu nhập thành công'})
    })
  },
  // Tổng thu/chi 1 ngày trong tháng (hiển thị lên lịch)
  getDailyMonthlySummary: (req, res) => {
    const user_id = req.user.user_id
    const {month, year} = req.query

    if (!month || !year){
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    Transaction.getDailyMonthlySummary(user_id, month, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  // Chi tiết thu/chi 1 ngày trong tháng
  getDailyMonthlyDetail: (req, res) => {
    const user_id = req.user.user_id
    const {month, year} = req.query

    if (!month || !year){
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    Transaction.getDailyMonthlyDetail(user_id, month, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  //Hiển thị tổng, thu nhập, chi tiêu của 1 tháng
  getMonthlySummary: (req, res) => {
    const user_id = req.user.user_id
    const {month, year} = req.query

    if (!month || !year) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    Transaction.getMonthlySummary(user_id, month, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  //Hiển thị tổng tiền đã thu/chi cho các danh mục trong 1 tháng
  getMonthlyDetail: (req, res) => {
    const user_id = req.user.user_id
    const {month, year} = req.query

    if (!month || !year) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    Transaction.getMonthlyDetail(user_id, month, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  //Hiển thị chi tiết khoản tiền dành cho danh mục trong tháng 
  getCategoryMonthlyDetail: (req, res) => {
    const user_id = req.user.user_id
    const {month, year, category_id} = req.query

    if (!month || !year || !category_id) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }
    Transaction.getCategoryMonthlyDetail(user_id, month, year, category_id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  //Hiển thị tổng thu/chi của 1 năm
  getYearSummary: (req, res) => {
    const user_id = req.user.user_id
    const year = req.params.year

    if (!year) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }

    Transaction.getYearSummary(user_id, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  },
  //Hiện thị tổng thu/chi của danh mục trong 1 năm
  getCategoryYear: (req, res) => {
    const user_id = req.user.user_id
    const year = req.params.year

    Transaction.getCategoryYear(user_id, year, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  }, 
  //Hiển thị tổng tiền đã chi cho 1 danh mục trong 1 tháng trong năm
  getCategoryMonthlySummary: (req, res) => {
    const user_id = req.user.user_id
    const {month, year, category_id} = req.query

    if (!month || !year || !category_id) {
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ'})
    }
    Transaction.getCategoryMonthlySummary(user_id, month, year, category_id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Lỗi khi lấy dữ liệu' })
      res.status(200).json(result)
    })
  }
}

module.exports = TransactionController
