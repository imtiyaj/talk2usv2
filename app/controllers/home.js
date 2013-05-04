exports.index = function (req, res) {
  if (req.user) {
    res.shared.userinfo = req.user;
    res.render('home/index-foundation', { user: req.user })
  } else {
    res.shared.userinfo = {role: 'client'};
    res.render('home/index-foundation');
  }
}

exports.partials = function (req, res) {
    res.render(req.params.module+'/' + req.params.name);
};

