'use strict';


// Declare app level module which depends on filters, and services
angular.module('talk2us',
        ['talk2us.filters', 'talk2us.services', 'talk2us.directives', 'talk2us.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);


// Declare app level module which depends on filters, and services
angular.module('talk2usAdmin',
        ['talk2usAdmin.filters', 'talk2usAdmin.services', 'talk2usAdmin.directives', 'talk2usAdmin.controllers']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/sites', {
                templateUrl: '/partials/admin/_sites',
                controller: 'AdminListCtrl',
                resolve: {
                    entities: function(MultiEntityLoader) {
                        return MultiEntityLoader();
                    }
                }
            }).when('/users', {
                templateUrl: '/partials/admin/_roles',
                controller: 'AdminCtrl',
                resolve: {
                    entities: function(MultiEntityLoader) {
                        return MultiEntityLoader();
                    }
                }
            }).when('/stats', {
                templateUrl: '/partials/admin/_stats',
                controller: 'AdminCtrl',
                resolve: {
                    entities: function(MultiEntityLoader) {
                        return MultiEntityLoader();
                    }
                }
            }).when('/edit/:entityId', {
                templateUrl: '/views/entityForm.html',
                controller: 'AdminEditCtrl',
                resolve: {
                    entity: function(EntityLoader) {
                        return EntityLoader();
                    }
                }
            }).when('/view/:entityId', {
                templateUrl: '/views/viewEntity.html',
                controller: 'AdminViewCtrl',
                resolve: {
                    entity: function(EntityLoader) {
                        return EntityLoader();
                    }
                }
            }).when('/new', {
                templateUrl: '/views/entityForm.html',
                controller: 'AdminNewCtrl',
                resolve: {
                    entity: function(EntityLoader) {
                        return EntityLoader();
                    }
                }
            }).otherwise({redirectTo:'/sites'});
    }]);


