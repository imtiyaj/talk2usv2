//Module stores all the routes, add dependecies in the beginning
var mongoose = require('mongoose')
    , middlewares = require('./middlewares')

module.exports = function (app, passport) {

    var home = require('../app/controllers/home')
    app.get('/', home.index)

    // user routes
    var users = require('../app/controllers/users')
    app.get('/login', users.login)
    app.get('/signup', users.signup)
    app.get('/logout', users.logout)
    app.post('/users', users.create)
    app.post('/users/session',
        passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}),
        users.session)
    app.get('/users/:userId', users.show)

    app.get('/auth/facebook',
        passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }),
        users.signin)
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        users.authCallback)

    app.get('/auth/google',
        passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }),
        users.signin)
    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login', scope: 'https://www.google.com/m8/feeds' }),
        users.authCallback)

    app.param('userId', users.user)


    // entity routes
    var entities = require('../app/controllers/entities')

    app.get('/entities/new',middlewares.requiresLogin,  entities.new)

}








