exports.index = function (req, res) {
  if (req.user) {
    res.shared.userinfo = req.user;
    res.render('home/index-foundation', { user: req.user })
  } else {
    res.shared.userinfo = {role: 'client'};
    res.render('home/index-foundation');
  }
}

