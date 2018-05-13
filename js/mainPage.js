'use strict';
// Code for the Main page of the app.

// The following is sample code to demonstrate navigation.
// You need not use it for final app.
// web service of campus clayton
var APP_PREFIX = "monash.eng1003.navigationApp";

function viewPath(pathIndex)
{
    // Save the selected path index to local storage so it can be accessed
    // from the Navigate page.
    console.log(availablePaths[pathIndex]);
    localStorage.setItem(APP_PREFIX + "-selectedPath", JSON.stringify(availablePaths[pathIndex]));

    localStorage.setItem(APP_PREFIX + "-selectedPathTitle", availablePaths[pathIndex].title);
    // ... and then load the Navigate page.
    location.href = 'navigate.html';
}


var MyArrayC=[];
function routesResponseC(routesC){
   var storagekeyC='RouteC';
   localStorage.setItem(storagekeyC, JSON.stringify(routesC));
 }

var url = "https://eng1003.monash/api/campusnav/?campus=clayton&callback=this.routesResponseC";
var script = document.createElement('script');
script.src = url;
document.body.appendChild(script);



var MyArrayS=[];
function routesResponseS(routesS){
  var storagekeyS='RouteS';
  localStorage.setItem(storagekeyS,JSON.stringify(routesS));
}



var url = "https://eng1003.monash/api/campusnav/?campus=sunway&callback=this.routesResponseS";
var script = document.createElement('script');
script.src = url;
document.body.appendChild(script);


 //Calling the loadPath function to get information
GetItemC();
GetItemS();
//list view section heading: Path lists
var listHTML = "";
console.log(availablePaths);
//This for loop will loop through each object and create a list on the HTML page displaying the title
for ( var i=0; i<availablePaths.length; i++){
    // HTML format of list item: Paths
  listHTML += " <li class='mdl-list__item mdl-list__item--two-line' onclick='viewPath("+ i +");'><span class='mdl-list__item-primary-content'><span>" + availablePaths[i].title + "</span><span class='mdl-list__item-sub-title'>" + "Distance: " + availablePaths[i].totalDistance() + " Meters" + "</br>" + "Turns: " + availablePaths[i].numberOfTurns() + "</span></span></li>";;



    //+ "Distance: " + availablePaths[i].totalDistance() + " Meters" + "</span></span></li>"
}

var pathLists = document.getElementById("pathsList");
pathLists.innerHTML = listHTML;
