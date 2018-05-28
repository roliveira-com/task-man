var app = angular.module('taskman', []);

app.factory('csfrTokenInjector', [function() {  
  var injector = {
      request: function(config) {
          if(config.method === "POST" || config.method === "PUT"){
            config.data._csrf = window.SAILS_LOCALS._csrf; 
            console.log('OBJETO REQUEST ALTERADO', config);         
          }
          return config;
      }
  };
  return injector;
}]);

app.config(['$httpProvider', function($httpProvider) {  
  $httpProvider.interceptors.push('csfrTokenInjector');
}]);