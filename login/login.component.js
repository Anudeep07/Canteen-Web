'use strict';

angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    controller: function LoginController($scope, $location, $rootScope) {
      let self = this;
      var db = firebase.firestore();

      firebase.auth().onAuthStateChanged(function (user) {
        $rootScope.user = user;
        if (user) {
          //Get type of user and route appropriately
          let userid = user.uid;
          console.log(userid);


          db.collection("User").where('userId', '==', userid)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                if (doc.data().type == 'Admin') {
                  // go to Admin page
                  $location.path('/admin');
                  $scope.$apply();
                } else {
                  //go to Hotel
                  $location.path('/hotel');
                  $scope.$apply();
                }
              });
            });
        }
      });

      self.signIn = function signIn() {
        console.log(self.username + '\n' + self.password);

        firebase.auth().signInWithEmailAndPassword(self.username, self.password).catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log('error ' + errorCode + ': ' + errorMessage);
        });
      };
    }
  })