/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  home: function (req, res) {
    res.view('pages/tasks/home'); 
  },

  callback: function(req, res){
    sails.helpers.oauthAccessToken(req, res).then(token => {
      sails.helpers.oauthUserCreate(token).then(user => {
        req.session.user = user;
        res.redirect('/tasks')
      })
    })
  },

  login: function (req, res) {
    if (!req.body) {
      req.session.error = 'Faça o login ou registre-se com o Trello logo abaixo'
      res.redirect('/tasks');
      return;
    };
    if (req.body.email) {
      User.find({ email: req.body.email }).then(user => {
        if (user.length === 0) {
          req.session.error = 'Usuário não encontrado!'
          res.redirect('/tasks');
          return;
        } else {
          Session.find({ owner: user.id }).then(session => {
            req.session.user = user[0]
            req.session.oauth = session[0].oauth
            res.redirect('/tasks');
            return
          })
        }
      })
    } else {
      req.session.error = 'Digite seus dados de usuário!'
      res.view('pages/tasks/home');
      return;
    };
  },

  logout: function (req, res) {
    req.session.destroy();
    res.redirect('/tasks')
  }

};

