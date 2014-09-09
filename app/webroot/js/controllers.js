'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngCookies'])
  .controller('AuthCtrl', ['$scope', '$http', '$location', '$cookies', function($scope, $http, $location, $cookies) {
    $scope.creds = {nsid: null, snum: null};
    $scope.login = function(creds) {
      if (creds.snum === null || creds.nsid === null) {
          $location.path('/sorry');
          return;
      }
      var myPass = SparkMD5.hash(creds.snum);
      console.log('requesting auth. nsid: %s, snum: %s, hash: %s', creds.nsid, creds.snum, myPass);
      $http.jsonp(encodeURI('http://linguistics.usask.ca:8080/auth?callback=JSON_CALLBACK&nsid=' + creds.nsid + '&pass=' + myPass))
     .success(function(data, status, headers, config) {
       var key = data['key'];
       console.log(key);
       if (key != 'invalid') {
	   sessionStorage.LingKey = key;
	   $scope.creds = {nsid: null, snum: null};
           $location.path('/Ling111_test/loggedIn');
       } 
       else {
	   sessionStorage.LingKey = 'invalid';
           $location.path('/Ling111_test/sorry');
       }
     });
    }
  }])
  .controller('MainCtrl', ['$scope', function($scope) { 
    $scope.hash_test = SparkMD5.hash('Peter');
    // $scope.hash_test = 'Peter';
  }])
  .controller('SlidesCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
    $scope.result=[];
      console.log('LingKey= %s', sessionStorage.LingKey);
      $scope.content = null;
      $scope.valid=false;
      $scope.fileName = null;
      $scope.list = false;
      console.log('SlidesCtrl called');
      $http.jsonp(encodeURI('http://linguistics.usask.ca:8080/slides_res?callback=JSON_CALLBACK'))
       .success(function(data, status, headers, config) {
              if (data.result === -1) {
                  $scope.valid=false;
                  return;
              } else {
                  $scope.valid=true;
		  $scope.list=true;
		  $scope.LingKey= sessionStorage.LingKey;
                  $scope.result = data.result;
              }
          });
      $scope.download = function(file) {
          console.log('download called');
	  $scope.list=false;
	  $scope.fileName = file;
          console.log($scope.fileName);
	  // $scope.content='http://google.com';
	  $scope.content='http://linguistics.usask.ca:8080/resources/slides/' + $scope.fileName + '.html';
      }
      $scope.reset = function() {
	      $scope.list=true;
	      $scope.content = null;
      }
  }])
  .controller('BookCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
      $scope.result = null;
      $scope.content = null;
      $scope.resource = null;
      $scope.fileName = null;
      $scope.valid=false;
      console.log('BookCtrl called');
      $http.jsonp(encodeURI('http://linguistics.usask.ca:8080/book_res?callback=JSON_CALLBACK'))
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
      $scope.download = function(file) {
          console.log('download called');
          console.log(file);
          $scope.fileName = $sce.trustAsUrl('http://linguistics.usask.ca:8080/resources/book/'+file);
          
      }

  }])
  .controller('HandoutsCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
      $scope.result=null;
      $scope.content = null;
      $scope.valid=false;
      console.log('HandoutCtrl called');
      $http({url: 'http://linguistics.usask.ca:8080/handouts_res', method: 'GET'})
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
          $http({url: 'http://linguistics.usask.ca:8080/download', method: 'POST', data: {'file': fileName, 'resource': 'handouts'}, responseType: 'arraybuffer'})
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
  .controller('QuizzesCtrl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
;
  }]);
