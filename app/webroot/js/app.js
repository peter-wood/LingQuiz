'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

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
.run(function($http) {
	$http.defaults.headers.common.Authorization = "Basic invalid"
}) ;
