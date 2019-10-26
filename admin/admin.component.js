'use strict';

angular.
    module('admin').
    component('admin', {
        templateUrl: 'admin/admin.template.html',
        controller: function DashboardController($scope, $location, $rootScope) {
            var db = firebase.firestore();
            let self = this;

            $scope.columns = [];
            $scope.rows = [];
            $scope.user = 'Hotel';

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

            this.viewHotel = () => {
                $('#adminBtn').removeClass('active');
                $('#hotelBtn').addClass('active');

                this.fetchHotelDetails();
            };

            this.viewAdmin = () => {
                $('#hotelBtn').removeClass('active');
                $('#adminBtn').addClass('active');

                this.fetchAdminDetails();
            };

            this.fetchHotelDetails = () => {
                db.collection('Hotel')
                    .get()
                    .then(querySnapshot => {
                        let arr = [];
                        querySnapshot.forEach(doc => {
                            let hotelDoc = doc.data();
                            arr.push(hotelDoc);
                        });

                        $scope.rows = arr;
                        $scope.columns = ['name', 'address'];
                        $scope.user = 'Hotel';
                        $scope.$apply();
                    });
            };

            this.fetchAdminDetails = () => {
                db.collection('User').where('type', '==', 'Admin')
                    .get()
                    .then(querySnapshot => {
                        let arr = [];
                        querySnapshot.forEach(doc => {
                            let adminDoc = doc.data();
                            arr.push(adminDoc);
                        });

                        $scope.rows = arr;
                        $scope.columns = ['name', 'userId'];
                        $scope.user = 'Admin';
                        $scope.$apply();
                    });
            };

            this.fetchHotelDetails();
        }
    })