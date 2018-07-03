module.exports = {

  friendlyName: 'Create Webhook',

  description: 'Configura o objeto e registra webhooks na base',

  inputs: {
    webhook: {
      friendlyName: 'Webhook',
      description: 'Objeto do webhook',
      type: 'ref',
      required: true
    }
  },

  fn: async (inputs, exits) => {

    let new_webhook = {
      targetListModel : inputs.webhook.targetListModel || null,
      targeCardModel  : inputs.webhook.targeCardModel || null,
      idModel         : inputs.webhook.modelId,
      description     : `webhook para o model ${inputs.webhook.modelId}`,
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