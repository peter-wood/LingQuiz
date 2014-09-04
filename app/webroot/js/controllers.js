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
      $http({url: 'auth', method: 'POST', data: JSON.stringify({'nsid': creds.nsid, 'pass': SparkMD5.hash(creds.snum)})})
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
  .controller('MainCtrl', ['$scope', function($scope) { 
    $scope.hash_test = SparkMD5.hash('Peter');
    // $scope.hash_test = 'Peter';
  }])
  .controller('SlidesCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.result=[];
      $scope.content = null;
      $scope.valid=false;
      console.log('SlidesCtrl called');
      $http({url: 'slides', method: 'GET'})
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
      $scope.download = function(fileName) {
          console.log('download called');
          console.log(fileName);
          $http({url: 'download', method: 'POST', data: {'file': fileName, 'resource': 'slides'}})
              .error(function(data, status, headers, config) {
                   console.log('Error: ' + data + "Status: " + status );
              })
              .success(function(data, status, headers, config) {
                  $scope.result = null;
                  $scope.valid = true;
		  console.log(data);
		  // $scope.content = data;
                  $scope.content = $sce.trustAsHtml(data);
                  //console.log($scope.content);
              })
      }

  }])
  .controller('BookCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
      $scope.result=null;
      $scope.content = null;
      $scope.valid=false;
      console.log('BookCtrl called');
      $http({url: 'book', method: 'GET'})
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
      $scope.download = function(fileName) {
          console.log('download called');
          console.log(fileName);
          $http({url: 'download', method: 'POST', data: {'file': fileName, 'resource': 'book'}, responseType: 'arraybuffer'})
              .error(function(data, status, headers, config) {
                   console.log('Error: ' + data + "Status: " + status );
              })
              .success(function(data, status, headers, config) {
                  $scope.result = null;
                  $scope.valid = true;
                  console.log('download started...');
                  var blob = new Blob([data], {type: "application/pdf"});
                  var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                  navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob; // only works for IE
                  if (navigator.saveBlob) {
                      navigator.saveBlob(blob, 'download.pdf');
                  } else {
                      var url = urlCreator.createObjectURL(blob);
                      $scope.content = $sce.trustAsResourceUrl(url);
                  }
              })
      }

  }])
  .controller('HandoutsCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
      $scope.result=null;
      $scope.content = null;
      $scope.valid=false;
      console.log('HandoutCtrl called');
      $http({url: 'handouts', method: 'GET'})
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
      $scope.download = function(fileName) {
          console.log('download called');
          console.log(fileName);
          $http({url: 'download', method: 'POST', data: {'file': fileName, 'resource': 'handouts'}, responseType: 'arraybuffer'})
              .error(function(data, status, headers, config) {
                   console.log('Error: ' + data + "Status: " + status );
              })
              .success(function(data, status, headers, config) {
                  $scope.result = null;
                  $scope.valid = true;
                  console.log('download started...');
                  var blob = new Blob([data], {type: "application/pdf"});
                  var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
                  navigator.saveBlob = navigator.saveBlob || navigator.msSaveBlob; // only works for IE
                  if (navigator.saveBlob) {
                      navigator.saveBlob(blob, 'download.pdf');
                  } else {
                      var url = urlCreator.createObjectURL(blob);
                      $scope.content = $sce.trustAsResourceUrl(url);
                  }
              })
      }
  }])
  .controller('QuizzesCtrl', ['$scope', function($scope) {

  }]);
