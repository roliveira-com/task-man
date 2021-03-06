const OAuth = require('oauth').OAuth;
const url   = require('url');

module.exports = {

  friendlyName: 'Gera um OAuth Token',


  description: 'Gera um OAuth Request Token e o grava na base',


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
      sails.config.custom.trelloRequestURL, 
      sails.config.custom.trelloAccessURL, 
      process.env.TRELLO_KEY, 
      process.env.TRELLO_OAUTH_SECRET, 
      "1.0A", 
      sails.config.custom.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      sails.log('SESSÃO DE USUÁRIO NÃO DETECTADA, INICIANDO CRIAÇÃO DE SESSÃO NA BASE...');
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
        sails.log('SESSÃO DE USUÁRIO CRIADA NA BASE COM SUCESSO', session)
        sails.sockets.blast('session', {verb:"created", id: session.id, data: session});
        return exits.success(session);
      })
      .catch(function(error){
        sails.log('ERRO NA CRIAÇÃO DA SESSÃO DE USUÁRIO')
        throw 'noAuth';
      })
    })

  }

}