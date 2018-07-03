/**
 * WebhookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getWebhooks: function (req, res) {
    Webhook.find()
      .then(lists => {
        res.status(200).send(lists);
      })
      .catch(error => {
        res.status(500).send({
          error: error,
          message: 'Não foi possível obter os webhooks agora'
        })
      })
  },

  deleteWebhook: function (req, res) {
    Webhook.destroy({ id: req.body.id })
      .fetch()
      .then(webhook => {
        sails.sockets.blast('webhook', { verb: "destroyed", id: webhook.id, previous: webhook });
        res.status(200).send({
          error: false,
          message: 'Webhook deletado com sucesso'
        });
      })
      .catch(error => {
        res.status(500).send({
          error: error,
          message: 'Não foi possível deletar o webhook agora'
        })
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

  subscribe: function (req, res) {

    if(req){

      sails.helpers.fetchCards(req, req.body.modelId, req.body.targetListModel)
      .then(() => {
        return res.status(200).send({error : false, message: 'Webhook cadastrado, mas os cartões obtidos com sucesso'});
      })
      .catch(error => {
        sails.log('ERRO EM OBTER/SALVAR CARDS DO TRELLO NA BASE TASK-MAN', error)
      })

      // fetchingCards(req, res);

      // async function fetchingCards(req, res) {

      //   try{
      //     await sails.helpers.fetchCards(req, req.body.modelId, req.body.targetListModel);
      //   }catch(error){
      //     sails.log('ERRO EM OBTER/SALVAR CARDS DO TRELLO NA BASE TASK-MAN', error)
      //   }
        
      // }
      // sails.helpers.oauthGetResource(req, `https://api.trello.com/1/lists/${req.body.modelId}/cards`)
      // .then(cards => {
      //   sails.log(`CARDS DA LISTA ${req.body.modelId}: `, cards);
      //   res.redirect('/');
      //   return;
      // })
      // .catch(error => {
      //   sails.log('ERRO EM OBTER/SALVAR CARDS DO TRELLO NA BASE TASK-MAN', error)
      //   return;
      // }) 

      // let cards = await sails.helpers.fetchCards(req, req.body.modelId, req.body.targetListModel)
      // .catch(error => sails.log('ERRO EM OBTER/SALVAR CARDS DO TRELLO NA BASE TASK-MAN', error))

      // console.log(`CARDS DA LISTA ${req.body.modelId}: `, cards);

      // res.status(200).send({error : true, message: 'Webhook não cadastrado, mas os cartões obtidos com sucesso'});
      // return;
    }

    // sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=${sails.config.custom.webhookCallback}/${req.body.targetListModel}`)
    sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://roliveira-taskman.herokuapp.com/webhooks/${req.body.targetListModel}`)
    .then(response => {
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

    res.status(200).send({error: false, data: 'ok'})

  }

};

