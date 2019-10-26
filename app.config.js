angular.
    module('myApp').
    config(['$routeProvider',
        function config($routeProvider) {
            $routeProvider.
                when('/login', {
                    resolve: {
                        "check": function($location, $rootScope) {
                            if($rootScope.user) { 
                                $location.path('/admin');
                                $scope.$apply();
                            }
                        }
                    },
                    template: '<login></login>'
                }).
                when('/admin', {
                    resolve: {
                        "check": function($location, $rootScope) {
                            if(!$rootScope.user) { 
                                $location.path('/login');
                                $scope.$apply();
                            }
                        }
                    },
                    template: '<admin></admin>'
                }).
                when('/hotel', {
                    template: '<hotel></hotel>'
                }).
                otherwise('/login');
        }
    ]);