'use strict';

angular.module('passerelle2App')
    .controller('BookCtrl', [ '$scope', 'bookingsService', '$log', '$state', function($scope, bookingsService, $log, $state) { 
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
	}])
;