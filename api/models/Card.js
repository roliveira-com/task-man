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

    list_id: {
      model: 'List'
    },
    // ID da Lista na base do Trello a qual este card pertence
    model_id:{
      type: 'string'
    },

    trello_id: {
      type: 'string'
    },

    short_url: {
      type: 'string'
    },

    id_checklist:{
      type: 'string'
    },

    due:{
      type: 'string'
    },

    due_complete: {
      type: 'string'
    },

    labels:{
      type: 'ref'
    },

    feeds: {
      collection: 'Webhook',
      via: 'targetCardModel'
    },

    owner: {
      model: 'User'
    }

  },

};

