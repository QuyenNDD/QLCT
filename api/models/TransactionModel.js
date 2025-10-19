const db = require('../db')

const Transaction = {
  addExpense: (data, callback) => {
    const query = 'insert into transactions ( user_id, category_id, amount, type, description, transaction_date) values (?, ?, ?, ?, ?, ?)';
    db.query(query, [data.user_id, data.category_id, data.amount, 'expense', data.description, data.transaction_date], callback);
  },
  update: (data, callback) => {
    const query = 'update transactions set category_id = ?, amount = ?, description = ?, transaction_date = ? where transaction_id = ?';
    db.query(query, [data.category_id, data.amount, data.description, data.transaction_date, data.transaction_id], callback)
  },
  delete: (transaction_id, callback) => {
    const query = 'delete from transactions where transaction_id = ?';
    db.query(query, [transaction_id], callback)
  },
  addIncome: (data, callback) => {
    const query = 'insert into transactions ( user_id, category_id, amount, type, description, transaction_date) values (?, ?, ?, ?, ?, ?)';
    db.query(query, [data.user_id, data.category_id, data.amount, 'income', data.description, data.transaction_date], callback);
  },
  getDailyMonthlySummary: (user_id, month, year, callback) => {
    const query = `
      SELECT transaction_date, type, SUM(amount) AS total
      FROM transactions
      WHERE user_id = ? 
        AND MONTH(transaction_date) = ? 
        AND YEAR(transaction_date) = ?
      GROUP BY transaction_date, type
      ORDER BY transaction_date;
    `;
    db.query(query, [user_id, month, year], (err, results) => {
      if (err) callback(err);

      const summary = {}
      results.forEach(row => {
        const date = row.transaction_date.toLocaleDateString('en-CA');
        if (!summary[date]){
          summary[date] = {date, income: 0, expense: 0}
        }
        if (row.type === 'income') summary[date].income = parseFloat(row.total)
        else summary[date].expense = parseFloat(row.total)
      });
      callback(null, Object.values(summary))
    })
  },
  getDailyMonthlyDetail: (user_id, month, year, callback) => {
    const query = `
      SELECT 
      t.transaction_id,
      t.transaction_date,
      t.type,
      t.category_id,
      c.name AS category_name,
      t.amount,
      t.description
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    WHERE t.user_id = ?
      AND MONTH(t.transaction_date) = ?
      AND YEAR(t.transaction_date) = ?
    ORDER BY t.transaction_date, t.transaction_id;
    `
    db.query(query, [user_id, month, year], (err, results) => {
      if (err) return callback(err)
      
      const detail = {}
      results.forEach(row => {
        const date = row.transaction_date.toLocaleDateString('en-CA');
        if (!detail[date]) detail[date] = {date, transaction: []};
        detail[date].transaction.push({
          transaction_id: row.transaction_id,
          type: row.type,
          category_id: row.category_id,
          category_name: row.category_name,
          amount: parseFloat(row.amount),
          description: row.description
        })
      })
      callback(null, Object.values(detail))
    })
  },
  getMonthlySummary: (user_id, month, year, callback) => {
    const query = `
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
      FROM transactions
      WHERE user_id = ?
        AND MONTH(transaction_date) = ?
        AND YEAR(transaction_date) = ?
    `
    db.query(query, [user_id, month, year], (err, result) => {
      if (err) return callback(err);
      const income = result[0].income || 0
      const expense = result[0].expense || 0
      const total = income - expense
      callback (null, {month, year, income, expense, total});
    });
  },
  getMonthlyDetail: (user_id, month, year, callback) => {
    const query = `
      SELECT 
        t.category_id,
        c.name AS category_name,
        t.type,
        SUM(t.amount) AS total_amount
      FROM transactions t
      JOIN categories c ON t.category_id = c.category_id
      WHERE t.user_id = ?
        AND MONTH(t.transaction_date) = ?
        AND YEAR(t.transaction_date) = ?
      GROUP BY c.name, t.type, t.category_id
      ORDER BY t.type, total_amount DESC;
    `;
    db.query(query, [user_id, month, year], (err, result) => {
      if (err) return callback(err)
      callback(null, result)
    })
  },
  getCategoryMonthlyDetail: (user_id, month, year, category_id, callback) => {
    const query = `
      SELECT 
      t.transaction_id,
      t.transaction_date,
      t.type,
      c.name AS category_name,
      t.amount,
      t.description
    FROM transactions t
    JOIN categories c ON t.category_id = c.category_id
    WHERE t.user_id = ?
      AND MONTH(t.transaction_date) = ?
      AND YEAR(t.transaction_date) = ?
      AND t.category_id = ?
    ORDER BY t.transaction_date, t.transaction_id;
    `
    db.query(query, [user_id, month, year, category_id], (err, results) => {
      if (err) return callback(err)
      
      const detail = {}
      results.forEach(row => {
        const date = row.transaction_date.toLocaleDateString('en-CA');
        if (!detail[date]) detail[date] = {date, transaction: []};
        detail[date].transaction.push({
          transaction_id: row.transaction_id,
          type: row.type,
          category_name: row.category_name,
          amount: parseFloat(row.amount),
          description: row.description
        })
      })
      callback(null, Object.values(detail))
    })
  }
}

module.exports = Transaction;