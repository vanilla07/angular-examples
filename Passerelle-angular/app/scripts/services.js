'use strict';

angular.module('passerelle2App')
    .constant('baseURL','http://209.122.232.103')
    .service('resourcesService',[ '$resource', 'baseURL', function( $resource, baseURL) {

        this.getBookings = function(){
          return $resource(baseURL+':8090/bookings/:bookingId', {bookingId:'@id'},  {'update':{method:'PUT' }});
        };

        this.getVacation = function(){
          return $resource(baseURL+':8090/vacation/:id',null,  {'update':{method:'PUT' }});
        };

        this.getDatesByRoom = function(roomId){
          return $resource(baseURL+':8090/calendar/'+roomId,null,  {'update':{method:'PUT' }});
        };

        // get Rooms : resourcesService.getRooms().query({date:date});
        // get one room: resourcesService.getRooms().query({id:id, date:date});
        this.getRooms = function(){
            return $resource(baseURL+':8090/rooms/:id',null);
        };

        this.getChannels = function(){
            return [
                    {
                      id: 0,
                      text: 'lapasserelledescorton.fr',
                      url: 'http://www.lapasserelledescorton.fr/'
                    },
                    {
                      id: 1,
                      text: 'booking.com',
                      url: 'http://www.booking.com/index.fr.html'
                    },
                    {
                      id: 2,
                      text: 'airbnb.com',
                      url: 'https://www.airbnb.fr/'
                    }
                 ];
        };

        this.getStatuses = function() {
            return [
                    {value: 0, text: 'En attente de paiement'},
                    {value: 1, text: 'Accompte payé'},
                    {value: 2, text: 'Réservation annulée'},
                    {value: 3, text: 'Archivé'}
                   ];
        };

        this.getRoomName = function(rooms, id) {
          for (var i = 0; i < rooms.length; i++) {
            if (id === rooms[i].id) {
              return rooms[i].name;
            }
          }
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
              if (!this.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.bookings[i].dateIn), new Date(roomDatas.bookings[i].dateOut))) {
                  result = false;
                  break;
              }
            }
            for (i = roomDatas.vacations.length - 1; i >= 0; i--) {
              if (!this.isRoomAvailable(dateIn, dateOut, new Date(roomDatas.vacations[i].dateIn), new Date(roomDatas.vacations[i].dateOut))) {
                  result = false;
                  break;
              }
            }
            return result;
        };

    })
;
