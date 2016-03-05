'use strict';

angular.module('passerelle2App')
    .controller('VacationCtrl', [ '$scope', 'bookingsService', '$log', '$state', function($scope, bookingsService, $log, $state) { 
		$scope.$log = $log;
		$scope.hideAvailibilityMsg = false;
		$scope.now = new Date();
		$scope.minDate = new Date(
			$scope.now.getFullYear(),
			$scope.now.getMonth(),
			$scope.now.getDate()
		);
		$scope.minDateOut = new Date(
			$scope.minDate.getFullYear(),
			$scope.minDate.getMonth(),
			$scope.minDate.getDate()+1
		);
		$scope.maxDateOut = new Date(
			$scope.minDateOut.getFullYear(),
			$scope.minDateOut.getMonth()+1,
			$scope.minDateOut.getDate()
		);
		
		$scope.fullDates = function () {
			$scope.hideAvailibilityMsg = true;
			for (var j = $scope.rooms.length - 1; j >= 0; j--) {
				if (!isPeriodAvailable($scope.rooms[j].id, $scope.vacation.dateStart, $scope.vacation.dateEnd)){
					$scope.hideAvailibilityMsg = false;
					$scope.roomName = $scope.rooms[j].name;
					break;
				}
			}
		};

		//sera inutile une fois le service à jour
		for (var i = 0; i < $scope.rooms.length; i++) {
			var room = $scope.rooms[i];
			room.bookings = bookingsService.getBookings().query();
			room.vacations = bookingsService.getVacation().query();
		}

		var isPeriodAvailable = function(roomId, dateIn, dateOut) {
			var result = true;
			var roomDatas = $scope.rooms[roomId];
            for (var i = roomDatas.bookings.length - 1; i >= 0; i--) {
				if (roomId === roomDatas.bookings[i].room) {
					if (!$scope.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.bookings[i].dateIn), new Date(roomDatas.bookings[i].dateOut))) {
						result = false;
						break;
					}
				}
			}
			for (i = roomDatas.vacations.length - 1; i >= 0; i--) {
				if (roomId === roomDatas.vacations[i].room) {
					if (!$scope.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.vacations[i].dateStart), new Date(roomDatas.vacations[i].dateEnd))) {
						result = false;
						break;
					}
				}
			}
			return result;
		};

		$scope.changeDateEnd = function () {
			if($scope.vacation.dateStart >= $scope.vacation.dateEnd) {
				$scope.minDateOut = new Date(
					$scope.vacation.dateStart.getFullYear(),
					$scope.vacation.dateStart.getMonth(),
					$scope.vacation.dateStart.getDate()+1
				);
				$scope.maxDateOut = new Date(
					$scope.minDateOut.getFullYear(),
					$scope.minDateOut.getMonth()+1,
					$scope.minDateOut.getDate()
				);
				$scope.vacation.dateEnd = $scope.minDateOut;
			}
			$scope.fullDates();	
		};
		$scope.newVacation = function () {
			$scope.vacation = 
				{
					room:'',
					name:'', 
					dateStart: $scope.minDate,
					dateEnd: $scope.minDateOut, 
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