app.controller('manageController', ['$scope', '$http', function ($scope, $http) {

  io.socket.get('/api/v1/users', function (data) {
    $scope.users = data;
    $scope.$apply();
  })

  io.socket.get('/api/v1/sessions', function (data) {
    $scope.sessions = data;
    $scope.$apply();
  })

  io.socket.get('/api/v1/webhooks', function (data) {
    $scope.webhooks = data;
    $scope.$apply();
  })

  /**Socket para os Actions
   * 
   * @description :: Estabelecendo conexão socket para as ACTIONS
   * @returns :: Array
   */
  io.socket.get('/api/v1/actions', function (data) {
    console.log('LISTA DE ACTIONS', data)
    $scope.actions = data;
    $scope.$apply();
  })

  $scope.delete = function (model,itemId) {
    $http.post(`/api/v1/${model}/delete`, { id: itemId }).then(function (response) {
      $scope.notification = response.data;
    }).catch(function (error) {
      $scope.notification = error.data;
    })
  }

  io.socket.on('user', function (event) {
    console.log('Events User', event);
    switch (event.verb) {
      case 'created':
        $scope.users.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.users.findIndex(function (element, index, array) {
          if (element.id === event.previous.id) return element;
        });
        $scope.users.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.users.findIndex(function (element, index, array) {
          if (element.id === event.id) return element;
        });
        $scope.users.splice(deleted, 1);
        $scope.users.push(event.data);
        $scope.$apply()
        break;
    }
  })

  io.socket.on('session', function (event) {
    console.log('Events Session', event);
    switch (event.verb) {
      case 'created':
        $scope.sessions.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.sessions.findIndex(function (element, index, array) {
          if (element.id === event.previous.id) return element;
        });
        $scope.sessions.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.sessions.findIndex(function (element, index, array) {
          if (element.id === event.id) return element;
        });
        $scope.sessions.splice(deleted, 1);
        $scope.sessions.push(event.data);
        $scope.$apply()
        break;
    }
  })

  io.socket.on('webhook', function (event) {
    console.log('Events Webhook', event);
    switch (event.verb) {
      case 'created':
        $scope.webhooks.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.webhooks.findIndex(function (element, index, array) {
          if (element.id === event.previous.id) return element;
        });
        $scope.webhooks.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.webhooks.findIndex(function (element, index, array) {
          if (element.id === event.id) return element;
        });
        $scope.webhooks.splice(deleted, 1);
        $scope.webhooks.push(event.data);
        $scope.$apply()
        break;
    }
  })

  io.socket.on('action', function (event) {
    console.log('Events Action', event);
    switch (event.verb) {
      case 'created':
        $scope.actions.push(event.data);
        $scope.$apply();
        break;
      case 'destroyed':
        var deleted = $scope.actions.findIndex(function (element, index, array) {
          if (element.id === event.previous.id) return element;
        });
        $scope.actions.splice(deleted, 1);
        $scope.$apply()
        break;
      case 'updated':
        var deleted = $scope.actions.findIndex(function (element, index, array) {
          if (element.id === event.id) return element;
        });
        $scope.actions.splice(deleted, 1);
        $scope.actions.push(event.data);
        $scope.$apply()
        break;
    }
  })

}]);