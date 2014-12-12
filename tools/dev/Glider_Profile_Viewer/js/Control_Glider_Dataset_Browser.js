/*
OOI EPE - Glider Dataset Browser Control
for use with Glider Profile Explorer
 
Revised 9/29/2014
Written by Michael Mills, Rutgers University
 
*/

(function (eduVis) {

  "use strict";

  var tool,
    control = {

    "name" : "Glider_Dataset_Browser_Control",
    "version" : "0.0.1",
    "description" : "This controls allows the user to select Glider Datasets via Rutgers Marine Science ERDDAP server.",
    "authors" : [
      {
        "name" : "Michael Mills",
        "association" : "Rutgers University",
        "url" : "http://rucool.marine.rutgers.edu"
      }
    ]
  };

  control.init = function(parent_tool){

    tool = parent_tool;
    console.log("Glider Dataset Browser Control Initialized")

  };

  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }

  EduVis.controls[control.name] = control;

}(EduVis));