const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Realiza requisição de recursos',


  description: 'Faz requisições de recursos para os endpoints do trello via oauth',


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
      sails.config.custom.trelloRequestURL, 
      sails.config.custom.trelloAccessURL, 
      process.env.TRELLO_KEY, 
      process.env.TRELLO_OAUTH_SECRET, 
      "1.0A", 
      sails.config.custom.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    sails.log('Objeto Token: ', inputs.request.session.token);
    
    if(!inputs.request.session.token){
      throw 'noAuth';
    }

    ActionService.testService();

    oauth.getProtectedResource(inputs.url, "GET", inputs.request.session.token.oauth.accessToken, inputs.request.session.token.oauth.accessTokenSecret, function(error, data, response){
      const resource = {
        error    : error,
        data     : data,
        response : response
      }
      return exits.success(resource);
    });
  }

}