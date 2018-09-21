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
      sails.config.custom.trelloRequestURL, 
      sails.config.custom.trelloAccessURL, 
      process.env.TRELLO_KEY, 
      process.env.TRELLO_OAUTH_SECRET,
      "1.0A", 
      sails.config.custom.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", inputs.token.oauth.accessToken, inputs.token.oauth.accessTokenSecret, function(error, data, response){
      const userData = JSON.parse(data);

      User.findOrCreate({ trello_id: userData.id }, 
      { 
        trello_id       : userData.id,  
        sessions        : inputs.token.id,
        role            : userData.email == 'rodrigo.oliveira@trigg.com.br' ? 'admin' : 'user',
        avatar_url      : userData.avatarUrl || 'not specified',
        full_name       : userData.fullName,
        initials        : userData.initials,
        user_url        : userData.url,
        username        : userData.username,
        email           : userData.email  || 'not specified',
        id_boards       : userData.idBoards,
        id_organizations: userData.idOrganizations
      })
      .exec(async(err, user, wasCreated) => {
        if (err) { 
          sails.log('ERRO NO CADASTRO DO NOVO USUARIO NA BASE', err)
          return exits.success({error: true, data: err, message: 'Erro no Registo do usuário na base'}) 
        }

        if(wasCreated) {
          sails.log('NOVO USUÁRIO CRIADO NA BASE: ' + user.id);  
          sails.sockets.blast('user', {verb:"created", id: user.id, data: user});
          Session.update({id:inputs.token.id}, {owner:user.id})
          .fetch()
          .then(session => {
            sails.sockets.blast('session', {verb:"updated", id: session.id, data: session});
          })
          return exits.success(user);
        }
        else {
          sails.log('USUARIO JÁ EXISTE NA BASE: ' + user.id);
          return exits.success({erro:true, data: null, message: 'Usuário já existe na base'});
        }
      });
    });
  }
};