
/**
 * Module dependencies
 */

exports.index = function (req, res) {
  if (req.user) {
    res.render('home/index-foundation', { user: req.user })
  } else {
    res.render('home/index-foundation');
  }
}
