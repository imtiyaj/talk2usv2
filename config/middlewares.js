
/**
 * Module dependencies.
 */

exports.requiresLogin = function (req, res, next) {
  if (req.user)
    next()
  else {
    req.session.redirect_to = req.path;
    res.redirect('/login');
  }
}


///*
// *  User authorizations routing middleware
// */
//
//exports.user = {
//    hasAuthorization : function (req, res, next) {
//        if (req.profile.id != req.user.id) {
//            return res.redirect('/users/'+req.profile.id)
//        }
//        next()
//    }
//}
//
//
///*
// *  Article authorizations routing middleware
// */
//
//exports.article = {
//    hasAuthorization : function (req, res, next) {
//        if (req.article.user.id != req.user.id) {
//            return res.redirect('/articles/'+req.article.id)
//        }
//        next()
//    }
//}