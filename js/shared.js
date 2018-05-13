'use strict';
// Shared code needed by all pages of the app.

// Prefix to use for Local Storage.  You may change this.
var APP_PREFIX = "monash.eng1003.navigationApp";

var LatAndLng=[]

// Array of saved Path objects.
var availablePaths = [];

class Path {
  constructor(latlng, path, location) {
      this.title  = path.title;
      this.latlng = latlng || [];
      this.location = location;
  }

  Title() {
      return this.title;
  }

  location() {
    return this.location;
  }
   totalDistance() {
      //Calculate the distance to two locations
      const arr = this.latlng.map(item => {
        return new google.maps.LatLng(item[0], item[1]);
      });
      var length = google.maps.geometry.spherical.computeLength(arr);
      var lengthInMeters = length.toFixed(1);
      return lengthInMeters;
   }

   numberOfTurns() {
      //calculates the number of turns the user must take to reach destination
      var turn = this.latlng.length;
      return turn;
   }
}
var ResourceC = JSON.parse(localStorage.getItem('RouteC'));
var ResourceS = JSON.parse(localStorage.getItem('RouteS'));

function GetItemC(){
        //This for loop iterates through the routes
        for( var i=0; i<ResourceC.length; i++) {
                var Location = ResourceC[i].locations;
                var LocationArray = [];
                //This for loop iterates through each paths GPS coordinates
                for( var j=0; j< Location.length; j++) {
                      //creating new google lat long instances
                   var Lat= (ResourceC[i].locations[j].lat)
                   var Lng= (ResourceC[i].locations[j].lng)
                   var LatAndLngC=[]
                   LatAndLngC.push(Lat,Lng);
                   LatAndLng.push(LatAndLngC);
                   LocationArray.push(LatAndLngC);
                }
                //creating a new path class instance.
                console.log(LocationArray, ResourceC);
                var pathInstance = new Path(LocationArray, ResourceC[i], Location);
                availablePaths.push(pathInstance);
            }
    }


function GetItemS(){
        //This for loop iterates through the routes
            for( var i=0; i<ResourceS.length; i++)
                {
                    var Location = ResourceS[i].locations;

                    var LocationArray = [];

                    //This for loop iterates through each paths GPS coordinates
                    for( var j=0; j< Location.length; j++)
                        {
                            //creating new google lat long instances
                         var Lat= (ResourceC[i].locations[j].lat)
                         var Lng= (ResourceC[i].locations[j].lng)
                           var LatAndLngS=[]
                         LatAndLngS.push(Lat,Lng)
                         LatAndLng.push(LatAndLngS)


                            LocationArray.push(LatAndLngS);

                        }
                    //creating a new path class instance.
                    var pathInstance = new Path(LocationArray,ResourceS[i]);
                   availablePaths.push(pathInstance);
                }
    }
