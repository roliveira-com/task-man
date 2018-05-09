/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const OAuth = require('oauth').OAuth;
const url   = require('url');

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
    const query = url.parse(req.url, true).query;
    const token = query.oauth_token;
    const tokenSecret = req.session.oauth_secrets[token];
    const verifier = query.oauth_verifier;
    oauth.getOAuthAccessToken(token, tokenSecret, verifier, function(error, accessToken, accessTokenSecret, results){
      if (error) sails.log('ERRO no getOAuthToken', error);
      oauth.getProtectedResource("https://api.trello.com/1/members/me", "GET", accessToken, accessTokenSecret, function(error, data, response){
        if(error) sails.log('ERRO no getProtectedResource', error);
        const userData = JSON.parse(data);
        User.create({
          trello_id: userData.id,
          avatar_url: userData.avatarUrl || 'not specified',
          full_name: userData.fullName,
          initials: userData.initials,
          user_url: userData.url,
          username: userData.username,
          email: userData.email  || 'not specified',
          id_boards: userData.idBoards,
          id_organizations: userData.idOrganizations
        })
        .fetch()
        .exec(function(err, user){
          if(err) sails.log('ERRO ao gravar usuário', err);
          req.session.user = user
          Session.create({
            oauth: {
              accessToken: accessToken,
              accessTokenSecret: accessTokenSecret
            },
            owner: user.id
          })
          .fetch()
          .exec(function(err, session){
            User.update(
              {
                id: req.session.user.id,
              },
              {
                sessions : session.id
              }
            )
            .fetch()
            .exec(function(err, updatedUser){
              if(err) sails.log('ERRO ao gravar sessão no usuário', err);
              req.session.user = updatedUser[0]
              res.redirect('/tasks');
            })
          })
        })
      });
    });
  }

};

