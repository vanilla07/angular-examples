'use strict';

angular.module('passerelle2App')
    .constant('baseURL','http://209.122.232.103')
    .service('resourcesService',[ '$resource', 'baseURL', function( $resource, baseURL) {

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
    .service('formService', function() {
      
        var now = new Date();
        this.minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        this.minDateOut = this.minDate;
        this.maxDateOut = this.minDate;

        this.updateDateOutLimits = function (dateIn) {
            this.minDateOut = new Date( dateIn.getFullYear(), dateIn.getMonth(), dateIn.getDate()+1 );   
            this.maxDateOut = new Date( this.minDateOut.getFullYear(), this.minDateOut.getMonth()+1, this.minDateOut.getDate() ); 
        };

        this.updateDateEnd = function(dateStart, dateEnd){
            this.updateDateOutLimits(dateStart);
            if(dateStart >= dateEnd) {
                dateEnd = this.minDateOut;
            }
            if(dateEnd > this.maxDateOut) {
                dateEnd = this.maxDateOut;
            }
            return dateEnd;
        };

        this.isRoomAvailable = function(dateInA, dateOutA, dateInB, dateOutB) {
            return ( (dateInA > dateInB && dateInA >= dateOutB) || (dateInB > dateInA && dateInB >= dateOutA) );
        };

        this.isPeriodAvailable = function(roomDatas, dateIn, dateOut) {
            var result = true;
            for (var i = roomDatas.bookings.length - 1; i >= 0; i--) {
                if (roomDatas.id === roomDatas.bookings[i].room) {
                    if (!this.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.bookings[i].dateIn), new Date(roomDatas.bookings[i].dateOut))) {
                        result = false;
                        break;
                    }
                }
            }
            for (i = roomDatas.vacations.length - 1; i >= 0; i--) {
                if (roomDatas.id === roomDatas.vacations[i].room) {
                    if (!this.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.vacations[i].dateStart), new Date(roomDatas.vacations[i].dateEnd))) {
                        result = false;
                        break;
                    }
                } 
            }
            return result;
        };

    })
;
