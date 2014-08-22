'use strict';


angular.module('myApp.factories', [])
    .factory('myInterceptor',function ($rootScope, $q) {
        return {
            'request': function (config) {
                if ($rootScope.credentials.authkey) {
                    config.headers.Authorization = $rootScope.credentials.authkey;
                } else {
                    config.headers.Authorization = 'Basic not set';
                }
                console.log(config.headers);
                return config;
            }
        };
    });
