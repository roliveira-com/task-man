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
      // ssl: true,
      adapter: 'sails-mongo',
      url: process.env.MONGODB_URI

    },

  },

  models: {

    migrate: 'drop',
    cascadeOnDestroy: false,

  },

  blueprints: {
    shortcuts: true,
  },

  security: {

    cors: {
      allRoutes: true,
      allowOrigins: '*',
      allowCredentials: false,
      allowRequestHeaders: 'content-type,x-xsrf-token',
      allowResponseHeaders: 'content-type,x-xsrf-token'
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

  // port: 80,

  custom: {

    trelloRequestURL        :    'https://trello.com/1/OAuthGetRequestToken',
    trelloAccessURL         :    'https://trello.com/1/OAuthGetAccessToken',
    trelloAuthorizeURL      :    'https://trello.com/1/OAuthAuthorizeToken',
    trelloAppName           :    'Task Man',
    trelloLoginCallback     :    'https://roliveira-taskman.herokuapp.com/callback',
    webhookCallback         :    'https://roliveira-taskman.herokuapp.com/webhooks'

  },
};
