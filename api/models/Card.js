/**
 * Card.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    title: {
      type: 'string'
    },

    listId: {
      model: 'List'
    },

    feeds: {
      collection: 'Webhook',
      via: 'targetCardModel'
    }

  },

};

