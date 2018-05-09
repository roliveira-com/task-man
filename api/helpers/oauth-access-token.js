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

    const query       = url.parse(req.url, true).query;
    const token       = query.oauth_token;
    const tokenSecret = inputs.request.session.oauth_secrets[token];
    const verifier    = query.oauth_verifier;

    const session;
    const user;

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
      session = await Session.create(
        {
          oauth: {
            accessToken: accessToken,
            accessTokenSecret: accessTokenSecret
          },
        }
      )
    })

    session.then(
      oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function(error, data, response){
        const userData = JSON.parse(data);
        user = await User.create({
          trello_id: userData.id,
          avatar_url: userData.avatarUrl || 'not specified',
          full_name: userData.fullName,
          initials: userData.initials,
          user_url: userData.url,
          username: userData.username,
          email: userData.email  || 'not specified',
          id_boards: userData.idBoards,
          id_organizations: userData.idOrganizations
        })
      })
    )

    user.then(
      
    )

  }

}