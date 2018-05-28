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

  getSessions: function (req, res) {
    Session.find()
      .then(lists => {
        res.status(200).send(lists);
      })
      .catch(error => {
        res.status(500).send({
          error: error,
          message: 'Não foi possível obter as listas agora'
        })
      })
  },

  deleteSession: function (req, res) {
    Session.destroy({ id: req.body.id })
      .fetch()
      .then(session => {
        sails.sockets.blast('session', { verb: "destroyed", id: session.id, previous: session });
        res.status(200).send({
          error: false,
          message: 'Sessão deletada com sucesso'
        });
      })
      .catch(error => {
        res.status(500).send({
          error: error,
          message: 'Não foi possível deletar esta sessão agora'
        })
      })
  },

  callback: function(req, res){
    sails.helpers.oauthAccessToken(req, res).then(token => {
      sails.helpers.oauthUserCreate(token).then(user => {
        req.session.user = user;
        res.redirect('/')
      })
    })
  },

  login: function (req, res) {
    if (!req.body) {
      req.session.error = 'Faça o login ou registre-se com o Trello logo abaixo'
      res.redirect('/');
      return;
    };
    if (req.body.email) {
      User.find({ email: req.body.email }).then(user => {
        if (user.length === 0) {
          req.session.error = 'Usuário não encontrado!'
          res.redirect('/');
          return;
        } else {
          Session.find({ owner: user.id }).then(session => {
            req.session.user = user[0]
            req.session.oauth = session[0].oauth
            res.redirect('/');
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
    res.redirect('/')
  }

};

