const OAuth = require('oauth').OAuth;

module.exports = {

  friendlyName: 'Solicita Requisição do OAuth Token',


  description: 'Configura e realiza a requisição do OAuth Request Token',


  // inputs: {

  // },


  exits: {

    success: {
      outputFriendlyName: 'Objeto OAuth',
      outputDescription: 'Objeto OAuth a ser usado',
    },

    noAuth: {
      description: 'Não foi possível instanciar OAuth'
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

    return exits.success(oauth);

  }

}