'use strict';

angular.module('passerelle2App')
    .controller('CalCtrl', [ '$scope', 'resourcesService', '$log', function($scope, resourcesService,$log) { 
		$scope.$log = $log;
		$scope.bookingTemplate = 'views/bookingForm.html';
		$scope.vacationTemplate = 'views/vacationForm.html';
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.successTemplate = 'views/booking-success.html';
		$scope.selectedBooking = '';
		$scope.showBookings = false;
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

        $scope.rooms = [
		    {
		      id: 0,
		      name: 'Premier Cru',
		      price: 98,
		    },
		    {
		      id: 1,
		      name: 'Grand Cru',
		      price: 98
		    },
		    {
		      id: 2,
		      name: 'Corton Charlemagne',
		      price: 98
		    }
		];
		//sera inutile une fois le service REST à jour
		for (var i = 0; i < $scope.rooms.length; i++) {
			var room = $scope.rooms[i];
			room.bookings = resourcesService.getBookings().query();
			room.vacations = resourcesService.getVacation().query();
		}


		$scope.channels = [
		    {
		      id: 0,
		      text: 'lapasserelledescorton.fr',
		      url: 'http://www.lapasserelledescorton.fr/'
		    },
		    {
		      id: 1,
		      text: 'booking.com',
		      url: 'http://www.booking.com/index.fr.html'
		    },
		    {
		      id: 2,
		      text: 'airbnb.com',
		      url: 'https://www.airbnb.fr/'
		    }
		];
		$scope.statuses = [
			{value: 0, text: 'En attente de paiement'},
			{value: 1, text: 'Accompte payé'},
			{value: 2, text: 'Réservation annulée'},
			{value: 3, text: 'Archivé'}
		];

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