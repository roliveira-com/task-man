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
      sails.config.trelloRequestURL, 
      sails.config.trelloAccessURL, 
      sails.config.trelloKey, 
      sails.config.trelloOAuthSecret, 
      "1.0A", 
      sails.config.trelloLoginCallback, 
      "HMAC-SHA1"
    );

    return exits.success(oauth);

  }

}