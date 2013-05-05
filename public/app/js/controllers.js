'use strict';

/* Controllers */

angular.module('talk2us.controllers', [])
    .controller('ChatCtrl', ['$scope', 'socketio', 'webrtc', '$window', function($scope, socket, rtc, win) {
        var userInfo
          , role = 'client';
        var debug = function(s) {
            console.log(s);
        };

        if (win.shared && win.shared.userinfo && win.shared.userinfo.role) {
            userInfo = win.shared.userinfo;
            role = win.shared.userinfo.role;
            debug('Role defined as ' + role);
        } 

        // Socket listeners
        // ================

        socket.on('init', function (data) {
            $scope.name = data.name;
            $scope.users = data.users;
        });

        socket.on('send:message', function (message) {
            $scope.messages.push(message);
        });

        socket.on('change:name', function (data) {
            changeName(data.oldName, data.newName);
        });

        socket.on('user:join', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has joined.'
            });
            $scope.users.push(data.name);
        });

        // add a message to the conversation when a user disconnects or leaves the room
        socket.on('user:left', function (data) {
            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + data.name + ' has left.'
            });
            var i, user;
            for (i = 0; i < $scope.users.length; i++) {
                user = $scope.users[i];
                if (user === data.name) {
                    $scope.users.splice(i, 1);
                    break;
                }
            }
        });

        // Private helpers
        // ===============

        var changeName = function (oldName, newName) {
            // rename user in list of users
            var i;
            for (i = 0; i < $scope.users.length; i++) {
                if ($scope.users[i] === oldName) {
                    $scope.users[i] = newName;
                }
            }

            $scope.messages.push({
                user: 'chatroom',
                text: 'User ' + oldName + ' is now known as ' + newName + '.'
            });
        }

        var sendRoom = function(role) {
            var msg = {};
            msg.msg_type = 'ROOM';
            msg.room = 'DEMOROOM';
            msg.role = role;
            socket.emit('ROOM',msg);
        }

        var rtcEvents = function () {
             switch (arguments[0]) {
                 case 'LOCALSTREAM':
                     $scope.smallstream = arguments[1];
                     break;
                 case 'REMOTESTREAM':
                     $scope.mainstream = arguments[1];
                     break;
             }
        }

        // Methods published to the scope
        // ==============================

        $scope.changeName = function () {
            socket.emit('change:name', {
                name: $scope.newName
            }, function (result) {
                if (!result) {
                    alert('There was an error changing your name');
                } else {

                    changeName($scope.name, $scope.newName);

                    $scope.name = $scope.newName;
                    $scope.newName = '';
                }
            });
        };

        $scope.messages = [];

        $scope.sendMessage = function () {
            socket.emit('send:message', {
                message: $scope.message
            });

            // add the message to our model locally
            $scope.messages.push({
                user: $scope.name,
                text: $scope.message
            });

            // clear message box
            $scope.message = '';
        };

        $scope.connect = function() {
            /*
             * If user not logged in, assume role to be 'client' for demo
             */
            debug('sendRoom role is ' + role);
            sendRoom(role);
            rtc.open({role: role, audio: true, video: true}, rtcEvents);
        }

        //to show and hide demo
        $scope.showWidgets = false;
        $scope.toggleWidgetWindow = function() {
             $scope.showWidgets = !($scope.showWidgets);
        }


  }]).
  controller('SigninCtrl', ['$scope',function($scope) {
         $scope.checkPassword = function() {
            $scope.signinForm.retype_password.$error.dontmatch
                     = $scope.user.password !== $scope.user.retype_password;
        };
   }]);

angular.module('talk2usAdmin.controllers', []).
    controller('AdminSitesCtrl', ['$scope','entities','Entity',function($scope, entities,Entity) {

        $scope.entities = entities.data.entities;

        $scope.remove = function(id){
            $scope.entities.forEach(function(entity, index) {
                if (id === entity._id) {
                    Entity.remove(id).then(function() {
                        $scope.entities.splice(index, 1);
                    });
                }
            });
        }
    }]).
    controller('AdminRolesCtrl', ['$scope','entities',function($scope, entities) {
        $scope.users = [{name: "Ravi1", email: "rbail2000@gmail.com", role:"admin", provider:"facebook"},
            {name: "Ravi2", email: "rbail2000@gmail.com", role:"admin", provider:"facebook"},
            {name: "Ravi3", email: "rbail2000@gmail.com", role:"agent", provider:"facebook"},
            {name: "Ravi4", email: "rbail2000@gmail.com", role:"agent", provider:"facebook"},
            {name: "Ravi5", email: "rbail2000@gmail.com", role:"customer", provider:"facebook"}];
        $scope.selectedRole= 'agent';

        $scope.roles=['agent','admin','customer'];

    }]).
    controller('AdminStatsCtrl', ['$scope','entities',function($scope, entities) {

    }]);


//    controller('AdminListCtrl', ['$scope', 'entities', function($scope,entities){
//       $scope.entities = entities;
//    }]).
//    controller('AdminViewCtrl',['$scope', '$location', 'entity', function($scope,$location,entity){
//        $scope.entity = entity;
//
//        $scope.edit = function() {
//            $location.path('/edit/' + entity.id);
//        }
//    }]).
//    controller('AdminEditCtrl', ['$scope','$location', 'entity', function($scope, $location, entity){
//        $scope.entity = entity;
//
//        $scope.save = function(){
//            $scope.entity.$save(function(entity){
//                $location.path('/view'+ entity.id);
//            })
//        }
//
//        $scope.remove = function(){
//            $scope.entity.$remove(function(entity){
//                delete $scope.entity;
//                $location.path('/');
//            })
//        }
//    }]).
//    controller('AdminNewCtrl',['$scope', '$location','Entity',function($scope,$location,Entity){
//        $scope.entity = new Entity();
//
//        $scope.save = function(){
//            $scope.entity.$save(function(entity){
//                $location.path('/view' + entity.id);
//            })
//        }
//    }]);
