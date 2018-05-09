const OAuth = require('oauth').OAuth;

module.exports = {


  friendlyName: 'Solicita Requisição do OAuth Token',


  description: 'Configura e realiza a requisição do OAuth Request Token',


  inputs: {

    request: {
      friendlyName: 'Request',
      description: 'Objeto da requisição',
      type: 'ref',
      required: true
    },

    response: {
      friendlyName: 'Response',
      description: 'Objeto de resposta',
      type: 'ref',
      required: true      
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Página de Callback',
      outputDescription: 'Redireciona usuário para página de callback',
    },

    noAuth: {
      description: 'Não foi possível de obter o autorização do usuário no Trello'
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

    inputs.request.session.oauth_secrets = {};

    oauth.getOAuthRequestToken(function(error, token, tokenSecret, results){
      if (error) throw 'noAuth';

      inputs.request.session.oauth_secrets[token] = tokenSecret;

      inputs.response.redirect(`${sails.config.trelloAuthorizeURL}?scope=read,write,account&oauth_token=${token}&name=${sails.config.trelloAppName}`);

      return exits.success();
    });

  }

};