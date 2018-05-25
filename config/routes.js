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

  '/': {
    view: 'pages/homepage'
  },

  'GET /tasks/boards': {
    view: 'pages/tasks/boards'
  },

  '/tasks/manage/users': {
    controller: 'ManageController',
    action: 'manageUsers'
  },

  '/tasks/manage/sessions': {
    controller: 'ManageController',
    action: 'manageSessions'
  },

  '/tasks/manage/webhooks': {
    controller: 'ManageController',
    action: 'manageWebhooks'
  },

  'GET /tasks/list' :{
    view: 'pages/tasks/addlist'
  },

  'POST /tasks/list': {
    controller: 'ListController',
    action: 'addList'
  },

  'POST /tasks/list/remove': {
    controller: 'ListController',
    action: 'removeList'
  },

  'GET /tasks/lists/:boardid' :{
    controller: 'BoardsController',
    action: 'getTrelloLists'
  },

  'POST /tasks/lists/subscribe' :{
    controller: 'WebhookController',
    action: 'subscribe'
  },

  'POST /tasks/webhooks/:id' : {
    controller: 'WebhookController',
    action: 'callback'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  'GET /api/tasks/boards': {
    controller: 'BoardsController',
    action: 'getTrelloBoards'
  },

  'GET /tasks': 'AuthController.home',

  '/tasks/login' : 'AuthController.login',

  '/tasks/register': 'UserController.register',

  '/tasks/callback': 'AuthController.callback',

};
