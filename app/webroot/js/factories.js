'use strict';


angular.module('myApp.factories', [])
    .factory('myInterceptor',function ($rootScope, $q) {
        return {
            'request': function (config) {
                return config;
            }
        };
    });
