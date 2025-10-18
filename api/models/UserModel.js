const db = require('../db')

const User = {
  create: (data, callback) => {
    const query = 'insert into users (username, email, password_hash, full_name) value (?, ?, ?, ?)';
    db.query(query, [data.username, data.email, data.password_hash, data.full_name], callback);
  },

  findByUsername: (username, callback) => {
    const query = 'select * from users where username = ?'
    db.query(query, [username], callback)
  }
}


module.exports = User;