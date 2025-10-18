'use strict';

const verifyToken = require('./middleware/AuthMiddleware');

module.exports = function(app) {
  const auth = require('./controllers/UserController');
  const transaction = require('./controllers/TransactionController')
  const category = require('./controllers/CategoryController')
  app.route('/register')
    .post(auth.register);
  
  app.route('/login')
    .post(auth.login)

  app.route('/transaction/addExpense')
    .post(verifyToken, transaction.addExpense)
  
  app.route('/transaction/addIncome')
    .post(verifyToken, transaction.addIncome)

  app.route('/transaction/update')
    .put(verifyToken, transaction.update)

  app.route('/transaction/:id')
    .delete(verifyToken, transaction.delete)
  
  app.route('/transaction/getDailyMonthlySummary')
    .get(verifyToken, transaction.getDailyMonthlySummary)

  app.route('/transaction/getDailyMonthlyDetail')
    .get(verifyToken, transaction.getDailyMonthlyDetail)

  app.route('/transaction/getMonthlySummary')
    .get(verifyToken, transaction.getMonthlySummary)

  app.route('/getExpenseCategory')
    .get(category.getExpenseCategory)

  app.route('/getIncomeCategory')
    .get(category.getIncomeCategory)
  
  
};