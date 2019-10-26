'use strict';

angular.
    module('hotel').
    component('hotel', {
        templateUrl: 'hotel/hotel.template.html',
        controller: function HotelController($scope, $location, $rootScope) {
            this.logout = function logout() {
                firebase.auth().signOut().then(function() {
                    $rootScope.user = null;

                    console.log('Successfully logged out!');
                    $location.path('/login');
                    $scope.$apply();
                    console.log('finished');
                }, function(error) {
                    console.log('Error');
                });
            };
        }
    })