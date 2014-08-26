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
  .controller('HandoutsCtrl', ['$scope', function($scope) {

  }])
  .controller('QuizzesCtrl', ['$scope', function($scope) {

  }]);
