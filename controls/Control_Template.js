// Control Template?

/*

 * OOI EPE - Template for Tool Control
 *
 * Revised 7/2/2014
 * Written by Mike Mills
 
*/

(function (eduVis) {

  "use strict";

  var control = {

    "name":"Name_Of_Control",
    "version" : "0.1",
    "description" : "This controls ...",
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