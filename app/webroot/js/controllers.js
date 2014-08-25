'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AuthCtrl', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
    $scope.creds = {
       nsid: '',
       snum: '',
    };
    $scope.login = function(creds) {
      $http({url: 'http://localhost:8000/auth', method: 'POST', data: JSON.stringify({'nsid': creds.nsid, 'pass': SparkMD5.hash(creds.snum)})})
     .success(function(data, status, headers, config) {
	   creds.authkey = headers('Pragma');
	   creds.storedKey = creds.authkey;
	   sessionStorage.setItem("authkey", creds.authkey);
	   $http.defaults.headers.common['Authorization'] = 'Basic ' + creds.authkey;
	   $rootScope.credentials = creds;
	   console.log('location: ' + $location.url('loggedIn'));
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
  .controller('HandoutsCtrl', ['$scope', function($scope) {

  }])
  .controller('QuizzesCtrl', ['$scope', function($scope) {

  }]);
