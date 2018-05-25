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

app.controller('manageController', ['$scope','$http', function($scope, $http){

  io.socket.get('/user', function(data){
    $scope.users = data;
    $scope.$apply();
  })

  io.socket.get('/session', function(data){
    $scope.sessions = data;
    $scope.$apply();
  })

  io.socket.get('/webhook', function(data){
    $scope.webhooks = data;
    $scope.$apply();
  })

  $scope.getListTitle = function(listId){
    $http.get('/list/'+listId).then(function(response){ 
     return response.data.description
    })
  }

  $scope.deleteUser = function(itemId){
    $http.delete('/user/'+itemId).then(function(response){ 
      console.log(response.data);
    })
  }

  $scope.deleteSession = function(itemId){
    $http.delete('/session/'+itemId).then(function(response){ 
      console.log(response.data);
    })
  }

  $scope.deleteWebhook = function(itemId){
    $http.delete('/webhook/'+itemId).then(function(response){ 
      console.log(response.data);
    })
  }

  io.socket.on('user', function(event){
    console.log('Events User', event);
    switch (event.verb){
      case 'created':
        $scope.users.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.users.findIndex(function(element, index, array){
          if(element.id === event.previous.id) return element;
        });
        $scope.users.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.users.findIndex(function(element, index, array){
          if(element.id === event.id) return element;
        });
        $scope.users.splice(deleted, 1);
        $scope.users.push(event.data);
        $scope.$apply()
        break;
    }
  })

  io.socket.on('session', function(event){
    console.log('Events Session', event);
    switch (event.verb){
      case 'created':
        $scope.sessions.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.sessions.findIndex(function(element, index, array){
          if(element.id === event.previous.id) return element;
        });
        $scope.sessions.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.sessions.findIndex(function(element, index, array){
          if(element.id === event.id) return element;
        });
        $scope.sessions.splice(deleted, 1);
        $scope.sessions.push(event.data);
        $scope.$apply()
        break;
    }
  })

  io.socket.on('webhook', function(event){
    console.log('Events Webhook', event);
    switch (event.verb){
      case 'created':
        $scope.webhooks.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.webhooks.findIndex(function(element, index, array){
          if(element.id === event.previous.id) return element;
        });
        $scope.webhooks.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.webhooks.findIndex(function(element, index, array){
          if(element.id === event.id) return element;
        });
        $scope.webhooks.splice(deleted, 1);
        $scope.webhooks.push(event.data);
        $scope.$apply()
        break;
    }
  })

}]);

app.controller('boardsController', ['$scope','$http', function($scope, $http){

  $http.get('/api/tasks/boards').then(function(response){ 
    $scope.boards = response.data;
  })
  .catch(function(err){
    console.log(err)
  })

}]);

app.controller('cardOptionsController', ['$scope','$http','$rootScope',function($scope, $http, $rootScope){

  $scope.notification = false;

  $scope.isLoading = false;

  $scope.toggleListOptions = function (event) {
    $scope.listOptions = !$scope.listOptions;
  }

  $http.get('/api/tasks/boards').then(function (response) {
    $scope.boardsOptions = response.data;
  })
  .catch(function (err) {
    console.log(err)
  })

  $scope.addWebhook = function (data) {
    $http.post('/tasks/lists/subscribe', data).then(function(result){
      $scope.notification = result.data;
    }).catch(function(error){
      console.error(error)
      $scope.notification = error.data;
    })
  }

  $scope.getListsfromBoard = function () {
    $scope.isLoading = true;
    $http.get('/tasks/lists/' + $scope.webhook.boardId).then(function (result) {
      $scope.isLoading = false;
      $scope.selectOptions = result.data;
    })
  }
}])

app.directive('hasCardOptions', function ($http) {
  return {
    restrict: 'C',
    controller: 'cardOptionsController',
    link: function ($scope, element, attrs) {
      
    }
  }
})

app.controller('listController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
  $rootScope.show_form = false;

  $rootScope.toggleNewListForm = function () {
    $rootScope.show_form = !$rootScope.show_form;
  }

  $http.get('/list').then(function (result) {
    $scope.lists = result.data
  })

  $scope.addList = function () {
    $http.post('/tasks/list', $scope.newList).then(function (result) {
      console.log(result);
      $scope.lists.push(result.data);
      $rootScope.toggleNewListForm()
    })
    .catch(function (error) {
      $scope.listRegistered = error.data
    })
  }

  $scope.deleteList = function (list_id) {
    $http.post('/tasks/list/remove',{id:list_id}).then(function(result) {
      var deleted = $scope.lists.findIndex(function(element, index, array){
        if(element.id === list_id) return element;
      });
      $scope.lists.splice(deleted, 1);
    })
    .catch(function(error){
      $scope.listRegistered = error.data;
    })
  }

}]);