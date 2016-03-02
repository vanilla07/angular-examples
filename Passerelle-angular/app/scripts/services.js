'use strict';

angular.module('passerelle2App')
    .constant('baseURL','http://209.122.232.103')
    .service('bookingsService',[ '$resource', 'baseURL', function( $resource, baseURL) {

        this.getBookings = function(){
          return $resource(baseURL+':8090/bookings/:id',null,  {'update':{method:'PUT' }});
        };

        this.getVacation = function(){
          return $resource(baseURL+':8090/vacation/:id',null,  {'update':{method:'PUT' }});
        };

        this.getDatesByRoom = function(roomId){
          return $resource(baseURL+':8090/calendar/'+roomId,null,  {'update':{method:'PUT' }});
        };
      
    }])
;
