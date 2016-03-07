'use strict';

angular.module('passerelle2App')
    .controller('VacationCtrl', [ '$scope', 'resourcesService', 'formService', '$log', '$state', function($scope, resourcesService, formService, $log, $state) { 
		$scope.$log = $log;
		$scope.hideAvailibilityMsg = false;
		$scope.noRoomSelected = false;
		$scope.selectedRooms = [];
		
		$scope.minDate = formService.minDate;
		//recalculate the limits of dateOut
		formService.updateDateOutLimits($scope.minDate);
		$scope.minDateOut = formService.minDateOut;
		$scope.maxDateOut = formService.maxDateOut;
		
		var j = 0;
		$scope.checkAvailability = function () {
			$scope.hideAvailibilityMsg = true;
			for (j = $scope.selectedRooms.length - 1; j >= 0; j--) {
				var roomId = $scope.selectedRooms[j];
				if (!formService.isPeriodAvailable($scope.rooms[roomId], $scope.vacation.dateStart, $scope.vacation.dateEnd)){
					$scope.hideAvailibilityMsg = false;
					$scope.roomName = $scope.rooms[j].name;
					break;
				}
			}
		};

		$scope.onChangeDateStart = function () {
			//update dateEnd if needed
			$scope.vacation.dateEnd = formService.updateDateEnd($scope.vacation.dateStart, $scope.vacation.dateEnd);
			//update the limits of dateOut
			$scope.minDateOut = formService.minDateOut;
			$scope.maxDateOut = formService.maxDateOut;
			//update error message
			$scope.checkAvailability();	
		};
		
		$scope.initSelectedRooms = function () {
			$scope.selectedRooms = [];
			for (j = 0; j < $scope.rooms.length; j++) {
				$scope.selectedRooms.push($scope.rooms[j].id);
			}
		};

		$scope.toggleRoom = function(item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) { list.splice(idx, 1); }
			else { list.push(item); }
			// error message if no room selected
			$scope.noRoomSelected = list.length === 0;
			// update error message for availability
			$scope.checkAvailability(); 
		};
		$scope.existsRoom = function(item, list) {
			return list.indexOf(item) > -1;
		};

		//functions to send the form
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

		// initialize the variables
		$scope.initSelectedRooms();
		$scope.newVacation();
		$scope.checkAvailability();
		
		$scope.addVacation = function () {
            var i = 0;

            // save vacations based on which rooms were selected
            for (i = 0; i < $scope.selectedRooms.length; i++) {
            	$scope.vacation.room = $scope.selectedRooms[i];
            	resourcesService.getVacation().save($scope.vacation);
            }                

            // clean the form
            $scope.vacationForm.$setPristine();                
            
            // reinitialize the variables
            $scope.initSelectedRooms();
			$scope.newVacation();
			$scope.checkAvailability();
			
			//reload the page/calendar to show the new dates
			$state.forceReload();

		};
	}])
;