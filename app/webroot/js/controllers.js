'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngCookies'])
  .controller('AuthCtrl', ['$scope', '$http', '$rootScope', '$location', '$cookies', function($scope, $http, $rootScope, $location, $cookies) {
    $scope.creds = {
       nsid: '',
       snum: '',
       storedKey: ''
    };
    $scope.login = function(creds) {
      $http({url: 'http://localhost:8000/auth', method: 'POST', data: JSON.stringify({'nsid': creds.nsid, 'pass': SparkMD5.hash(creds.snum)})})
     .success(function(data, status, headers, config) {
       console.log(data);
       var key = data.replace(/.*key:/,'');
       key = key.replace(/<\/body.*/, '');
       console.log(key);
       $cookies.LingKey = key;
       creds.storedKey = key;
       $rootScope.credentials = creds;
       if (key != 'invalid') {
           $location.path('/loggedIn');
       } 
       else {
           $location.path('/sorry');
       }
     })
     .error(function(data, status, headers, config) {
	   console.log('Error: ' + data + "Status: " + status );
     });
    }
  }])
  .controller('NavCtrl', ['$scope', '$route', function($scope, $route) {
	  $scope.val = Date.parse(Date());
	  $scope.update = function(target) {
		  console.log('forcing update to ' + target);
		  $route.reload();
	  };
  }])
  .controller('MainCtrl', ['$scope', function($scope) { 
    $scope.hash_test = SparkMD5.hash('Peter');
    // $scope.hash_test = 'Peter';
  }])
  .controller('SlidesCtrl', ['$scope', function($scope) {

  }])
  .controller('BookCtrl', ['$scope', function($scope) {

  }])
  .controller('HandoutsCtrl', ['$scope', '$http',  function($scope, $http) {
      $scope.result=[];
      $scope.valid=false;

    $scope.callGet = function() {
          console.log('callGet called');
          $http({url: 'http://localhost:8000/resources', method: 'GET'})
              .error(function(data, status, headers, config) {
                   console.log('Error: ' + data + "Status: " + status );
                   $scope.valid=false;
              })
              .success(function(data, status, headers, config) {
                  if (data.result === -1) {
                      $scope.valid=false;
                      return;
                  } else {
                      $scope.valid=true;
                      $scope.result = data.result;
                  }
              })
      }

      $scope.download = function(fileName) {
          console.log('download called');
          console.log(fileName);
          $http({url: 'http://localhost:8000/download', method: 'POST', data: {'file': fileName}})
              .error(function(data, status, headers, config) {
                   console.log('Error: ' + data + "Status: " + status );
              })
              .success(function(data, status, headers, config) {
                  $scope.access='granted';
                  $scope.result = ['Done'];
                  console.log('download started...');
                  console.log(data, status, headers);
              })
}

  $scope.callGet();

  }])
  .controller('QuizzesCtrl', ['$scope', function($scope) {

  }]);
