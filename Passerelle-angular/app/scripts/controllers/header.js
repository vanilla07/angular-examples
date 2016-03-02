'use strict';

/**
 * @ngdoc function
 * @name passerelleAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the passerelleAngularApp
 */
angular.module('passerelle2App')
  .controller('HeaderCtrl', [ '$scope', '$location', function($scope, $location) { 
    		
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

  }]);