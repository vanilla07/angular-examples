'use strict';

/**
 * @ngdoc overview
 * @name passerelleAngularApp
 * @description
 * # passerelleAngularApp
 *
 * Main module of the application.
 */

angular
  .module('passerelle2App', [
    'ui.router',
    'ngResource',
    'ngMessages',
    'ngAria',
    'ngAnimate',
    'ui.bootstrap',
    'ngMaterial',
    'angularMoment',
    'angular-confirm'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        
      // route for the home page
      .state('app', {
          url:'/',
          views: {
              'header': {
                  templateUrl : 'views/header.html',
                  controller  : 'HeaderCtrl'
              },
              'content': {
                  templateUrl : 'views/main.html',
                  controller  : 'MainCtrl'
              },
              'footer': {
                  templateUrl : 'views/footer.html',
              }
          }

      })
      /// route for the reservation page
      .state('app.bookings', {
          abstract: true,
          url:'bookings',
          views: {
              'content@': {
                  templateUrl : 'views/add-booking.html',
                  controller  : 'CalCtrl'                  
              }
          },
          templateUrl: 'views/booking-form.html'
      })
      /// route for the reservation page
      .state('app.bookings.add', {
          url:'/add',
          templateUrl: 'views/booking-form.html'
      })
      // route for the update booking page
      .state('app.updatebooking', {
          abstract: true,
          url:'booking/:bookingId',
          views: {
              'content@': {
                  templateUrl : 'views/add-booking.html',
                  controller  : 'UpdateBookingCtrl'                  
              }
          }
      })
      /// route for the reservation page
      .state('app.updatebooking.form', {
          url: '/update',
          templateUrl: 'views/booking-form.html'
      })
      /// route for the vacation page
      .state('app.vacation', {
          url:'vacation',
          views: {
              'content@': {
                  templateUrl : 'views/add-vacation.html',
                  controller  : 'CalCtrl'                  
              }
          }
      })
      ;
    
    $urlRouterProvider.otherwise('/');

    
  }])
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .config(function($mdDateLocaleProvider) {
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN); 
    };
  })
  .run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded',function(){
      $('html, body').animate({ scrollTop: 0 }, 200);
    });
  })
;
