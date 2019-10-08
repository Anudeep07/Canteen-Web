'use strict';

angular.
    module('login').
    component('login', {
        templateUrl: 'login/login.template.html',
        controller: function LoginController($scope, $location, $rootScope) {
            let self = this;
            
            firebase.auth().onAuthStateChanged(function(user) {
                $rootScope.user = user;
                console.log(user);
                if(user) {
                    $location.path('/dashboard');
                    $scope.$apply();
                    console.log('moved to dashboard');
                }
            });    

            self.signIn = function signIn() {
                console.log(self.username + '\n' + self.password);
                
                firebase.auth().signInWithEmailAndPassword(self.username, self.password).catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log('error ' + errorCode + ': ' + errorMessage);
                });
            };
        }
    })