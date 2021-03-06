
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , env = process.env.NODE_ENV || 'development'
    , config = require('../../config/config')[env]
    , Schema = mongoose.Schema

/**
 * Setters and Getters
 */

/**
 * Entity Schema
 */

var EntitySchema = new Schema({
    name: {type : String, default : '', trim : true},
    shortname: {type : String, default : '', trim : true, lowercase: true, unique:true},
    url: {type : String, default : '', trim : true, lowercase: true},
    code: {type : String, default : '<div id="talk2usclient">Talk to us now!</div>'},
    user: {type : Schema.ObjectId, ref : 'User'},
    createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

EntitySchema.path('url').validate(function (url) {
    return url.length > 0
}, 'Site URL cannot be blank')

EntitySchema.path('shortname').validate(function (shortname) {
    return shortname.length > 0
}, 'Site shortname cannot be blank')


/**
 * Pre & Post method hooks
 */


/**
 * Methods
 */

EntitySchema.methods = {

}

/**
 * Statics
 */

EntitySchema.statics = {

    /**
     * List entities for a user
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
            .populate('user', 'name')
            .sort({'shortname': 1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

mongoose.model('Entity', EntitySchema)
