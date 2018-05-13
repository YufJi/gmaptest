'use strict';
// Code for the Navigate page.

// The following is sample code to demonstrate navigation between pages of the
// app.  You need can replace this in your final app.
var APP_PREFIX = "monash.eng1003.navigationApp";
const detailTitle = localStorage.getItem(APP_PREFIX + "-selectedPathTitle");
document.getElementById("headerBarTitle").textContent = detailTitle;


// if (pathIndex !== null){
//     // If a path index was specified, show name in header bar title. This
//     // is just to demonstrate navigation.  You should set the page header bar
//     // title to an appropriate description of the path being navigated
//
//     var pathNames = [ "Path A", "Path B" ];
//     document.getElementById("headerBarTitle").textContent = pathNames[pathIndex];
// }
