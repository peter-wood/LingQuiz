'use strict';


angular.module('myApp.factories', [])
    .factory('myInterceptor',function ($rootScope, $q) {
        return {
            'request': function ($config) {
		    $config.headers = $config.headers || {};
		    //if (sessionStorage.LingKey) {
			    $config.headers['Authorization'] = 'Bearer ' + sessionStorage.LingKey;
			    $config.headers['Authorization'] = 'Stuff ' + sessionStorage.LingKey;
		    //}
		    // if ($rootScope.LingAuth) {
		// 	    console.log('interceptor setting header');
		// 	    $config.headers['LingAuth'] = $rootScope.LingAuth;
		  //   }

	    return $config;
            }
        };
    });
