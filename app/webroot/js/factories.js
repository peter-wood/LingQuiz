'use strict';


angular.module('myApp.factories', [])
    .factory('myInterceptor',function ($rootScope, $q) {
        return {
            'request': function (config) {
		    console.log("fixing request header. stored key: " + sessionStorage.getItem("authkey"));
                if ($rootScope.credentials.authkey) {
                    config.headers.Authorization = 'Basic ' + $rootScope.credentials.authkey;
                } else if (sessionStorage.getItem("authkey")) {
		    config.headers.Authorization = 'Basic ' + sessionStorage.getItem("authkey");
		} else {
                    config.headers.Authorization = 'Basic not set';
                }
                console.log(config.headers);
                return config;
            }
        };
    });
