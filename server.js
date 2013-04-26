
/**
 * Module dependencies
 */

var express = require('express')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')
  , modelsPath = __dirname + '/app/models'
  , http = require('http')
  , socketio = require('socket.io');

mongoose.connect(config.db)

// Bootstrap models
require('fs').readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath+'/'+file)
})

// Bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
  , server = http.createServer(app)
  , io = socketio.listen(server);

// Bootstrap application settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport)

//Bootstrap socket.io
var socket = require('./app/controllers/socket')
io.sockets.on('connection', socket);
//Add authorise and Loglevel for socketio TBD

// Start the app by listening on <port>
var port = process.env.PORT || 8080
server.listen(port, function() {
    console.log("Express server listening on port " + port);
});

