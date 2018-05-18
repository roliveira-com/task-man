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
      res.view('pages/tasks/lists',{
        lists : JSON.parse(response.data),
        subscribed : false
      });
    })
  },

  subscribe: function(req, res){
    sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.param('listid')}&description=Webhook-para-o-listId:${req.param('listid')}"&callbackURL=https://biz-analytics.herokuapp.com/api/trello/webhooks`).then(response => {
      if (response.error) {
        console.log('ERRO NO POST DO WEBHOOK', response.error)
        return res.status(500).send({ error: response.error })
      };
      console.log('RETORNO DO WEBHOOK POST', response.data)
      res.view('pages/tasks/lists',{
        lists : false,
        subscribed: JSON.parse(response.data) || 'subscribed'
      });
    })
  },

/**
 * O Callback de webhooks do Trello não funciona com localhost
 *
 * Objeto de retorno feito no primeiro webhook
 * {
 *    "id":"5aff2d0b711a9e959c2e3520",
 *    "description":"\"webhook_para_o_list_id:584168c54dc3d7060b1edda9\"",
 *    "idModel":"584168c54dc3d7060b1edda9",
 *    "callbackURL":"https://biz-analytics.herokuapp.com/api/trello/webhooks",
 *    "active":true
 * }
 */
  webhook: function(req, res){
    console.log('RETORNO DO CALLBACK DO WEBHOOK POST', req.body);
    res.status(200).send({status: req.body})
    // res.status(200).view('pages/tasks/lists',{
    //   lists : false,
    //   subscribed: req.body || 'subscribed'
    // });
  }

};

