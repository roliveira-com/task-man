/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  // '*': true,

  ManageController :{

    manageSessions  : 'isLogged',
    manageUsers     : 'isLogged',
    manageWebhooks  : 'isLogged'

  },

  BoardsController : {

    home            : 'isLogged',
    getTrelloLists  : 'isLogged'

  }

};
