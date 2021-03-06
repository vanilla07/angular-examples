'use strict';

angular.module('passerelle2App')
  .controller('ModalCtrl', [ '$scope', '$state', '$log', '$confirm', 'resourcesService', '$mdDialog', function($scope, $state, $log, $confirm, resourcesService, $mdDialog) { 

  	var updateBookingState = 'app.updatebooking.form';
  	var updateVacationState = 'app.updatevacation.form';

	$scope.goToUpdateBooking = function(id) {
		$('.modal-backdrop').remove(); 
		$('body').removeClass('modal-open');
		$state.go(updateBookingState, { bookingId: id });
	};
	$scope.goToUpdateVacation = function(id) {
		$('.modal-backdrop').remove(); 
		$('body').removeClass('modal-open');
		$state.go(updateVacationState, { vacationId: id });
	};

    $scope.deleteBooking = function(bookingId) {
      $confirm({text: 'Attention : Etes-vous sûr de vouloir supprimer cette réservation?'})
        .then(function() {
			resourcesService.getBookings().delete( { bookingId: bookingId },
				// recuperer le resultat de save (success ou error)
				function() {
				    $scope.message = 'La réservation a bien été supprimée'; 
				    $scope.showDialog();
				},
				function(response) {
				    $scope.message = 'Echec de la suppression de la réservation';
				    $scope.showDialog();
				    $log.warn ('Error: '+response.status + ' ' + response.statusText);
				}
			); 
        });
    };

    $scope.deleteVacation = function(vacationId) {
      $confirm({text: 'Attention : Etes-vous sûr de vouloir annuler cette fermeture?'})
        .then(function() {
			resourcesService.getVacation().delete( { vacationId: vacationId },
				// recuperer le resultat de save (success ou error)
				function() {
				    $scope.message = 'L\'élément a bien été supprimé'; 
				    $scope.showDialog();
				},
				function(response) {
				    $scope.message = 'Echec de la suppression';
				    $scope.showDialog();
				    $log.warn ('Error: '+response.status + ' ' + response.statusText);
				}
			); 
        });
    };

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

}])
.run(function($confirmModalDefaults) {
  $confirmModalDefaults.defaultLabels.title = 'Suppresion de l\'élément';
  $confirmModalDefaults.defaultLabels.ok = 'OK';
  $confirmModalDefaults.defaultLabels.cancel = 'Annuler';
});