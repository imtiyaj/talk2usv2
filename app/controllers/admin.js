var entity;

exports.index = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    else
        entity = null;
    if (req.user) {
        res.render('admin/index-admin', { user: req.user });
    } else {
        res.redirect('/');
    }
}




