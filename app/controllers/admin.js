var entity;

exports.settings = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    if (req.user) {
        res.render('admin/index-admin', { user: req.user });
    } else {
        res.render('home/index-foundation');
    }
}

exports.users = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    if (req.user) {
        res.render('admin/index-admin', { user: req.user });
    } else {
        res.shared.userinfo = { role: 'client'};
        res.render('home/index-foundation');
    }
}

exports.stats = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    if (req.user) {
        res.render('admin/index-admin', { user: req.user });
    } else {
        res.render('home/index-foundation');
    }
}

