angular.module('taskman', []);
angular.module('taskman').controller('manageController', ['$scope','$http', function($scope, $http){

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

angular.module('taskman').controller('boardsController', ['$scope','$http', function($scope, $http){

  $scope.boards = null;

  $http.get('/tasks/boards').then(function(response){ 
    $scope.boards = response.data;
  })
  .catch(function(err){
    console.log(err)
  })

}]);