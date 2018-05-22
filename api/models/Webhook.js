/**
 * Webhook.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    trelloId : {
      type: 'string'
    },

    description: {
      type: 'string'
    },
    /**
     * Informa para qual Lista ou Card da dentro aplicação este webhook irase relacionar 
     */
    targetListModel: {
      model: 'List'
    },

    targetCardModel: {
      model: 'Card'
    },
    /**
     * Dado vindo do Trello. diz o id da Lista, Card ou Board que o Trello
     * enviara POST para o callback URL sempre que houver alterações
     */
    idModel :{
      type: 'string'
    },
    /**
     * Sera criado no momento que o webhook for resgistrado na aplicação. 
     * Informa de forma mais clara de este webhook é de uma Lista ou Card
     */
    idModelType: {
      type: 'string'
    },

    callbackURL: {
      type: 'string'
    },

    active: {
      type: 'boolean'
    }

  },

};

