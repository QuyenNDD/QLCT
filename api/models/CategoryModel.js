const db = require('../db')

const Category = {
  getExpenseCategory: (data, callback) => {
    const query = 'select category_id, name from categories where type = ?';
    db.query(query, ['expense'], callback)
  },

  getIncomeCategory: (data, callback) => {
    const query = 'select category_id, name from categories where type = ?';
    db.query(query, ['income'], callback)
  }
}

module.exports = Category