'use strict';

/**
 * @ngdoc function
 * @name passerelleAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the passerelleAngularApp
 */
angular.module('passerelle2App')
  .controller('MainCtrl', [ '$scope', 'resourcesService', function($scope, resourcesService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    // Resource variables
    $scope.channels = resourcesService.getChannels();
	$scope.statuses = resourcesService.getStatuses();
    $scope.rooms = resourcesService.getRooms();
    $scope.selectedBooking = resourcesService.getBookings().get({bookingId:14});

    $scope.modalTemplate = 'views/booking-modal.html';
  }]);
