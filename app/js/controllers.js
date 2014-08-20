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
	console.log(JSON.stringify($http.defaults.headers.common));
	//$http.defaults.headers.common['Authentication'] = 'Basic ' + creds.authkey;
	$rootScope.credentials = creds;
     })
     .error(function(data, status, headers, config) {
	console.log('Error: ' + data + "Status: " + status );
     });
    }
  }])
  .controller('MyCtrl1', ['$scope', function($scope) {

  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
