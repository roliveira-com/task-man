app.controller('cardOptionsController', ['$scope', '$http', function ($scope, $http) {

  $scope.notification = false;

  $scope.isLoading = false;

  $scope.toggleListOptions = function (event) {
    $scope.listOptions = !$scope.listOptions;
  }

  $http.get('/api/v1/boards').then(function (response) {
    $scope.boardsOptions = response.data;
  })
  .catch(function (err) {
    console.log(err);
    console.log(err.data.error)
    /**
     * @todo :: Criar serviço de error handler
     * $error.handle(err.data.error.data);
     */

    if(err.data.error.data === "expired token" || err.data.error.data === "invalid token"){
      document.querySelector('.auth-screen').classList.add('in');
    }
  })

  $scope.addWebhook = function (data) {
    $http.post('/api/v1/list/subscribe', data).then(function (result) {
      $scope.notification = result.data;
    }).catch(function (error) {
      console.error(error)
      $scope.notification = error.data;
    })
  }

  $scope.getListsfromBoard = function () {
    $scope.isLoading = true;
    $http.get('/api/v1/lists/' + $scope.webhook.boardId).then(function (result) {
      $scope.isLoading = false;
      $scope.selectOptions = result.data.data;
    })
  }
}])

app.directive('hasCardOptions', ['$http', function ($http) {
  return {
    restrict: 'C',
    controller: 'cardOptionsController',
    link: function ($scope, element, attrs) {

    }
  }
}])

app.directive('auth-screen', ['$http', function ($http) {
  return {
    restrict: 'C',
    controller: 'cardOptionsController',
    link: function ($scope, element, attrs) {
      console.log(element);
    }
  }
}])