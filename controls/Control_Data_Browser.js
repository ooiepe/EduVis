/*

 * OOI EPE - Data Browser Control
 * for use with Time Series Tools - STS, STSM, DTS
 *
 * Revised 6/24/2014
 * Written by Mike Mills
 
*/

(function (eduVis) {

  "use strict";

  var control = {

    "name":"Data_Browser_Control",
    "version" : "0.1",
    "description" : "This controls allows the user to select Time Series Datasets using EPE Web Services",
    "authors" : [
      {
        "name" : "Michael Mills",
        "association" : "Rutgers University",
        "url" : "http://rucool.marine.rutgers.edu"
      }
    ]
  
  };

  control.init = function(){

  };

  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }

  EduVis.controls[control.name] = control;


}(EduVis));