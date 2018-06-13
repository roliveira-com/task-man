const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Obtem as Listas do Trello',


  description: 'Configura um objeto de resposta com as listas do Trello verificando que já há um webhook cadastrados para ela',


  inputs: {

    request: {
      type: 'ref',
      required: true
    },

    url: {
      type: 'string',
      required: true,
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Objeto de resposta',
      outputDescription: 'Objeto de resposta do endpoint solicitado',
    },

    noAuth: {
      description: 'Não foi possível obter resposta'
    }

  },

  sync: false,


  fn: async function (inputs, exits) {

    const oauth = new OAuth(
      sails.config.custom.trelloRequestURL,
      sails.config.custom.trelloAccessURL,
      process.env.TRELLO_KEY,
      process.env.TRELLO_OAUTH_SECRET,
      "1.0A",
      sails.config.custom.trelloLoginCallback,
      "HMAC-SHA1"
    );

    if (!inputs.request.session.token) {
      throw 'noAuth';
    }

    oauth.getProtectedResource(inputs.url, "GET", inputs.request.session.token.oauth.accessToken, inputs.request.session.token.oauth.accessTokenSecret, function (error, data, response) {
      if (error) throw 'noAuth';
      // let resource = {
      //   error: error,
      //   data: data,
      //   response: response
      // }

 
      let lists = JSON.parse(data);

      var makeList = new Promise(function (resolve, reject) {
          let resource = [];
          if (lists) {
              for (i=0; i<lists.length; i++) {
                var compose = {
                  id        : lists[i].id,
                  name      : lists[i].name,
                  idBoard   : lists[i].idBoard
                };
                sails.log('ID DAS LISTAS DO TRELLO', lists[i].id);
                Card.find({ model_id: lists[i].id }).then(function(result) {
                    sails.log('RESULTADO DA QUERY NA TABLE CARD', result);
                    sails.log('LENGTH DO ARRAY result', result.length);
                    if (result == 0) {
                      compose.subscripton = false;
                    } else {
                      compose.subscripton = true;
                    }
                    sails.log('OBJETO COMPOSE', compose)
                    resource.push(compose);
                })
              }
              sails.log('OBJETO RESOURCE', resource)
              resolve(resource);
          } else {
              var reason = {erro: true, message: 'Não foi posível montar a lista do Trello'};
              reject(reason);
          }
      });

      makeList.then(function (lists){
        sails.log('RETORNO DA PROMISE makeList:', lists);
        return exits.success(lists);
      }).catch(error => {
        throw error;
      })

      // _.forEach(lists, function (list) {

      //   sails.log('ID DAS LISTAS DO TRELLO', list.id)
      //   Card.find({
      //     model_id: list.id
      //   })
      //   .then(result => {
      //     sails.log('Array result: ', result)
      //     if(result.length !== 0){
      //       list.subscribed = true;
      //     }
      //   })
      //   resource.push(list);
      // })

      
    });
  }

}