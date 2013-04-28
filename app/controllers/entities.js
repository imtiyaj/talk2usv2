/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

/**
 * New article
 */

exports.new = function(req, res){
    res.render('entities/new-foundation');
}

exports.create = function(req, res){
    res.redirect('/admin');
}