angular.
    module('myApp').
    config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
                when('/login', {
                    resolve: {
                        "check": function ($location, $rootScope) {
                            if($rootScope.user) {
                                $location.path('/dashboard');
                            }
                        }
                    },
                    template: '<login></login>'
                }).
                when('/dashboard', {
                    resolve: {
                        "check": function($location, $rootScope) {
                            if(!$rootScope.user) { 
                                $location.path('/login');
                            }
                        }
                    },
                    template: '<dashboard></dashboard>'
                }).
                when('/hotel', {
                    template: '<hotel></hotel>'
                }).
                otherwise('/login');
        }
    ]);