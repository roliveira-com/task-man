/**
 * WebhookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

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

  subscribe: function (req, res) {
    /**
     * Objeto que deve ser postado para criar o webhook:
     * {
     *    targetListModel - ID da lista ou card a qual este webhook pertence dentro da aplicação
     *    targeCardModel
     *    modelId - ID do model no Trello para que o webhook sera criado
     *    description - descrição básica do webhook
     * }
     */
    Webhook.create({
      targetListModel : req.body.targetListModel  || null,
      targeCardModel  : req.body.targeCardModel   || null,
      idModel         : req.body.modelId,
      description     : req.body.description,
      active          : false
    })
    .fetch()
    .then(webhook => {
      console.log('PRE-CADASTRO DE WEBHOOK FEITO COM O ID: ', webhook.id)
      sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://localhost:1337/tasks/webhook/${webhook.id}`).then(response => {
      // sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://task-man.herokuapp.com/webhook/${webhook.id}`).then(response => {
        if (response.error) {
          console.log('ERRO NO POST DO WEBHOOK NA API DO TRELLO', response.error)
          return res.status(500).send({ error: response.error })
        };
        console.log('WEBHOOK CRIADO COM SUCESSO NA API DO TRELLO', JSON.parse(response.data))
        Webhook.update(
          {
            id: response.data.id
          }
        )
        .set(
          {
            trelloId: req.body.id,
            callbackURL: req.body.callbackURL,
            active: req.body.active
          }
        )
        .fetch()
        .then(webhook => {
          console.log('UPDATE DO WEBHOOK NA BASE', webhook);
          res.status(200).send(webhook)
        })
        .catch(error => {
          console.log('ERRO DO UPDATE DO WEBHOOK NA BASE', error);
          res.status(500).send({
            error: error,
            message: 'Não foi possível fazer a assinatura agora'
          })
        });
      })
    })
    .catch(error => {
      res.status(500).send({
        error: error,
        message: 'Não foi possível fazer a assinatura agora'
      })
    })
  },

  callback: function (req, res) {
    /**
     * A URL a ser configurada no hosts deve ser: /tasks/webhook/:id
     */
    console.log('OBJETO POST NO CALLBACK DO TRELLO', req.body);

  }

};

