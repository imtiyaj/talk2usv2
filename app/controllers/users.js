/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , User = mongoose.model('User')

exports.signin = function (req, res) {}     //used

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
    var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
    delete req.session.redirect_to;

    if (req.query.redirect_to)
        redirect_to = req.query.redirect_to;

    res.redirect(redirect_to);
}

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('users/login-foundation', {
        title: 'Login',
        message: req.flash('error')
    })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup-foundation', {
        title: 'Sign up',
        user: new User()
    })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout()
    res.redirect('/')
}

/**
 * Session
 */

exports.session = function (req, res) {
    var redirect_to = req.session.redirect_to ? req.session.redirect_to : '/';
    delete req.session.redirect_to;

    if (req.query.redirect_to)
        redirect_to = req.query.redirect_to;

    res.redirect(redirect_to);
}

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body)
    user.provider = 'local'
    user.save(function (err) {
        if (err) {
            return res.render('users/signup', { errors: err.errors, user: user })
        }
        req.logIn(user, function(err) {
            if (err) return next(err)
            return res.redirect('/')
        })
    })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
    var user = req.profile
    res.render('users/show', {
        title: user.name,
        user: user
    })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id : id })
        .exec(function (err, user) {
            if (err) return next(err)
            if (!user) return next(new Error('Failed to load User ' + id))
            req.profile = user
            next()
        })
}
