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

  '/tasks/manage/users': {
    controller: 'ManageController',
    action: 'manageUsers'
  },

  '/tasks/manage/sessions': {
    controller: 'ManageController',
    action: 'manageSessions'
  },

  '/tasks/new/list' :{
    view: 'pages/tasks/addlist'
  },

  '/tasks/lists/:boardid' :{
    controller: 'BoardsController',
    action: 'getTrelloLists'
  },

  '/tasks/lists/subscribe/:listid' :{
    controller: 'WebhookController',
    action: 'subscribe'
  },

  'POST /tasks/webhooks/callback' : {
    controller: 'WebhookController',
    action: 'callback'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  'GET /tasks/boards': {
    controller: 'BoardsController',
    action: 'getTrelloBoards'
  },

  'GET /tasks': 'AuthController.home',

  '/tasks/login' : 'AuthController.login',

  '/tasks/register': 'UserController.register',

  '/tasks/callback': 'AuthController.callback',

};
