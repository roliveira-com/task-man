const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Registra o usuário',


  description: 'Cria o usuário no banco de dados da aplicação com base nos dados obtidos na API do Trello',


  inputs: {

    token: {
      type: 'ref',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Objeto com o usuário criado',
      outputDescription: 'Objeto com o usuário criado após ser criado localmente no banco',
    },

    Error: {
      description: 'Não foi possível criar o usuário'
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

    oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", inputs.token.oauth.accessToken, inputs.token.oauth.accessTokenSecret, function(error, data, response){
      const userData = JSON.parse(data);
      User.create({
        trello_id       : userData.id,  
        sessions        : inputs.token.id,
        avatar_url      : userData.avatarUrl || 'not specified',
        full_name       : userData.fullName,
        initials        : userData.initials,
        user_url        : userData.url,
        username        : userData.username,
        email           : userData.email  || 'not specified',
        id_boards       : userData.idBoards,
        id_organizations: userData.idOrganizations
      })
      .fetch()
      .then(user => {
        sails.sockets.blast('user', {verb:"created", id: user.id, data: user});
        Session.update(
          {
            id:inputs.token.id
          },
          {
            oauth:inputs.token.oauth
          }
        )
        .fetch()
        .then(session => {
          sails.sockets.blast('session', {verb:"updated", id: session.id, data: session});
          User.find(
            {
              id: user.id
            }
          )
          .then(user => {
            return exits.success(user[0]);
          })
        })
      })
      .catch(error => {
        throw 'noAuth';
      });
    });
  }
};