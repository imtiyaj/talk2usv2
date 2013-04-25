
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , middlewares = require('./middlewares')

module.exports = function (app, passport) {

  var home = require('../app/controllers/home')
  app.get('/', home.index)

}