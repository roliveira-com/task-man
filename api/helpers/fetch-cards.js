module.exports = {


  friendlyName: 'Cards no Trello',


  description: 'Busca os cards no trello relacionados a detrrminada lista e os salva na lista Task-Man',


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

    let card_list = await sails.helpers.oauthGetResource(inputs.request, `https://api.trello.com/1/lists/${inputs.modelId}/cards`)
    .catch(error => { throw error })

    let lifOfCards = JSON.parse(card_list.data);

    // sails.log('CARD LIST', lifOfCards.length);
    // sails.log('USER TRELLO ID', inputs.request.session.user);

    _.forEach(lifOfCards, function(card){
      _.forEach(card.idMembers, function (member) {
        if (member === inputs.request.session.user.trello_id){
          Card.create({

          })
        };
      });
    });

    // for (let i = 0; i < card_list.data.length; i++) {
    //   sails.log(card_list.data[i].name)
    //   // for (let index = 0; index < card_list.data[i].members.length; index++) {
    //   //   if (member === inputs.request.session.user.trelloId) {
    //   //     //Salva o card
    //   //     sails.log(card)
    //   //   } 
    //   // }
    // }

    // card_list.data.forEach(card => {
    //   card.idMembers.forEach(member => {
    //     if(member === inputs.request.session.user.trelloId){
    //       //Salva o card
    //       sails.log(card)
    //     }
    //   })
    // });

    return exits.success(card_list.data);

  }

};