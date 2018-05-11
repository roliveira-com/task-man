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
    view: 'pages/tasks/users'
  },

  '/tasks/manage/sessions': {
    view: 'pages/tasks/sessions'
  },

  '/logout': {
    controller: 'AuthController',
    action: 'logout'
  },

  'GET /tasks/boards': {
    controller: 'UserController',
    action: 'boards'
  },

  'GET /tasks': 'AuthController.home',

  '/tasks/login' : 'UserController.login',

  '/tasks/register': 'UserController.register',

  '/tasks/callback': 'AuthController.callback',

};