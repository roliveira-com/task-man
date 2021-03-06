/**
 * ListController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getLists: function (req, res){
    List.find({owner:req.session.user.id})
    .then(lists =>{
      res.status(200).send(lists);
    })
    .catch(error => {
      res.status(500).send({
        error: error,
        message: 'Não foi possível obter as listas agora'
      })
    })
  },
  
  addList: function (req, res) {
    List.create({
      name: req.body.title,
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
      id: req.body.id
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

