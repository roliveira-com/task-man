/**
 * BoardsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getLists: function (req, res) {
    sails.helpers.oauthGetResource(req, `https://api.trello.com/1/boards/${req.param('boardid')}/lists`).then(response => {
      if (response.error) return res.status(500).send({ error: response.error });
      console.log(response.data);
      res.view('pages/tasks/lists',{
        lists : response.data
      });
    })
  }

};

