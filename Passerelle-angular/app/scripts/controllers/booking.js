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
			if (!$scope.isUpdate) {
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
			}
		};
		
		$scope.newBooking();
		if ($scope.booking) {$scope.fullDates();}
		//$log.info('message ' + $scope.isUpdate);

		$scope.book = function () {
        
            // new booking
            if (!$scope.isUpdate) {
            	$scope.booking.dateReservation = new Date().toISOString();
            	resourcesService.getBookings().save($scope.booking, 
            		// recuperer le resultat de save (success ou error)
            		function() {
		                $scope.message = 'La réservation a bien été ajoutée'; 
		                // succes on efface les donnees du formulaire
	            		$scope.newBooking();
		            },
		            function(response) {
		                $scope.message = 'Echec de l\'ajout de la réservation';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		            }
            	); 
	            $scope.bookings = resourcesService.getBookings().query();
	            // TO-DO : trouver un moyen  propre pour mettre à jour le calendrier et la liste
	            $state.go('app.bookings.formvalidation');
	        }
	        // update booking
	        else {
	        	var id = $scope.booking.id;
	        	resourcesService.getBookings().update({ bookingId: id }, $scope.booking, 
            		function() {
		                $scope.message = 'La réservation a bien été modifiée'; 
		            },
		            function(response) {
		                $scope.message = 'Echec de la modification de la réservation';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		            }
		        );
		        $state.go('app.updatebooking.formvalidation');
	        }

		};
	}])
;