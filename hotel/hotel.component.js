'use strict';

angular.
    module('hotel').
    component('hotel', {
        templateUrl: 'hotel/hotel.template.html',
        controller: function HotelController($scope, $location, $rootScope) {
            var db = firebase.firestore();
            let self = this;

            $scope.isViewMenu = false;
            $scope.menuItems = {};
            $scope.details = [
                {
                    type: 'text',
                    fieldName: 'Name'
                },
                {
                    type: 'number',
                    fieldName: 'Price'
                }
            ];
            $scope.userName = $rootScope.user.email;

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

            this.viewOrder = () => {
                $scope.isViewMenu = false;

                $('#MenuBtn').removeClass('active');
                $('#OrderBtn').addClass('active');

                this.fetchOrderDetails();
            };

            this.viewMenu = () => {
                $scope.isViewMenu = true;

                $('#OrderBtn').removeClass('active');
                $('#MenuBtn').addClass('active');

                this.fetchMenuDetails();
            };

            this.fetchOrderDetails = () => {
                // TODO - get order contents from firebase for the current logged in hotel
            };

            this.fetchMenuDetails = () => {
                db.collection('User').doc($scope.userName)
                    .get()
                    .then(function(doc) {
                        $scope.menuItems = doc.data().menu;
                        $scope.$apply();
                    })
                    .catch(function(error) {
                        console.log('Error getting document:' + error);
                    });
            };

            this.addNewItem = () => {
                let name = $('#Name').val();
                let price = $('#Price').val();  
                console.log(name + ' ' + price);

                let newItem = {
                    menu: {

                    }
                };

                newItem.menu[name] = price;

                db.collection('User').doc($scope.userName)
                    .set(newItem, {merge: true});

                $('#Name').val('');
                $('#Price').val('');
            };

            
             db.collection('User').doc($scope.userName)
                .onSnapshot(function(doc) {
                    $scope.menuItems = doc.data().menu;
                    $scope.$apply();
                });

            this.fetchOrderDetails();
        }
    })