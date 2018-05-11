/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  login: function (req, res) {
    if (!req.body) {
      req.session.error = 'Faça o login ou registre-se com o Trello logo abaixo'
      res.redirect('/tasks');
      return;
    }

    if (req.body.email) {
      User.find({ email: req.body.email }).then(user => {
        if (user.length === 0) {
          req.session.error = 'Usuário não encontrado!'
          res.view('pages/tasks/home');
          return;
        } else {
          req.session.user = user[0]
          res.view('pages/tasks/home');
          return
        }
      })
    }else{
      req.session.error = 'Digite seus dados de usuário!'
      res.view('pages/tasks/home');
      return;
    }
  },

  register: function(req, res){
    sails.helpers.oauthAuthorize(req, res).then(
      console.log('OK_DOC')
    )
  }

};

