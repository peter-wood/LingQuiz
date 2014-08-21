'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/slides', {templateUrl: 'partials/slides.html', controller: 'SlidesCtrl'});
  $routeProvider.when('/book', {templateUrl: 'partials/book.html', controller: 'BookCtrl'});
  $routeProvider.when('/handouts', {templateUrl: 'partials/handouts.html', controller: 'HandoutsCtrl'});
  $routeProvider.when('/quizzes', {templateUrl: 'partials/quizzes.html', controller: 'QuizzesCtrl'});
  $routeProvider.when('/wiki', {templateUrl: 'partials/wiki.html'});
  $routeProvider.when('/main', {templateUrl: 'partials/main.html', controller: 'MainCtrl'});
  $routeProvider.otherwise({redirectTo: '/main'});
$locationProvider.html5Mode(true);

//  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
//  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
//  $routeProvider.otherwise({redirectTo: '/view1'});

}])
.run(function($http) {
	$http.defaults.headers.common.Authorization = "Basic invalid"
}) ;
