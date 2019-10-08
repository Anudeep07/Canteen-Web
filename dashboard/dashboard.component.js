'use strict';

angular.
    module('dashboard').
    component('dashboard', {
        templateUrl: 'dashboard/dashboard.template.html',
        controller: function DashboardController($scope, $location, $rootScope) {
            console.log('Inside dashboard');
            let self = this;

            self.logout = function logout() {
                firebase.auth().signOut().then(function() {
                    $rootScope.user = null;

                    console.log('Successfully logged out!');
                    $location.path('/login');
                    $scope.$apply();
                    console.log('finished');
                }, function(error) {
                    console.log('Error');
                });
            }
        }
    })