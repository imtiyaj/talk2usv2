exports.index = function (req, res) {
    console.log('request received:'+req.url+', subdomain:'+req.subdomains[0]+
        ', subdomain:'+req.subdomains[1]+
        ', length='+req.subdomains.length);
  if (req.user) {
    res.render('home/index-foundation', { user: req.user })
  } else {
    res.render('home/index-foundation');
  }
}

exports.admin = function (req, res) {
   res.render('home/admin-foundation');
}
