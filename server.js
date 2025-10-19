const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const port = process.env.PORT || 3001

app.use((req, res, next) => {
  if (req.method === 'GET') return next(); 
  bodyParser.json()(req, res, next);
});

app.use(bodyParser.urlencoded({ extended: true }))

let routes = require('./api/routes')
routes(app)

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
})

app.listen(port)
console.log('RESTful API server started on: ' + port)
