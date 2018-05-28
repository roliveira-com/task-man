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
      console.log(err)
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
      $scope.selectOptions = result.data;
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