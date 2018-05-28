/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  trelloRequestURL        :    'https://trello.com/1/OAuthGetRequestToken',
  trelloAccessURL         :    'https://trello.com/1/OAuthGetAccessToken',
  trelloAuthorizeURL      :    'https://trello.com/1/OAuthAuthorizeToken',
  trelloAppName           :    'Task Man',
  trelloLoginCallback     :    'http://localhost:1337/callback',
  webhookCallback         :    'http://localhost:1337/webhooks'

};
