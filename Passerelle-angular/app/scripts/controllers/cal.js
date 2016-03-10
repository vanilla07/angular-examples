'use strict';

angular.module('passerelle2App')
    .controller('CalCtrl', [ '$scope', 'resourcesService', '$log', function($scope, resourcesService,$log) { 
		$scope.$log = $log;
		
		// init partials
		$scope.bookingTemplate = 'views/bookingForm.html';
		$scope.vacationTemplate = 'views/vacationForm.html';
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.modalTemplate = 'views/booking-modal.html';
		
		// init $scope Resource values 
		$scope.message = 'Loading ...';
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
        $scope.rooms = resourcesService.getRooms();

		//sera inutile une fois le service REST à jour
		for (var i = 0; i < $scope.rooms.length; i++) {
			var room = $scope.rooms[i];
			room.bookings = resourcesService.getBookings().query();
			room.vacations = resourcesService.getVacation().query();
		}

		// display behaviour values
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