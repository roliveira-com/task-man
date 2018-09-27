app.controller('manageController', ['$scope', '$http', function ($scope, $http) {

  $scope.fakeAction = {
    createdAt: 1537580351275,
    updatedAt: 1537580351275,
    id: "5ba59d3f8c33d1001449a2d7",
    modelId: "5ba4eba42093690014b20380",
    action: {
      action: {
        id: "5ba59d3fc5c2f51b0dcfa4bd",
        idMemberCreator: "5af6d594bab718857fb4945e",
        data: {
          board: {
            shortLink: "xpoHeCiH",
            name: "Things to Do",
            id: "5af6d595844047db7c2441da"
          },
          list: {
            name: "A fazer",
            id: "5af6d595844047db7c2441db"
          },
          card: {
            shortLink: "onN7RtUX",
            idShort: 7,
            name: "Cartãozinho novo",
            id: "5ba59d3fc5c2f51b0dcfa4bc"
          }
        },
        type: "createCard",
        date: "2018-09-22T01:39:11.180Z",
        limits: {},
        display: {
          translationKey: "action_create_card",
          entities: {
            card: {
              type: "card",
              id: "5ba59d3fc5c2f51b0dcfa4bc",
              shortLink: "onN7RtUX",
              text: "Cartãozinho novo"
            },
            list: {
              type: "list",
              id: "5af6d595844047db7c2441db",
              text: "A fazer"
            },
            memberCreator: {
              type: "member",
              id: "5af6d594bab718857fb4945e",
              username: "gennesimmons",
              text: "Genne Simmons"
            }
          }
        },
        memberCreator: {
          id: "5af6d594bab718857fb4945e",
          avatarHash: "9104391328e32c24b15bee8274511555",
          avatarUrl: "https://trello-avatars.s3.amazonaws.com/9104391328e32c24b15bee8274511555",
          fullName: "Genne Simmons",
          initials: "GS",
          username: "gennesimmons"
        }
      }
    }
  }

  io.socket.get('/api/v1/actions', function (data) {
    console.log('LISTA DE ACTIONS', data)
    $scope.actions = data;
    $scope.$apply();
  })

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
        $scope.actions.unshift(event.data);
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
  
  $scope.postWebhook = function () {
    // $http.post('/webhooks/5baca5ccb3573a1c57fe0ab5', $scope.fakeAction)
    $http.post('/webhooks/5ba36dd06e4c3814ec4ee0d3', $scope.fakeAction) //existe
      .then(function (resp) {
        console.log(resp)
      })
      .catch(function (error) {
        console.log(error)
      })
  }

}]);