/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /**
   * Rotas de view
   */
  '/': {
    controller: 'AuthController',
    action: 'home'
  },

  '/login': {
    controller: 'AuthController',
    action: 'login'
  },

  '/register':{
    controller: 'UserController',
    action: 'register'
  },

  '/callback': {
    controller: 'AuthController',
    action: 'callback'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  'GET /boards': {
    controller: 'BoardsController',
    action: 'home'
  },

  'GET /lists/:boardid': {
    controller: 'BoardsController',
    action: 'getTrelloLists'
  },

  'GET /manage/users': {
    controller: 'ManageController',
    action: 'manageUsers'
  },

  'GET /manage/sessions': {
    controller: 'ManageController',
    action: 'manageSessions'
  },

  'GET /manage/webhooks': {
    controller: 'ManageController',
    action: 'manageWebhooks'
  },

  /**
   * Rotas da API
   */

  'GET /api/v1/lists' :{
    controller: 'ListController',
    action: 'getLists'
  },

  'GET /api/v1/users': {
    controller: 'UserController',
    action: 'getUsers'
  },

  'POST /api/v1/user/delete': {
    controller: 'UserController',
    action: 'deleteUser'
  },

  'GET /api/v1/sessions': {
    controller: 'AuthController',
    action: 'getSessions'
  },

  'POST /api/v1/session/delete': {
    controller: 'AuthController',
    action: 'deleteSession'
  },

  'GET /api/v1/webhooks': {
    controller: 'WebhookController',
    action: 'getWebhooks'
  },

  'POST /api/v1/webhook/delete': {
    controller: 'WebhookController',
    action: 'deleteWebhook'
  },

  'POST /api/v1/list/create': {
    controller: 'ListController',
    action: 'addList'
  },

  'POST /api/v1/list/remove': {
    controller: 'ListController',
    action: 'removeList'
  },

  'GET /api/v1/lists/:boardid' :{
    controller: 'BoardsController',
    action: 'getTrelloLists'
  },

  'POST /api/v1/list/subscribe' :{
    controller: 'WebhookController',
    action: 'subscribe'
  },

  'POST /webhooks/:id' : {
    controller: 'WebhookController',
    action: 'callback'
  },

  'GET /api/v1/boards': {
    controller: 'BoardsController',
    action: 'getTrelloBoards'
  },

};
