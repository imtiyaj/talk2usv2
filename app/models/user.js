
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var UserSchema = new Schema({
  name: 'string',
  email: 'string',
  username: 'string',
  provider: 'string',
  hashed_password: 'string',
  salt: 'string'
})

mongoose.model('User', UserSchema)
