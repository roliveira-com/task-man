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

    if(!inputs.request.session.user.id){
      return exits.success({error: true, data: null, message: 'O método para atualizar sessão requer uma sessão ativa'});
      throw 'noAuth';
    }

    oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      sails.log('UMA SESSÃO DE USUÁRIO FOI DETECTADA, INICIANDO ATUALIZACAO DE SESSÃO NA BASE...');
      sails.log('OBJETO TOKEN NA SESSAO DO USUARIO', inputs.request.session.token.id);
      Session.update({id:inputs.request.session.token.id},
        {
          oauth: {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
          },
        }
      )
      .fetch()
      .then(function(session) {
        sails.log('SESSÃO DE USUÁRIO ATUALIZADA COM SUCESSO', session)
        sails.sockets.blast('session', {verb:"updated", id: session.id, data: session});
        return exits.success(session);
      })
      .catch(function(error){
        throw 'noAuth';
      })
    })

  }

}