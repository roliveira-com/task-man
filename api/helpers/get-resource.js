const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Realiza requisição de recursos',


  description: 'Faz requisições de recursos para os endpoints do trello via oauth',


  inputs: {

    token:{
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
      sails.config.custom.trelloRequestURL, 
      sails.config.custom.trelloAccessURL, 
      process.env.TRELLO_KEY, 
      process.env.TRELLO_OAUTH_SECRET, 
      "1.0A", 
      sails.config.custom.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    sails.log('Objeto Token: ', inputs.token);
    
    if(!inputs.token){
      throw 'noAuth';
    }

    oauth.getProtectedResource(inputs.url, "GET", inputs.token.oauth.accessToken, inputs.token.oauth.accessTokenSecret, function(error, data, response){
      const resource = {
        error    : error,
        data     : data,
        response : response
      }
      return exits.success(resource);
    });
  }

}