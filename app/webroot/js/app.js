'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router',
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

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("main");
  $stateProvider
    .state("main", {
      url: "/main",
      templateUrl: "partials/main.html",
      controller: "MainCtrl"
    })
    .state("slides", {
      url: "/slides",
      templateUrl: "partials/slides.html",
      controller: "SlidesCtrl"
    })
    .state("book", {
      url: "/book",
      templateUrl: "partials/book.html",
      controller: "BookCtrl"
    })
    .state("handouts", {
      url: "/handouts",
      templateUrl: "partials/handouts.html",
      controller: "HandoutsCtrl"
    })
    .state("quizzes", {
      url: "/quizzes",
      templateUrl: "partials/quizzes.html",
      controller: "QuizzesCtrl"
    })
    .state("wiki", {
      url: "/wiki",
      templateUrl: "partials/wiki.html"
    });
}])

.config(['$httpProvider',  function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
}])

.run(['$rootScope', function($rootScope) {
    $rootScope.credentials = {};
}])

.run(function($http) {
	$http.defaults.headers.common.Authorization = "Basic invalid"
}) ;
