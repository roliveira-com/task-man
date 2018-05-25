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
    // sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://task-man.herokuapp.com/webhook/${req.body.targetListModel}`).then(response => {
    sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://localhost:1337/tasks/webhook/${req.body.targetListModel}`).then(response => {
      if (response.error) {
        sails.log('ERRO NO POST DO WEBHOOK NA API DO TRELLO', response.error)
        return res.status(500).send({ error: response.error, message: 'Não foi possível inscrever a lista agora, tente mais tarde' })
      };
      let webhookModel = JSON.parse(response.data);
      sails.log('WEBHOOK CRIADO COM SUCESSO NA API DO TRELLO', webhookModel)
      Webhook.create({
        targetListModel: req.body.targetListModel || null,
        targeCardModel: req.body.targeCardModel || null,
        idModel: req.body.modelId,
        description: `webhook para o model ${req.body.modelId}`,
        active: webhookModel.active,
        trelloId: webhookModel.id,
        callbackURL: webhookModel.callbackURL,
      })
      .fetch()
      .then(webhook => {
        sails.sockets.blast('webhook', { verb: "created", id: webhook.id, data: webhook });
        sails.log(`CADASTRO DO WEBHOOK ${webhook.id} FEITO COM SUCESSO`);
        res.status(200).send({
          error: false,
          message: 'Lista adicionada com sucesso'
        })
      })
      .catch(error => {
        sails.log('ERRO NO CADASTRO DO WEBHOOK NA BASE', error);
        res.status(500).send({
          error: error,
          message: 'O cadastro do webhook foi feito no Trello mas não em nossa base'
        })
      })
    })

  },

  callback: function (req, res) {
    /**
     * A URL a ser configurada no hosts deve ser: /tasks/webhook/:id
     */
    console.log('ID DO WEBHOOK NA BASE LOCAL', req.param('id'));
    console.log('OBJETO POST NO CALLBACK DO TRELLO', req.body);

  }

};

