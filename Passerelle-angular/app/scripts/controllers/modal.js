'use strict';

angular.module('passerelle2App')
  .controller('ModalCtrl', [ '$scope', '$state', '$log', '$confirm', 'resourcesService', '$mdDialog', function($scope, $state, $log, $confirm, resourcesService, $mdDialog) { 

	$scope.goToUpdate = function(id) {
		$('.modal-backdrop').remove(); 
		$('body').removeClass('modal-open');
		$state.go('app.updatebooking.form', { bookingId: id });
	};
	// TEST
    $scope.delete = function(bookingId) {
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
  $confirmModalDefaults.defaultLabels.title = 'Suppresion de la réservation';
  $confirmModalDefaults.defaultLabels.ok = 'OK';
  $confirmModalDefaults.defaultLabels.cancel = 'Annuler';
});