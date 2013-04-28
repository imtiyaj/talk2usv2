var entity;

exports.index = function (req, res) {
  if (req.user) {
    res.render('home/index-foundation', { user: req.user })
  } else {
    res.render('home/index-foundation');
  }
}

exports.admin = function (req, res) {
    if ((req.subdomains.length > 0) && (req.subdomains[0] !== 'www'))
        entity = req.subdomains[0];
    if (req.user) {
        res.render('home/admin-foundation', { user: req.user });
    } else {
        res.render('home/admin-foundation');
    }
}
