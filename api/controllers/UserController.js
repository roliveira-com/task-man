/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = { 

  register: function(req, res){
    sails.helpers.oauthAuthorize(req, res).then(
      console.log('OK_DOC')
    )
  },

  updates: function(req, res){
    console.log(req.body);
  }

};

