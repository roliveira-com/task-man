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
     * Informa para qual Lista ou Card da dentro aplicação este webhook ira se relacionar 
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

    callbackURL: {
      type: 'string'
    },

    active: {
      type: 'boolean'
    }

  },

};

