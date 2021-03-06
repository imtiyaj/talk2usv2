'use strict';

/* Services */

angular.module('talk2us.services',['ngResource']).
factory('socketio', function($rootScope){
    var socket = io.connect(null,{'force new connection':true});
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}).
factory('webrtc', [ "$rootScope",  "$window", "socketio", function($rootScope, win, socketio) {
    var localStream = null,
        peerConn = null,
        debugEnabled = true,
        userInfo,
        role = 'client',
        stunServer = 'stun:stun.l.google.com:19302';

        if (win.shared && win.shared.userinfo) {
            userInfo = win.shared.userinfo;
            role = win.shared.userinfo.role;
        }

    var nav = win.navigator;

    nav.getUserMedia = nav.getUserMedia ||
                            nav.webkitGetUserMedia ||
                            nav.mozGetUserMedia ||
                            nav.msGetUserMedia;

    win.RTCPeerConnection = win.RTCPeerConnection ||
                                win.webkitRTCPeerConnection ||
                                win.mozRTCPeerConnection;

    win.RTCSessionDescription = win.RTCSessionDescription ||
                                    win.mozRTCSessionDescription;

    win.RTCIceCandidate = win.RTCIceCandidate ||
                            win.mozRTCIceCandidate;

    return {
        open: function (config, eventCallback) {
            nav.getUserMedia({audio: config.audio, video: config.video}, function(stream){
                localStream = stream;
                registerForPeerMessages(eventCallback);
                tieup(role, localStream, eventCallback);
                $rootScope.$apply(function () {
                    eventCallback.apply(this, ['LOCALSTREAM',win.URL.createObjectURL(localStream)]);
                });
            }, function () {
                console.log('No permission to access camera/mic');
                $rootScope.$apply(function () {
                    eventCallback.apply(this, ['LOCALSTREAM',null]);
                });
            });
            role = config.role;
            debug('Logged in the role of ' + role);
        },

        connect: function(config) {
            if (role === 'client') {
                peerConn = createPeerConnection();
                peerConn.addStream(localStream);

                var sdpConstraints = {'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                }};


                peerConn.createOffer(function(sessionDescription) {
                    peerConn.setLocalDescription(sessionDescription);
                    socketio.emit('OFFER', sessionDescription);
                }, null, sdpConstraints);
                debug('Client sent offer');
            }
        },

        set: function(config) {
           //mute and camera off messages here
        },

        close: function(config) {
            socketio.emit('HANGUP', {});
            if (peerConn) {
                peerConn.close();
            }
        }
    }

    function tieup(role, localStream, callback) {
        console.log('tieup called');
        console.log('localStream in tieup is ' + localStream);
        if (role === 'client' && localStream) {
            peerConn = createPeerConnection(callback);
            peerConn.addStream(localStream);

            var sdpConstraints = {'mandatory': {
                'OfferToReceiveAudio': true,
                'OfferToReceiveVideo': true
            }};


            peerConn.createOffer(function(sessionDescription) {
                peerConn.setLocalDescription(sessionDescription);
                socketio.emit('OFFER', sessionDescription);
            }, null, sdpConstraints);
            debug('Client sent offer');
        }
    }

    function registerForPeerMessages(callback) {
        socketio.on('OFFER', function (msg) {
            if (role === 'provider') {
                debug('Agent received offer');
                peerConn = createPeerConnection(callback);
                peerConn.setRemoteDescription(
                    new RTCSessionDescription(msg)
                );
                peerConn.addStream(localStream);            //localStream, is it available always?
                var sdpConstraints = {'mandatory': {
                    'OfferToReceiveAudio': true,
                    'OfferToReceiveVideo': true
                }};

                peerConn.createAnswer(sendAnswer, null, sdpConstraints);
            } else {
                debug('Error: OFFER received by CLIENT');
            }
            //indicate controller of message
            /*
            var args = ['OFFER'].concat(arguments);
            $rootScope.$apply(function () {
                callback.apply(this, args);
            });
            */
        });

        socketio.on('ANSWER', function (msg) {
            if (role === 'client') {
                debug('Client received answer: ' + msg);
                peerConn.setRemoteDescription(
                    new RTCSessionDescription(msg)
                );
            } else {
                debug('Error: ANSWER received by PROVIDER');
            }
            //indicate controller of message
            var args = ['ANSWER'].concat(arguments);
            $rootScope.$apply(function () {
                callback.apply(this, args);
            });
        });

        socketio.on('HANGUP', function (msg) {
            peerConn.close();
            //indicate controller of hangup
            var args = ['HANGUP'].concat(arguments);
            $rootScope.$apply(function () {
                callback.apply(this, args);
            });
        });

        socketio.on('CANDIDATE', function (msg) {
            debug('Received CANDIDATE ' + msg);
            var candidate = new RTCIceCandidate({candidate: msg});
            peerConn.addIceCandidate(candidate);
        });
    }

    function debug(s) {
        if (debugEnabled) {
            console.log(s);
        }
    }

    function sendAnswer(sessionDescription) {
        peerConn.setLocalDescription(sessionDescription);
        var msg = {};
        socketio.emit('ANSWER', sessionDescription);
    }

    function createPeerConnection(callback) {
        var peerConn = new RTCPeerConnection(
            {'iceServers': [{'url': stunServer}]}
        );

        peerConn.onicecandidate = onIceCandidate;
        peerConn.onconnecting = onSessionConnecting;
        peerConn.onopen = onSessionOpened;

        peerConn.onaddstream = function(event) {
            debug('Remote stream added');
            var url = win.URL.createObjectURL(event.stream);
            debug('createPeerConnection: url = ' + url);
            //indicate controller of remote url
            $rootScope.$apply(function () {
                callback.apply(this, ['REMOTESTREAM',url]);
            });

        };
        return peerConn;
    }

    function onIceCandidate(event){
        if (event.candidate) {
            debug('Sending ICE candidate to remote peer: ' +
                event.candidate.candidate);
            socketio.emit('CANDIDATE', event.candidate.candidate);
        } else {
            debug('onIceCandidate: no candidates');
        }
    }

    function onSessionConnecting(message) {
        debug('onSessionConnecting ...');
    }

    function onSessionOpened(message) {
        debug('onSessionOpened ...');
    }
}]);

angular.module('talk2usAdmin.services',['ngResource']).

    factory('Entity', ['$http','$q', function($http, $q){
        var baseUrl = '/entities/';
        return {
            query: function() {
                //create our deferred object.
                var deferred = $q.defer();

                //make the call.
                $http.get(baseUrl).success(function(data) {
                    //when data is returned resolve the deferment.
                    deferred.resolve(data);
                }).error(function(){
                    //or reject it if there's a problem.
                    deferred.reject();
                });

                //return the promise that work will be done.
                return deferred.promise;

            },
            remove: function(entityId) {
                //create our deferred object.
                var deferred = $q.defer();

                //make the call.
                $http.delete(baseUrl+entityId).success(function(data) {
                    //when data is returned resolve the deferment.
                    deferred.resolve(data);
                }).error(function(){
                    //or reject it if there's a problem.
                    deferred.reject();
                });

                //return the promise that work will be done.
                return deferred.promise;
            }
        }
    }]);

//    factory('Entity', ['$resource', function($resource) {
//        return $resource('/entities/:id', {id: '@_id'}, { query: {method: 'GET', isArray: false },
//                                        removeOne: {method:'POST'}});
//    }]).
//
//    factory('MultiEntityLoader', ['Entity', '$q', function(Entity, $q) {
//        return function() {
//            var delay = $q.defer(); Entity.query(function(entity) {
//                delay.resolve(entity); }, function() {
//                delay.reject('Unable to fetch entities');
//            });
//            return delay.promise;
//        };
//    }]).
//
//    factory('EntityLoader', ['Entity', '$route', '$q', function(Entity, $route, $q) {
//        return function() {
//            var delay = $q.defer();
//            Entity.get({id: $route.current.params.entityId}, function(entity) {
//                delay.resolve(entity);
//            }, function() {
//                delay.reject('Unable to fetch entity ' + $route.current.params.entityId);
//            });
//            return delay.promise;
//        };
//    }]);
