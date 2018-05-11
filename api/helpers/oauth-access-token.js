const OAuth = require('oauth').OAuth;
const url   = require('url');

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

    const query       = url.parse(inputs.request.url, true).query;
    const token       = query.oauth_token;
    const tokenSecret = inputs.request.session.oauth[token];
    const verifier    = query.oauth_verifier;

    let session_created;

    const oauth = new OAuth(
      sails.config.trelloRequestURL, 
      sails.config.trelloAccessURL, 
      sails.config.trelloKey, 
      sails.config.trelloOAuthSecret, 
      "1.0A", 
      sails.config.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      Session.create(
        {
          oauth: {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
          },
        }
      )
      .fetch()
      .then(function(session) {
        sails.sockets.blast('session', {verb:"created", id: session.id, data: session});
        return exits.success(session);
      })
      .catch(function(error){
        throw 'noAuth';
      })
    })

  }

}