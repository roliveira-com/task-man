var app = angular.module('taskman', []);
app.controller('manageController', ['$scope','$http', function($scope, $http){

  io.socket.get('/user', function(data){
    $scope.users = data;
    $scope.$apply();
  })

  io.socket.get('/session', function(data){
    $scope.sessions = data;
    $scope.$apply();
  })

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

}]);

app.controller('boardsController', ['$scope','$http', function($scope, $http){

  $scope.boards = null;

  $http.get('/tasks/boards').then(function(response){ 
    $scope.boards = response.data;
  })
  .catch(function(err){
    console.log(err)
  })

}]);

app.controller('listController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
  $rootScope.show_form = false;

  $rootScope.toggleNewListForm = function () {
    $rootScope.show_form = !$rootScope.show_form;
  },

  $http.get('/list').then(function (result) {
    $scope.lists = result.data
  })

  $scope.newListRegister = function () {
    $http.post('/tasks/list', $scope.newList).then(function (result) {
      $scope.lists.push(result.data);
      $scope.$apply()
      $rootScope.show_form = !$rootScope.show_form;
      console.log(result.data)
    })
    .catch(function (error) {
      $scope.listRegistered = error.data
    })
  }

  $scope.deleteList = function (list_id) {
    console.log(list_id);
    // http.delete('/tasks/list/', list_id).then(function(result) {
      
    // })
  }

}]);