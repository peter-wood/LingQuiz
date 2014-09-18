'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('optfilter', function() {
	  return function(input) {
		  if (input === '') {
			  return '   ';
		  }
		  else {
			  return input;
		  }
	  };
  })

;
