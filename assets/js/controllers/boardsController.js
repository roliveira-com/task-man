app.controller('boardsController', ['$scope', '$http', function ($scope, $http) {

  $http.get('/api/v1/boards').then(function (response) {
    console.log(response.data);
    $scope.boards = response.data;
  })
  .catch(function (err) {
    console.log(err.data)
  })

}]);