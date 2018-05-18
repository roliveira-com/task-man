const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Realiza POST de dados',


  description: 'Faz requisições POST de recursos para os endpoints do trello via oauth',


  inputs: {

    request:{
      type: 'ref',
      required: true
    },

    url:{
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
      sails.config.trelloRequestURL, 
      sails.config.trelloAccessURL, 
      sails.config.trelloKey, 
      sails.config.trelloOAuthSecret, 
      "1.0A", 
      sails.config.trelloLoginCallback, 
      "HMAC-SHA1"
    );
    
    if(!inputs.request.session.oauth){
      throw 'noAuth';
    }

    oauth.getProtectedResource(inputs.url, "POST", inputs.request.session.oauth.accessToken, inputs.request.session.oauth.accessTokenSecret, function(error, data, response){
      const resource = {
        error    : error,
        data     : data,
        response : response
      }
      return exits.success(resource);
    });
  }

}