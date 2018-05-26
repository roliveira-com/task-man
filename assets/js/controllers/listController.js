app.controller('listController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
  $rootScope.show_form = false;

  $rootScope.toggleNewListForm = function () {
    $rootScope.show_form = !$rootScope.show_form;
  }

  $http.get('/api/v1/lists').then(function (result) {
    $scope.lists = result.data
  })

  $scope.addList = function () {
    $http.post('/api/v1/list/create', $scope.newList).then(function (result) {
      $scope.lists.push(result.data);
      $rootScope.toggleNewListForm()
    })
      .catch(function (error) {
        $scope.listRegistered = error.data
      })
  }

  $scope.deleteList = function (list_id) {
    $http.post('/api/v1/list/remove', { id: list_id }).then(function (result) {
      var deleted = $scope.lists.findIndex(function (element, index, array) {
        if (element.id === list_id) return element;
      });
      $scope.lists.splice(deleted, 1);
    })
      .catch(function (error) {
        $scope.listRegistered = error.data;
      })
  }

}]);