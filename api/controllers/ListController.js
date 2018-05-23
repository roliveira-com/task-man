/**
 * ListController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  addList: function (req, res) {
    List.create({
      title: req.body.title,
      description: req.body.description,
      owner: req.session.user ? req.session.user.id : null
    })
    .fetch()
    .then(list => {
      res.status(200).send(list)
    })
    .catch(error => {
      res.status(500).send({
        error: error,
        message: 'Não foi possível criar a lista agora'
      })
    })
  },

  removeList: function(req, res){
    List.destroy({
      id: req.param('id')
    })
    .fetch()
    .then(list => {
      res.status(200).send(list)
    })
    .catch(error => {
      res.status(500).send({
        error: true,
        message: 'Não foi possível deletar a lista agora'
      })
    })
  }

};

