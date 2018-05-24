/**
 * ManageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  manageSessions: function(req, res){
    res.view('pages/tasks/management/sessions')
  },

  manageUsers: function(req, res){
    res.view('pages/tasks/management/users')
  },

  manageWebhooks: function(req, res){
    res.view('pages/tasks/management/webhooks')
  }

}