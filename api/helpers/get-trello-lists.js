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

    if (!inputs.request.session.oauth) {
      throw 'noAuth';
    }

    oauth.getProtectedResource(inputs.url, "GET", inputs.request.session.oauth.accessToken, inputs.request.session.oauth.accessTokenSecret, function (error, data, response) {
      if (error) throw 'noAuth';
      // let resource = {
      //   error: error,
      //   data: data,
      //   response: response
      // }

      let resource = []

      let lists = JSON.parse(data);

      _.forEach(lists, function (list) {

        sails.log('ID DAS LISTAS DO TRELLO', list.id)
        Card.find({
          mode_id: list.id
        })
        .then(result => {
          sails.log('Array result: ', result)
          if(result.length !== 0){
            list.subscribed = true;
          }
        })
        resource.push(list);
      })

      return exits.success(resource);
    });
  }

}