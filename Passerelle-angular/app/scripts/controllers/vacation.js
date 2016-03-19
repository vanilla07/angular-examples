'use strict';

angular.module('passerelle2App')
    .controller('VacationCtrl', [ '$scope', 'resourcesService', 'formService', '$log', '$state', '$mdDialog', 
    	function($scope, resourcesService, formService, $log, $state, $mdDialog) { 
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
					if ($scope.isUpdate) {
						data = formService.removeBookingFromDates(data, $scope.oldDateIn, $scope.oldDateOut);
					}
					$scope.hideAvailibilityMsg = formService.isPeriodAvailable(data, vacation.dateStart, vacation.dateEnd);
				});
			}
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
		});

		if ($scope.isUpdate) {
			$scope.vacation.$promise.then(function(data){
				$scope.oldDateIn = data.dateIn;
				$scope.oldDateOut = data.dateOut;
				$scope.checkavailabilityByRoom(data);
			});
		}
		else {
			$scope.newVacation();
			$scope.checkAvailability();
		}

		// TODO: essayer de factoriser
	    $scope.showDialog = function(){
	    	$mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.body))
		        .clickOutsideToClose(true)
		        .title('Confirmation')
		        .textContent($scope.message)
		        .ariaLabel('Alert Message')
		        .ok('OK')
		        .targetEvent($state.reload())
		    );
	    };
		
	    $scope.addVacationByRoom = function (vacation, roomName) {
	    	var message = '';
	    	resourcesService.getVacation().save(vacation,
        		// get result of save action (success ou error)
        		function() {
	                message = 'La fermeture a bien été prise en compte pour la chambre ' + roomName + '\n'; 
	                // succes : we clean the form datas
            		$scope.newVacation();
	            },
	            function() {
	                message = 'Echec de la fermeture pour la chambre ' + roomName + '\n';
	            }
            );
            return message;
	    };

	    // TODO : à utiliser plus tard
	    $scope.updateVacationByRoom = function (vacation, roomName) {
	    	var message = '';
	    	resourcesService.getVacation().save(vacation,
        		// get result of save action (success ou error)
        		function() {
	                message = 'La fermeture a bien été prise en compte pour la chambre ' + roomName + '\n'; 
	                // succes : we clean the form datas
            		$scope.newVacation();
	            },
	            function() {
	                message = 'Echec de la fermeture pour la chambre ' + roomName + '\n';
	            }
            );
            return message;
	    };

		$scope.addVacation = function () {
            var i = 0;
             // new booking
            if (!$scope.isUpdate) {
            	$scope.message = '';
	            // save vacations based on which rooms were selected
	            for (i = 0; i < $scope.selectedRooms.length; i++) {
	            	$scope.vacation.room = $scope.selectedRooms[i];
	            	var roomName = resourcesService.getRoomName($scope.rooms, $scope.vacation.room);
	            	// save and update message for each room
	            	$scope.message += $scope.addVacationByRoom($scope.vacation, roomName);
	            }  
	            // display confirmation message in dialog
		        $scope.showDialog();              
			}
			else {
				var id = $scope.vacation.id;
				resourcesService.getVacation().update({ vacationId: id }, $scope.vacation, 
            		function() {
		                $scope.message = 'La fermeture a bien été modifiée'; 
		                $scope.showDialog();
		            },
		            function(response) {
		                $scope.message = 'Echec de la modification de la fermeture';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		                $scope.showDialog();
		            }
		        );
			}

		};
	}])
;