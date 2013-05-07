/**
 * Module dependencies.
 */


/**
 * Show Support Widget
 */

exports.talk2us = function (req, res) {
    res.render('support/talk2us-foundation', {
        title: 'Talk2Us',
        message: req.flash('error')
    })
}

