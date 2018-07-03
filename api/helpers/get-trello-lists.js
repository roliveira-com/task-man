const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Obtem as Listas do Trello',


  description: 'Configura um objeto de resposta com as listas do Trello verificando que já há um cards cadastrados relacionados a ela',


  inputs: {

    request: {
      type: 'ref',
      required: true
    },

    url: {
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

    if (!inputs.request.session.oauth) {
      throw 'noAuth';
    }

    oauth.getProtectedResource(inputs.url, "GET", inputs.request.session.oauth.accessToken, inputs.request.session.oauth.accessTokenSecret, function (error, data, response) {
      if (error) throw 'noAuth';
 
      let lists = JSON.parse(data);

      if (lists)  {
        let count = 0
        let resource = [];

        lists.forEach(list => {
          var compose = {
            id        : list.id,
            name      : list.name,
            idBoard   : list.idBoard
          };
          Card.find({ model_id: list.id }).then(result => {
              if(result.length === 0){
                compose.subscription = false;
              }else{
                compose.subscription = true;
              }
              resource.push(compose);
              count++;
              if(count == lists.length) exits.success(resource)
          })
        })
      } else {
        throw error;
      }
      
    });
  }

}