'use strict';

angular.module('passerelle2App')
    .controller('BookCtrl', [ '$scope', 'resourcesService', 'formService' ,'$log', '$state', function($scope, resourcesService, formService, $log, $state) { 
		$scope.$log = $log;
		$scope.hideAvailibilityMsg = false;
		
		$scope.minDate = formService.minDate;
		//racalculate the limits of dateOut
		formService.updateDateOutLimits($scope.minDate);
		$scope.minDateOut = formService.minDateOut;
		$scope.maxDateOut = formService.maxDateOut;
		
		$scope.fullDates = function () {
			$scope.hideAvailibilityMsg = true;
			if ($scope.booking.room) {
				if (!formService.isPeriodAvailable($scope.rooms[$scope.booking.room], $scope.booking.dateIn, $scope.booking.dateOut)){
					$scope.hideAvailibilityMsg = false;
					$scope.roomName = $scope.rooms[$scope.booking.room].name;
				}
			}
		};

		$scope.onChangeDateStart = function () {
			//update dateOut if needed
			$scope.booking.dateOut = formService.updateDateEnd($scope.booking.dateIn, $scope.booking.dateOut);
			//update the limits of dateOut
			$scope.minDateOut = formService.minDateOut;
			$scope.maxDateOut = formService.maxDateOut;
			//update error message
			$scope.fullDates();	
		};

		$scope.onChangeRoom = function () {
			$scope.fullDates();
		};

		// functions to send the form
		$scope.newBooking = function () {
			$scope.booking = 
				{
					room:'',
					name:'', 
					email:'',
					guestsNumber:2,
					dateIn: $scope.minDate,
					dateOut: $scope.minDateOut, 
					notes:'', 
					dateReservation:'',
					status:0,
					channel:0,
					telephone:''
				};
		};
		
		$scope.newBooking();
		//ligne à revoir
		$scope.fullDates();

		$scope.book = function () {
                
            $scope.booking.dateReservation = new Date().toISOString();
            
            resourcesService.getBookings().save($scope.booking);

            $scope.bookings = resourcesService.getBookings().query();
            
            $scope.bookForm.$setPristine();                
            
            $scope.newBooking();
			
			$state.forceReload();

		};
	}])
;