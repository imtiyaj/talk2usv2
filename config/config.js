module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    db: 'mongodb://localhost/TestDev',
    app: {
      name: 'Test'
    },
    facebook: {
      clientID: '558449554176735',
      clientSecret: 'a5fe9b923933d36278a827e854ad82a7',
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }
  },
  test: {

  },
  production: {

  }
}