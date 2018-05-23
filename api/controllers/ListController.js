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
      owner: req.session.user.id
    })
    .fetch()
    .then(list => {
      res.status(200).send({
        success:true,
        message:'Lista criada com sucesso'
      })
    })
    .catch(error => {
      res.status(500).send({
        error: true,
        message: 'Não foi possível criar a lista agora'
      })
    })
  }

};

