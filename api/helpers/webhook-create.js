module.exports = {

  friendlyName: 'Create Webhook',

  description: 'Configura o objeto e registra webhooks na base',

  inputs: {
    request: {
      friendlyName: 'Req',
      description: 'Objeto de request',
      type: 'ref',
      required: true
    },
    webhook: {
      friendlyName: 'Webhook',
      description: 'Objeto do webhook',
      type: 'ref',
      required: true
    }
  },

  fn: async (inputs, exits) => {

    let new_webhook = {
      targetListModel : inputs.request.body.targetListModel || null,
      targeCardModel  : inputs.request.body.targeCardModel || null,
      idModel         : inputs.request.body.modelId,
      description     : `webhook para o model ${inputs.request.body.modelId}`,
      active          : inputs.webhook.active,
      trelloId        : inputs.webhook.id,
      callbackURL     : inputs.webhook.callbackURL,
    }

    Webhook.create(new_webhook)
      .fetch()
      .then(webhook => {
        sails.sockets.blast('webhook', { verb: "created", id: webhook.id, data: webhook });
        sails.log(`CADASTRO DO WEBHOOK ${webhook.id} FEITO COM SUCESSO`);
        return exits.success({error:false, data:webhook})
      })
      .catch(error => {
        sails.log('ERRO NO CADASTRO DO WEBHOOK NA BASE', error);
        throw {error:true, data:error}
      })
  }

}