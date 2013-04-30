/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Entity = mongoose.model('Entity');

/**
 * New article
 */

exports.new = function(req, res){
    res.render('entities/new-foundation', {
        title: 'Create a new Entity',
        entity: new Entity(),
        message: req.flash('error')
    });
}

exports.create = function(req, res){
    var entity = new Entity(req.body)
    entity.provider = 'local'
    entity.save(function (err) {
        if (err) {
            req.flash('error',err.message)
            return res.render('entities/new-foundation', { message: req.flash('error'), entity: entity })
        }
        return res.redirect('/admin')
    })
}