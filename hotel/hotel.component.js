'use strict';

angular.
    module('hotel').
    component('hotel', {
        templateUrl: 'hotel/hotel.template.html',
        controller: function HotelController($scope, $location, $rootScope) {
            var db = firebase.firestore();
            let self = this;

            $scope.orders = [];
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

            // Set realtime listener for Orders
            db.collection('Order').where('hotelId', '==', $scope.userName)
                .onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        let docData = doc.data();

                        // Check if order is already being shown
                        let existingElementIndex = $scope.orders.findIndex(element => {
                            return element.orderId == doc.id;
                        });

                        if(existingElementIndex != -1) {
                            // element already existing in the array
                            // remove the old one
                            $scope.orders.splice(existingElementIndex, 1);
                        }

                        let totalCost = 0;
                        docData.items.forEach(item => {
                            totalCost += item.price * item.quantity;
                        });

                        docData['totalCost'] = totalCost;
                        docData['orderId'] = doc.id;

                        if(docData.status === 'cooking') {
                            docData['style'] = 'btn-info';  
                            docData['message'] = 'Completed Cooking';
                        } else if(docData.status === 'paymentPending') {
                            docData['style'] = 'btn-danger';  
                            docData['message'] = 'Completed Payment';
                        } else {
                            // status is completed
                            return;
                        }

                        console.log(docData);

                        // Instead of pushing, we need to first check if it already exists.
                        $scope.orders.push(docData);
                        $scope.$apply();
                    });
                });

            // Set realtime listener for Menu
             db.collection('User').doc($scope.userName)
                .onSnapshot(function(doc) {
                    $scope.menuItems = doc.data().menu;
                    $scope.$apply();
                });

            $scope.changeOrderStatus = index => {
                console.log($('#currentOrderBtn' + index));
                console.log(index);
                console.log($scope.orders[index]);

                let docData = $scope.orders[index];
                let orderBtn = $('#currentOrderBtn' + index);

                if(docData.status == 'cooking') {
                    docData.status = 'paymentPending';

                    orderBtn.html('Completed Payment');
                    orderBtn.removeClass('btn-info');
                    orderBtn.addClass('btn-danger');
                } else if(docData.status == 'paymentPending') {
                    docData.status = 'completed';
                } else if(docData.status == 'completed') {
                    return;
                }

                db.collection('Order').doc(docData.orderId)
                    .set(docData, {merge: true});

                if(docData.status == 'completed') {
                    $scope.orders.splice(index, 1);
                    $scope.$apply();
                }
            }

            this.fetchOrderDetails();
        }
    })