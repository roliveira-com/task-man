/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  home: function (req, res) {
    res.view('pages/tasks/home'); 
  },

  login: function(req, res){
    sails.helpers.oauthAuthorize(req, res).then(
      console.log('OK_DOC')
    )
  },

  callback: function(req, res){
    sails.helpers.oauthAccessToken(req, res).then(token => {
      sails.helpers.oauthUserCreate(token).then(user => {
        req.session.user = user;
        res.redirect('/tasks')
      })
    })
  }

};

