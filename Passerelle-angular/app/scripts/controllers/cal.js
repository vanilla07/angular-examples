'use strict';

angular.module('passerelle2App')
  .controller('CalCtrl', [ '$scope', 'bookingsService', '$log', function($scope, bookingsService,$log) { 
		$scope.$log = $log;
		$scope.bookingTemplate = 'views/bookingForm.html';
		$scope.vacationTemplate = 'views/vacationForm.html';
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.successTemplate = 'views/booking-success.html';
		$scope.selectedBooking = '';
		$scope.showBookings = false;
		$scope.message = 'Loading ...';
        bookingsService.getBookings().query(
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
		      price: 98
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
		$scope.selectDate = function(ev, date){
			console.log(ev);
			console.log(date);
		};

	}]).controller('BookCtrl', [ '$scope', 'bookingsService', '$log', '$state', function($scope, bookingsService, $log, $state) { 
		$scope.$log = $log;
		$scope.minDate = new Date();
		$scope.dateOut = new Date(
			$scope.minDate.getFullYear(),
			$scope.minDate.getMonth(),
			$scope.minDate.getDate()+1
		);
		$scope.newBooking = function () {
			$scope.booking = 
				{
					room:'',
					name:'', 
					email:'',
					guestsNumber:2,
					dateIn: $scope.minDate,
					dateOut: $scope.dateOut, 
					notes:'', 
					dateReservation:'',
					status:0,
					channel:0,
					telephone:''
				};
		};
		$scope.newBooking();
		$scope.book = function () {
                
            $scope.booking.dateReservation = new Date().toISOString();
            
            bookingsService.getBookings().save($scope.booking);

            $scope.bookings = bookingsService.getBookings().query();
            
            $scope.bookForm.$setPristine();                
            
            $scope.newBooking();
			
			$state.forceReload();

		};
	}]).controller('VacationCtrl', [ '$scope', 'bookingsService', '$log', '$state', function($scope, bookingsService, $log, $state) { 
		$scope.$log = $log;
		$scope.hideAvailibilityMsg = false;
		$scope.now = new Date();
		$scope.minDate = new Date(
			$scope.now.getFullYear(),
			$scope.now.getMonth(),
			$scope.now.getDate()
		);
		$scope.dateOut = new Date(
			$scope.minDate.getFullYear(),
			$scope.minDate.getMonth(),
			$scope.minDate.getDate()+1
		);

		for (var i = 0; i < $scope.rooms.length; i++) {
			var room = $scope.rooms[i];
			room.fullDates = bookingsService.getDatesByRoom(room.id).query();
		}
		
		$scope.fullDates = function () {
			$scope.hideAvailibilityMsg = isPeriodAvailable(0, $scope.vacation.dateStart, $scope.vacation.dateEnd);
		};

		var isPeriodAvailable = function(roomId, dateIn, dateOut) {
			var result = true;
			var d = new Date('2016-03-25T02:00:00');
			$scope.day = d.getDate();

			for (i = $scope.rooms.length - 1; i >= 0; i--) {
				var room = $scope.rooms[i];
				if (room.id === roomId) {
					for (i = 0; i < room.fullDates.length; i++) {
						var gmtDate  = new Date(room.fullDates[i].date);
						var lastDayIn =  new Date(
							dateOut.getFullYear(),
							dateOut.getMonth(),
							dateOut.getDate()-1
						);
						var date = new Date(
							gmtDate.getFullYear(),
							gmtDate.getMonth(),
							gmtDate.getDate()
						);
						if (date.getTime() === dateIn.getTime() || date.getTime() === lastDayIn.getTime()) {
							result = false;
							break;
						}
					}
					break;
				}
			}
			return result;
		};

		$scope.changeDateEnd = function () {
			if($scope.vacation.dateStart >= $scope.vacation.dateEnd) {
				$scope.dateOut = new Date(
					$scope.vacation.dateStart.getFullYear(),
					$scope.vacation.dateStart.getMonth(),
					$scope.vacation.dateStart.getDate()+1
				);
				$scope.vacation.dateEnd = $scope.dateOut;
			}
			$scope.fullDates();	
		};
		$scope.newVacation = function () {
			$scope.vacation = 
				{
					room:'',
					name:'', 
					dateStart: $scope.minDate,
					dateEnd: $scope.dateOut, 
					notes:'', 
				};
		};
		$scope.newRoomChoices = function () {
			$scope.roomChoices = [true, true, true];
		};
		$scope.newVacation();
		$scope.newRoomChoices();
		$scope.changeDateEnd();
		
		$scope.addVacation = function () {
            var vacationList = [];
            var i = 0;
            for (i = 0; i < $scope.roomChoices.length; i++) {
            	if ($scope.roomChoices[i]){
            		$scope.vacation.room = i;
            		vacationList.push(angular.copy($scope.vacation));
            	}
            }                
            
            for (i = 0; i < vacationList.length; i++) {
            	bookingsService.getVacation().save(vacationList[i]);
            }

            $scope.vacationForm.$setPristine();                
            
            $scope.newVacation();
            $scope.newRoomChoices();
			
			$state.forceReload();

		};
	}])
;