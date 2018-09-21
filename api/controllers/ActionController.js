/**
 * ActionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
    getActions: function(req, res){
        Action.find({sort: 'createdAt DESC'})
            .then(actions => {
                res.status(200).send(actions);
                return
            })
            .catch(error => {
                res.status(500).send({error: true, message: 'Ocorreu um erro ao obter as actions'});
                return
            })
    }

};

