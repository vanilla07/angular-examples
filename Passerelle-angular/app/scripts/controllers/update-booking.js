'use strict';

angular.module('passerelle2App')
    .controller('UpdateBookingCtrl', [ '$scope', 'resourcesService', '$stateParams', '$log', function($scope, resourcesService, $stateParams, $log) { 
       	var selectedId = $stateParams.bookingId;
    	$scope.isUpdate = true;
    	$scope.rowTitle = 'Modifier une réservation';
		$scope.formTitle = 'Modifier la réservation';

    	// init partials
		$scope.calendarsTemplate = 'views/calendars.html';

		// init $scope Resource values 
        $scope.channels = resourcesService.getChannels();
		$scope.statuses = resourcesService.getStatuses();
        $scope.rooms = resourcesService.getRooms();
		resourcesService.getBookings().get({bookingId:selectedId},
			// success
			function(response) {
				var dateIn = new Date(response.dateIn);
				var dateOut = new Date(response.dateOut);
                $scope.booking = response;
                $scope.booking.dateIn = dateIn;
                $scope.booking.dateOut = dateOut;
                $scope.rowTitle = 'Réservation n° ' + selectedId;
            },
            // fail
            function(response) {
            	$scope.retrieveError = true;
                $scope.errorMessage = 'La réservation n\'a pas été trouvée' ;
                $log.warn('Error: '+response.status + ' ' + response.statusText);
            }
		);
        
		//sera inutile une fois le service REST à jour
		for (var i = 0; i < $scope.rooms.length; i++) {
			var room = $scope.rooms[i];
			room.bookings = resourcesService.getBookings().query();
			room.vacations = resourcesService.getVacation().query();
		}
    	
}]);