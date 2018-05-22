/**
 * BoardsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  getTrelloLists: function (req, res) {
    sails.helpers.oauthGetResource(req, `https://api.trello.com/1/boards/${req.param('boardid')}/lists`).then(response => {
      if (response.error) return res.status(500).send({ error: response.error });
      res.view('pages/tasks/lists',{
        lists : JSON.parse(response.data),
        subscribed : false
      });
    })
  },

  getTrelloBoards: function (req, res) {
    sails.helpers.oauthGetResource(req, 'https://api.trello.com/1/members/me/boards').then(response => {
      if (response.error) return res.status(500).send({ error: response.error });
      res.status(200).send(response.data);
    }).catch(error => {
      res.status(401).send(error);
    })
  },

};

