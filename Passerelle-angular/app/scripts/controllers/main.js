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

    var today = new Date();
    var date = today.toISOString().substring(0, 10);
    // Resource variables
    $scope.nextBookings = [];
    $scope.channels = resourcesService.getChannels();
	  $scope.statuses = resourcesService.getStatuses();
    $scope.rooms = resourcesService.getRooms().query({date:date});
    $scope.rooms.$promise.then(function(data) {
      $scope.nextBookings = [];
      // parcours des chambres
      for (var i = 0; i < data.length; i++) {
        // recuperation de la resa en cours ou la prochaine
        var booking = data[i].bookings[0];
        // si elle existe : on la sauvegarde pour affichage
        if (booking) {
          var id = booking.id;
          var fullBooking = resourcesService.getBookings().get({bookingId:id});
          fullBooking.roomName = data[i].name;
          $scope.nextBookings.push(fullBooking);
        }
        // TODO: Sinon afficher un message disant que pour cette chambre il n'y a pas de résa
      }
    });

    $scope.selectBooking = function(id) {
      for (var i = 0; i < $scope.nextBookings.length; i++) {
        if (id === $scope.nextBookings[i].id) {
          $scope.selectedBooking = $scope.nextBookings[i];
          break;
        }
      }
    };

    $scope.getRoomName = function(id) {
      for (var i = 0; i < $scope.rooms.length; i++) {
        if (id === $scope.rooms[i].id) {
          return $scope.rooms[i].name;
        }
      }
    };

    $scope.modalTemplate = 'views/booking-modal.html';
  }]);
