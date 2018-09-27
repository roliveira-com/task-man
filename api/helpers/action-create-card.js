module.exports = {


  friendlyName: 'Cards no Trello',


  description: 'Busca os cards no trello relacionados a detrrminada lista e os salva na base Task-Man',


  inputs: {

    request: {
      type: 'ref',
      required: true
    },

    action: {
      type: 'ref',
      required: true
    },

    modelId:{
      type: 'string',
      required: true,
    }

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
    let url = `https://api.trello.com/1/cards/${inputs.action.data.card.id}`;

    let list = await List.findOne({ id: inputs.modelId }).catch(error => {
      sails.log('ERRO AO OBTER WEBHOOK RELACIONADO NA BASE')
      throw error;
    })

    let reponsecard = await sails.helpers.oauthGetResource(inputs.request, url).catch(error => {
      sails.log('ERRO AO OBTER CARDS NO TRELLO', error)
      throw error;
    })

    let card = JSON.parse(reponsecard.data);

    if (!list || list.length == 0) return exits.success({error: true, message: 'modelId não encontrado na base'});

    Card.create({
      title: card.name,
      list_id: list.id,
      model_id: inputs.modelId,
      short_url: card.shortUrl,
      id_checklist: card.idChecklist,
      due: card.due || '',
      due_complete: card.dueComplete || '',
      labels: card.labels,
      owner: inputs.request.session.user.id
    })
    .fetch()
    .then(card => {
      sails.log(`CARD ${card.id} CRIADO COM SUCESSO`)
      return exits.success({
        error: false,
        card: card.id,
        list: list.id
      });
    })
    .catch(error => {
      sails.log('NAO FOI POSSIVEL CRIAR ESTE CARD NA BASE', error);
      return exits.success({
        error: false,
        card: card.id,
        list: list.id
      });
    })

  }

};