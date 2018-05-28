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


  fn: async (inputs, exits) => {

    const oauth = new OAuth(
      sails.config.custom.trelloRequestURL, 
      sails.config.custom.trelloAccessURL, 
      process.env.TRELLO_KEY, 
      process.env.TRELLO_OAUTH_SECRET, 
      "1.0A", 
      sails.config.custom.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    inputs.request.session.oauth = {};

    oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
      if (error) throw 'noAuth';

      inputs.request.session.oauth[token] = tokenSecret;

      inputs.response.redirect(`${sails.config.custom.trelloAuthorizeURL}?scope=read,write,account&oauth_token=${token}&name=${sails.config.trelloAppName}`);

      return exits.success();
    });

  }

};