'use strict';


// Declare app level module which depends on filters, and services
angular.module('talk2us',
        ['talk2us.filters', 'talk2us.services', 'talk2us.directives', 'talk2us.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
  }]);


// Declare app level module which depends on filters, and services
angular.module('talk2usAdmin',
        ['talk2usAdmin.filters', 'talk2usAdmin.services', 'talk2usAdmin.directives', 'talk2usAdmin.controllers']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/sites', {
                templateUrl: '/partials/admin/_sites',
                controller: 'AdminSitesCtrl',
                resolve: {
                    entities: function(Entity) {
                        return Entity.query();
                    }
                }
            }).when('/users', {
                templateUrl: '/partials/admin/_roles',
                controller: 'AdminRolesCtrl',
                resolve: {
                    entities: function(Entity) {
                        return Entity.query();
                    }
                }
            }).when('/stats', {
                templateUrl: '/partials/admin/_stats',
                controller: 'AdminStatsCtrl',
                resolve: {
                    entities: function(Entity) {
                        return Entity.query();
                    }
                }
            }).otherwise({redirectTo:'/sites'});
    }]);


//}).when('/edit/:entityId', {
//    templateUrl: '/views/entityForm.html',
//    controller: 'AdminEditCtrl',
//    resolve: {
//        entity: function(EntityLoader) {
//            return EntityLoader();
//        }
//    }
//}).when('/view/:entityId', {
//        templateUrl: '/views/viewEntity.html',
//        controller: 'AdminViewCtrl',
//        resolve: {
//            entity: function(EntityLoader) {
//                return EntityLoader();
//            }
//        }
//    }).when('/new', {
//        templateUrl: '/views/entityForm.html',
//        controller: 'AdminNewCtrl',
//        resolve: {
//            entity: function(EntityLoader) {
//                return EntityLoader();
//            }
//        }


