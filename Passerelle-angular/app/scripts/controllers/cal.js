'use strict';

angular.module('passerelle2App')
    .controller('CalCtrl', [ '$scope', 'resourcesService', '$log', function($scope, resourcesService,$log) { 
		$scope.$log = $log;
		
		// init partials
		$scope.vacationTemplate = 'views/vacation-form.html';
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.modalTemplate = 'views/booking-modal.html';

		var today = new Date();
	    // format date to '2016-10-15'
	    var date = today.toISOString().substring(0, 10);
		
		// init $scope Resource values 
        resourcesService.getBookings().query(
            function(response) {
                $scope.bookings = response;
                $scope.showBookings = true;
            },
            function(response) {
                $scope.message = 'Error: '+response.status + ' ' + response.statusText;
            }
        );
        $scope.channels = resourcesService.getChannels();
		$scope.statuses = resourcesService.getStatuses();
        $scope.rooms = resourcesService.getRooms().query({date:date});

		$scope.getRoomName = resourcesService.getRoomName;

		// display behavioural values
		$scope.rowTitle = 'Nouvelle réservation';
		$scope.formTitle = 'Ajouter une réservation';
		$scope.selectedBooking = '';
		$scope.showBookings = false;
		$scope.selectedRoom = '';
		$scope.tab = 'all';

		$scope.select = function(setTab) {
            $scope.tab = setTab;
            $scope.selectedRoom = setTab;
            if (setTab==='all') {
            	$scope.selectedRoom = '';
            }
            
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.setSelectedBooking = function (booking) {
        	$scope.selectedBooking = booking;
        };

		$scope.sort = 'id';
		$scope.reverseSort = false;
		$scope.sortBookingBy = function (criteria){
			if ($scope.sort !== criteria) {
				$scope.sort = criteria;
				$scope.reverseSort = false;
			}
			else {
				$scope.reverseSort = !$scope.reverseSort;
			}
		};

	}])
;