module.exports = {
  development: {
    root: require('path').normalize(__dirname + '/..'),
    db: 'mongodb://localhost/talk2us',
    app: {
      name: 'Test'
    },
    facebook: {
      clientID: '558449554176735',
      clientSecret: 'a5fe9b923933d36278a827e854ad82a7',
      callbackURL: 'http://127.0.0.1:8080/auth/facebook/callback'
    },
    google: {
        clientID: '1234',
        clientSecret: '1234',
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }
  },
  test: {

  },
  production: {

  }
}