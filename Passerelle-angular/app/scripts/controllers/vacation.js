'use strict';

angular.module('passerelle2App')
    .controller('VacationCtrl', [ '$scope', 'resourcesService', 'formService', '$log', '$state', function($scope, resourcesService, formService, $log, $state) { 
		$scope.$log = $log;
		$scope.noRoomSelected = false;
		$scope.selectedRooms = [];
		
		$scope.minDate = formService.minDate;
		//recalculate the limits of dateOut
		formService.updateDateOutLimits($scope.minDate);
		$scope.minDateOut = formService.minDateOut;
		$scope.maxDateOut = formService.maxDateOut;
		
		var j = 0;
		$scope.checkAvailability = function () {
			for (j = $scope.selectedRooms.length - 1; j >= 0; j--) {
				$scope.vacation.room = $scope.selectedRooms[j];
				$scope.checkavailabilityByRoom($scope.vacation);
				if (!$scope.hideAvailibilityMsg) {
					$scope.roomName = resourcesService.getRoomName($scope.rooms, $scope.vacation.room);
					break;
				}
			}
		};
		$scope.checkavailabilityByRoom = function (vacation) {
			$scope.hideAvailibilityMsg = true;
			if (vacation.room && vacation.dateStart) {
				var date = vacation.dateStart.toISOString().substring(0, 10);
				resourcesService.getRooms().get({id:vacation.room, date:date}).$promise.then( function(data) {
					$scope.hideAvailibilityMsg = formService.isPeriodAvailable(data, vacation.dateStart, vacation.dateEnd);
				});
			}
			$log.log ('hide : ' + $scope.hideAvailibilityMsg);
		};

		$scope.onChangeDateStart = function () {
			//update dateEnd if needed
			$scope.vacation.dateEnd = formService.updateDateEnd($scope.vacation.dateStart, $scope.vacation.dateEnd);
			//update the limits of dateOut
			formService.updateDateOutLimits($scope.vacation.dateStart);
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
		$scope.rooms.$promise.then( function(){
			$scope.initSelectedRooms();
			$scope.newVacation();
			$scope.checkAvailability();
		});
		
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