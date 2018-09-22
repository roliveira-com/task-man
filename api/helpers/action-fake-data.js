module.exports = {

  friendlyName: 'Cria um registro de action',

  description: 'Configura e grava um objeto action no banco para ser usado em ambiente de teste e dev',

  inputs: {
    action: {
      friendlyName: 'Action',
      description: 'Objeto action com as propriedades customizaveis',
      type: 'ref',
      required: true
    }
  },

  fn: async (inputs, exits) => {

    let new_action = {
      modelId: "th151s4f4k34ct10n",
      action:{
        id: "th151s4f4k34ct10n",
        idMemberCreator: "5af6d594bab718857fb4945e",
        type: inputs.action.type,
        date: new Date().toString(),
        display: {
          translationKey: inputs.action.translationKey,
          entities: {
            card: {
              type: "card",
              id: "5ba59d3fc5c2f51b0dcfa4bc",
              shortLink: "onN7RtUX",
              text: inputs.action.text
            },
            list: {
              type: "list",
              id: inputs.action.trelloListId,
              text: inputs.action.trelloListText
            }
          }
        },
        memberCreator: {
          "id": "5af6d594bab718857fb4945e",
          "avatarHash": "9104391328e32c24b15bee8274511555",
          "avatarUrl": `${inputs.action.avatarUrl}/170.png`,
          "fullName": inputs.action.fullName,
          "initials": inputs.action.initials,
          "username": inputs.action.username
        }
      }
    }

    Action.create(new_action)
      .fetch()
      .then(action => {
        sails.sockets.blast('action', { verb: "created", id: action.id, data: action });
        return exits.success({ error: false, data: webhook })
      })
      .catch(error => {
        sails.log('ERRO NO CADASTRO DO WEBHOOK NA BASE', error);
        throw { error: true, data: error }
      })
  }

}