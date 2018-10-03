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
    let requis = inputs.request;

    let list = await List.findOne({ id: inputs.modelId }).catch(error => {
      sails.log('ERRO AO OBTER WEBHOOK RELACIONADO NA BASE')
      throw error;
    })

    if (!list || list.length == 0) {
      sails.log('A lista informada provavelmente não pertence a este usuário');
      return exits.success('OK');
    }

    sails.log('Objeto token na criação do cartão: ', inputs.request.session.token)
    sails.log('Objeto Customizado token na criação do cartão: ', requis.session.token)

    sails.helpers.oauthGetResource(requis, url)
      .then(resp => {
        if (resp.error) {
          sails.log('O Card informado provavelmente não pertence ao usuário');
          return exits.success('OK');
        }

        let card = JSON.parse(resp.data)

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
          return exits.success('OK');
        })
        .catch(error => {
          sails.log('NAO FOI POSSIVEL CRIAR ESTE CARD NA BASE', error);
          return exits.success('OK');
        })
      })
      .catch(error => {
        sails.log('Não foi possivel consultar o Trello para obter este card');
        throw error;
      })

  }

};