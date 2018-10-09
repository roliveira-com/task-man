module.exports = {


  friendlyName: 'Cards no Trello',


  description: 'Busca os cards no trello relacionados a determinada lista e os salva na base Task-Man',


  inputs: {

    request: {
      type: 'ref',
      required: true
    },

    modelId: {
      friendlyName: 'Model ID',
      description: 'ID da lista na base do Trello',
      type: 'string',
      required: true
    },

    listId: {
      friendlyName: 'List ID',
      description: 'ID da lista na base do Task-man',
      type: 'string',
      required: true
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Cards adicionados com sucesso',
      outputDescription: 'Todos os cards foram obtidos do Trello e salvos nestas lista localmente',
    },

    noAuth: {
      description: 'Não foi possível de obter os Cards desta lista no Trello'
    }

  },

  sync: false,


  fn: async (inputs, exits) => {

    let card_list = await sails.helpers.oauthGetResource(inputs.request, `https://api.trello.com/1/lists/${inputs.modelId}/cards`).catch(error => {
      throw error;
    })

    let listOfCards = JSON.parse(card_list.data);

    _.forEach(listOfCards, function(card){
      _.forEach(card.idMembers, function (member) {
        if (member === inputs.request.session.user.trello_id){
          Card.create({
            title        : card.name,
            list_id      : inputs.listId,
            trello_id    : card.id,
            model_id     : inputs.modelId,
            short_url    : card.shortUrl,
            id_checklist : card.idChecklist,
            due          : card.due || '',
            due_complete : card.dueComplete || '',
            labels       : card.labels,
            owner        : inputs.request.session.user.id
          })
          .fetch()
          .then(card => {
            sails.log(`CARD ${card.id} CRIADO COM SUCESSO`)
          })
          .catch(error => {
            sails.log('NAO FOI POSSIVEL CRIAR ESTE CARD NA BASE', error);
          })
        };
      });
    });

    return exits.success(card_list.data);

  }

};