'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.factories',
  'myApp.controllers'
])

.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when("/main", {
      templateUrl: "partials/main.html",
      controller: "MainCtrl"
    })
    .when("/slides", {
      templateUrl: "partials/slides.html",
      controller: "SlidesCtrl"
    })
    .when("/book", {
      templateUrl: "partials/book.html",
      controller: "BookCtrl"
    })
    .when("/handouts", {
      templateUrl: "partials/handouts.html",
      controller: "HandoutsCtrl"
    })
    .when("/quizzes", {
      templateUrl: "partials/quizzes.html",
      controller: "QuizzesCtrl"
    })
    .when("/wiki", {
      url: "/wiki",
      templateUrl: "partials/wiki.html"
    })
    .when("/loggedIn", {
      url: "/loggedIn",
      templateUrl: "partials/loggedIn.html"
    })
     .when("/sorry", {
      url: "/sorry",
      templateUrl: "partials/sorry.html"
    })
     .otherwise( {
     redirectTo: "/main"
    });
}])

.config(['$httpProvider',  function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
}])

.run(['$rootScope', function($rootScope) {
    $rootScope.credentials = {};
    // sessionStorage.setItem("authkey", "I am initialzed in module.run");
    $rootScope.credentials.storedKey = sessionStorage.getItem("authkey");
}])

.run(function($http) {
	$http.defaults.headers.common.Authorization = "Basic invalid"
}) ;
