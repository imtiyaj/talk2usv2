/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Entity = mongoose.model('Entity'),
    rest = require('../others/restware');

/**
 * New entity
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
    entity.user = req.user._id;
    entity.save(function (err) {
        if (err) {
            req.flash('error',err.message)
            return res.render('entities/new-foundation', { message: req.flash('error'), entity: entity })
        }
        return res.redirect('/admin')
    })
}

exports.destroy = function(req, res){
    Entity.findById(req.params.id, function (err, entity) {
        if (err) return rest.sendError(res,'Unable to find entity to be deleted',err);
        entity.remove(function(err){
            if (err) return rest.sendError(res,'Unable to delete entity',err);
            return rest.sendSuccess(res,'deleted successfully');
        })
    });
}

/**
 * List of Entities
 */

exports.index = function(req, res){
    var page = req.param('page') > 0 ? req.param('page') : 0
    var perPage = 15
    var options = {
        criteria: {$user: req.user.__id},
        perPage: perPage,
        page: page
    }

    Entity.list(options, function(err, entities) {
        if (err) return rest.sendError(res,'Unable to get entity list',err);
        Entity.count().exec(function (err, count) {
            var data= {
                entities: entities,
                page: page,
                pages: count / perPage
            };
            return rest.sendSuccess(res,'sending entity list',data);
        })
    })
}

