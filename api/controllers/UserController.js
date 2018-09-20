/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = { 

  getUsers: function (req, res) {
    User.find()
    .then(lists => {
      res.status(200).send(lists);
    })
    .catch(error => {
      res.status(500).send({
        error: error,
        message: 'Não foi possível obter os usuários agora'
      })
    })
  },

  deleteUser: function (req, res) {
    User.destroy({id:req.body.id})
    .fetch()
    .then(user => {
      sails.sockets.blast('user', { verb: "destroyed", id: user.id, previous: user });
      res.status(200).send({
        error: false,
        message: 'usuário deletado'
      });
    })
    .catch(error => {
      res.status(500).send({
        error: error,
        message: 'Não foi possível deletar usuário agora'
      })
    })
  },

  register: function(req, res){
    sails.helpers.oauthAuthorize(req, res).then(()=>{
      req.session.user = 'registering';
    })
  },

  updates: function(req, res){
    console.log(req.body);
  }

};

