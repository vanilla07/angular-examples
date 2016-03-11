'use strict';

angular.module('passerelle2App')
  .controller('ModalCtrl', [ '$scope', '$state', '$log', function($scope, $state) { 

	$scope.goToUpdate = function(id) {
		$('.modal-backdrop').remove(); 
		$('body').removeClass('modal-open');
		$state.go('app.updatebooking.form', { bookingId: id });
	};

}]);