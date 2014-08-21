'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('AuthCtrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
    $scope.creds = {
       nsid: '',
       snum: '',
    };
    $scope.login = function(creds) {
      $http({url: 'http://localhost:8000/auth', method: 'POST', data: JSON.stringify({'nsid': creds.nsid, 'snum': creds.snum})})
     .success(function(data, status, headers, config) {
        console.log('data: ' + data);
        console.log('status: ' + status);
        console.log('headers: ' + headers('Pragma'));
        console.log('config: ' + config);
	creds.authkey = headers('Pragma');
	$http.defaults.headers.common['Authentication'] = 'Basic ' + creds.authkey;
	console.log(JSON.stringify($http.defaults.headers.common));
	$rootScope.credentials = creds;
     })
     .error(function(data, status, headers, config) {
	console.log('Error: ' + data + "Status: " + status );
     });
    }
  }])
  .controller('MainCtrl', ['$scope', function($scope) {

  }])
  .controller('SlidesCtrl', ['$scope', function($scope) {

  }])
  .controller('BookCtrl', ['$scope', function($scope) {

  }])
  .controller('HandoutsCtrl', ['$scope', function($scope) {

  }])
  .controller('QuizzesCtrl', ['$scope', function($scope) {

  }]);
