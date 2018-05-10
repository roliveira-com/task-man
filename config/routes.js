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

  'GET /tasks': {
    view: 'pages/tasks/home'
  },

  '/tasks/login' : 'AuthController.login',

  '/tasks/callback': 'AuthController.callback',

};
