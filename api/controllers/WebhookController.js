/**
 * WebhookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  getWebhooks: function (req, res) {
    Webhook.find({sort: 'createdAt DESC'})
      .populate('targetListModel')
      .populate('targetCardModel')
      .then(webhooks => {
        return res.status(200).json(webhooks);
      })
      .catch(error => {
        res.status(500).send({
          error: error,
          message: 'Não foi possível obter os webhooks agora'
        })
      })
  },

  deleteWebhook: function (req, res) {
    Webhook.destroy({
        id: req.body.id
      })
      .fetch()
      .then(webhook => {
        sails.sockets.blast('webhook', {
          verb: "destroyed",
          id: webhook.id,
          previous: webhook
        });
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

  subscribe: async function (req, res) {

      async function fetchingAndSavingCards(req) {

        try {
          await sails.helpers.fetchCards(req, req.body.modelId, req.body.targetListModel);
        } catch (error) {
          sails.log('ERRO EM OBTER/SALVAR CARDS DO TRELLO NA BASE TASK-MAN', error)
        }

      }

      // sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=${sails.config.custom.webhookCallback}/${req.body.targetListModel}`)
      sails.helpers.oauthPostData(req, `https://api.trello.com/1/webhooks/?idModel=${req.body.modelId}&description=${req.body.description}"&callbackURL=https://roliveira-taskman.herokuapp.com/webhooks/${req.body.targetListModel}`)
        .then(response => {
          if (response.error) {
            sails.log('ERRO NO POST DO WEBHOOK NA API DO TRELLO', response.error)
            res.status(500).send({
              error: response.error,
              message: 'Não foi possível inscrever a lista agora, tente mais tarde'
            });
            return;
          };

          fetchingAndSavingCards(req);

          let webhookModel = JSON.parse(response.data);

          sails.helpers.webhookCreate(req, webhookModel).then(webhook => {
              sails.log('WEBHOOK CRIADO COM SUCESSO NA API DO TRELLO', webhook.data)
              res.status(201).send({
                error: false,
                data: webhook.data
              })
            })
            .catch(error => {
              sails.log('ERRO NO CADASTRO DO WEBHOOK NA BASE', error);
              res.status(500).send({
                error: true,
                data: error.data,
                message: 'O cadastro do webhook foi feito no Trello mas não em nossa base'
              })
            })
        });

    },

    callback: async function (req, res) {

      let processo = null,
          action = null;

      if(req.body){
        console.log(req.body.action.action)
        action = req.body.action.action.type || 'none';
      }
      
      switch (action) {
        case 'createCard':
          processo = await sails.helpers.actionCreateCard(req, req.body.action, req.param('id'));
          break;
        case 'updateCard':
          processo = await sails.helpers.actionMoveCard(req, req.body.action);
          break;
      }

      Action.create({
          modelId: req.param('id'),
          action: req.body
        })
        .fetch()
        .then(action => {
          sails.sockets.blast('action', {verb:"created", id: action.id, data: action});
          sails.log('UMA ACTION FOI GRAVADA')
        })
        .catch(erro => {
          sails.log('ERRO AO GRAVAR A ACTION NO BANCO', erro);
        })

      res.status(200).send(processo)

    }

};
