var entity;

exports.users = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    if (req.user) {
        res.render('admin/users-foundation', { user: req.user });
    } else {
        res.render('home/index-foundation');
    }
}

