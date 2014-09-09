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
  $urlRouterProvider.otherwise('/Ling111_test');

  $stateProvider
    .state("main", {
      url: '/Ling111_test',
      templateUrl: "/Ling111_test//partials/main.html",
      controller: "MainCtrl"
    })
    .state("slides", {
      url: "/Ling111_test/slides",
      templateUrl: "/Ling111_test/partials/slides.html",
      controller: "SlidesCtrl"
    })
    .state("book", {
      url: "/Ling111_test/book",
      templateUrl: "/Ling111_test/partials/book.html",
      controller: "BookCtrl"
    })
    .state("handouts", {
      url: "/Ling111_test/handouts",
      templateUrl: "/Ling111_test/partials/handouts.html",
      controller: "HandoutsCtrl"
    })
    .state("quizzes", {
      url: "/Ling111_test/quizzes",
      templateUrl: "/Ling111_test/partials/quizzes.html",
      controller: "QuizzesCtrl"
    })
    .state("wiki", {
      url: "/Ling111_test/wiki",
      templateUrl: "/Ling111_test/partials/wiki.html"
    })
    .state("loggedIn", {
      url: "/Ling111_test/loggedIn",
      templateUrl: "/Ling111_test/partials/loggedIn.html"
    })
     .state("sorry", {
      url: "/Ling111_test/sorry",
      templateUrl: "/Ling111_test/partials/sorry.html"
    })
}])

.config(['$httpProvider',  function($httpProvider) {
    $httpProvider.interceptors.push('myInterceptor');
}])

.config(['$sceProvider',  function($sceProvider) {
    $sceProvider.enabled(false);
    ;
}])


.run([function() {
    sessionStorage.LingKey = 'invalid';
    // sessionStorage.setItem("authkey", "I am initialzed in module.run");
    // $rootScope.credentials.storedKey = sessionStorage.getItem("authkey");
}])

.run(function($http) {
	$http.defaults.headers.common.Authorization = "Basic invalid"
}) ;
