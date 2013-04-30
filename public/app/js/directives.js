'use strict';

/* Directives */


angular.module('talk2us.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).

  directive('showonhoverparent', function() {
        return {
            link : function(scope, element, attrs) {
                element.parent().bind('mouseenter', function() {
                    element.show();
                });
                element.parent().bind('mouseleave', function() {
                    element.hide();
                });
            }
        };
  }).

  directive( 'editInPlace', function() {
    return {
        restrict: 'EA',
        scope: { value: '=editInPlace', clickable: '&', editing: '=' },
        template: '<span ng-click="handleClick()" ng-bind="value"></span><input ng-model="value"></input>',
        link: function ( $scope, element, attrs ) {
            // Let's get a reference to the input element, as we'll want to reference it.
            var inputElement = angular.element( element.children()[1] );

            // This directive should have a set class so we can style it.
            element.addClass( 'edit-in-place' );

            // Initially, we're not editing.
            $scope.currentlyEditing = false;

            // ng-click handler to activate edit-in-place if the element is clickable.
            $scope.handleClick = function() {
                if ( $scope.clickable() ) $scope.edit();
            };

            $scope.$watch( 'editing', function () {
                console.log("editInPlace editing changed", $scope.editing);
                if ( $scope.editing ) {
                    $scope.edit();
                } else {
                    $scope.stop();
                }
            });

            // activate editing mode
            $scope.edit = function () {
                $scope.currentlyEditing = true;

                // We control display through a class on the directive itself. See the CSS.
                element.addClass( 'active' );

                // And we must focus the element.
                // `angular.element()` provides a chainable array, like jQuery so to access a native DOM function,
                // we have to reference the first element in the array.
                inputElement[0].focus();
            };

            // When we leave the input, we're done editing.
            inputElement.prop( 'onblur', function() {
                if ( $scope.clickable() && $scope.currentlyEditing ) {
                    $scope.stop();
                }
            });

            // Stop editing
            $scope.stop = function () {
                $scope.currentlyEditing = false;
                element.removeClass( 'active' );
            };
        }
    };
  }).

  directive( 'editUser', function () {
    return {
        restrict: 'EA',
        scope: { user: '=editUser', roles: '=roles' },
        template:
            '<th edit-in-place="user.name"></th> | ' +
                '<th edit-in-place="user.email"></th> | ' +
                '<th><select ng-model="user.role" ng-options="role for role in roles"></select>   </th> | ' +
                '<th edit-in-place="user.provider" ></th> | ' +
                '<th style="display:none" showonhoverparent>' +
                    '<a class="button tiny left" ng-click="edit()">Save</a>'  +
                    '<a class="button tiny right" ng-show="!editing" ng-click="">Remove</a></th>',
        link: function ( $scope, element, attrs ) {
            $scope.edit = function() {
                var button = angular.element( element.children()[4].children[0] );

                // If we're editing, stop. Otherwise, start.
                if ( $scope.editing ) {
                    $scope.editing = false;
                    button.prop("innerText", "Edit");
                } else {
                    $scope.editing = true;
                    button.prop("innerText", "Done");
                }
            };
        }
    };
});

