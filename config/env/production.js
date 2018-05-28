/**
 * Production environment settings
 * (sails.config.*)
 *
 * What you see below is a quick outline of the built-in settings you need
 * to configure your Sails app for production.  The configuration in this file
 * is only used in your production environment, i.e. when you lift your app using:
 *
 * ```
 * NODE_ENV=production node app
 * ```
 *
 * > If you're using git as a version control solution for your Sails app,
 * > this file WILL BE COMMITTED to your repository by default, unless you add
 * > it to your .gitignore file.  If your repository will be publicly viewable,
 * > don't add private/sensitive data (like API secrets / db passwords) to this file!
 *
 * For more best practices and tips, see:
 * https://sailsjs.com/docs/concepts/deployment
 */

module.exports = {

  datastores: {

    default: {
      /****************************************************************************
      *                                                                           *
      * More adapter-specific options                                             *
      *                                                                           *
      * > For example, for some hosted PostgreSQL providers (like Heroku), the    *
      * > extra `ssl: true` option is mandatory and must be provided.             *
      *                                                                           *
      * More info:                                                                *
      * https://sailsjs.com/config/datastores                                     *
      *                                                                           *
      ****************************************************************************/
      // ssl: true,

      adapter: 'sails-mongo',
      url: process.env.MONGODB_URI

    },

  },

  models: {

    migrate: 'safe',
    cascadeOnDestroy: false,

  },

  blueprints: {
    shortcuts: false,
  },

  security: {

    cors: {
      // allowOrigins: [
      //   'https://example.com',
      // ]
    },

  },

  session: {

    adapter: '@sailshq/connect-redis',
    url: process.env.REDIS_URL,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },

  },

  sockets: {

    adapter: '@sailshq/socket.io-redis',
    url: process.env.REDIS_URL,

  },


  log: {
    level: 'debug'
  },



  http: {

    cache: 5 * 24 * 60 * 60 * 1000, // Five Days
    trustProxy: true,

  },



  /**************************************************************************
  *                                                                         *
  * Lift the server on port 80.                                             *
  * (if deploying behind a proxy, or to a PaaS like Heroku or Deis, you     *
  * probably don't need to set a port here, because it is oftentimes        *
  * handled for you automatically.  If you are not sure if you need to set  *
  * this, just try deploying without setting it and see if it works.)       *
  *                                                                         *
  ***************************************************************************/
  // port: 80,

  custom: {

    trelloRequestURL        :    'https://trello.com/1/OAuthGetRequestToken',
    trelloAccessURL         :    'https://trello.com/1/OAuthGetAccessToken',
    trelloAuthorizeURL      :    'https://trello.com/1/OAuthAuthorizeToken',
    trelloAppName           :    'Task Man',
    trelloLoginCallback     :    'https://roliveira-taskman.herokuapp.com/callback',
    webhookCallback         :    'https://roliveira-taskman.herokuapp.com/webhook'

  },
};
