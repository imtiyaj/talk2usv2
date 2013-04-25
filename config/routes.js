
/**
 * Module dependencies.
 */

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

}




//app.get('/login', function(req, res) {
//    var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
//    delete req.session.redirect_to;
//
//    if (req.query.redirect_to)
//        redirect_to = req.query.redirect_to;
//
//    if (req.user) {
//        res.redirect(redirect_to);
//    } else {
//        res.render('login-foundation');
//    }
//});
//app.get('/logout', function(req, res) {
//    req.logout();
//    res.redirect('/');
//});
//
//app.post('/login',
//    passport.authenticate('local', { failureRedirect: '/login' }),
//    function(req, res) {
//        res.redirect('/');
//    });
//





