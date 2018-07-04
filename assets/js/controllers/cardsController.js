app.controller('cardsController', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
  
    $scope.getCards = function(listid){
      $http.get('/api/v1/'+listid+'/cards').then(function (result) {
        $scope.listCards = result.data.data;
        console.log(result);
      })
    }
  
  }]);