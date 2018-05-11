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
    };
    if (req.body.email) {
      User.find({ email: req.body.email }).then(user => {
        if (user.length === 0) {
          req.session.error = 'Usuário não encontrado!'
          res.view('pages/tasks/home');
          return;
        } else {
          Session.find({owner: user.id}).then(session => {
            req.session.user = user[0]
            req.session.oauth = session[0].oauth
            res.redirect('/tasks');
            return
          })
        }
      })
    }else{
      req.session.error = 'Digite seus dados de usuário!'
      res.view('pages/tasks/home');
      return;
    };
  },

  register: function(req, res){
    sails.helpers.oauthAuthorize(req, res).then(
      console.log('OK_DOC')
    )
  },

  boards: function(req, res){
    sails.helpers.oauthGetResource(req, 'https://api.trello.com/1/members/me/boards').then(response => {
      if(response.error) return res.status(500).send({error : response.error});
      res.status(200).send(response.data);
    })
  }

};

