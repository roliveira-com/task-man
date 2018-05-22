/**
 * List.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name :{
      type: 'string'
    },

    description: {
      type: 'string'
    },

    listAvatar: {
      type: 'string'
    },

    owner :{
      model: 'User'
    },

    feeds : {
      collection: 'Webhook',
      via: 'targetModel'
    },

    cards :{
      collection : 'Card',
      via : 'listId'
    }

  },

};

