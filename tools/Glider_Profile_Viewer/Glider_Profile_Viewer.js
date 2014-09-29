/*  
  Glider Profile Viewer

  Ocean Observatories Initiative
  Education & Public Engagement Implementing Organization

  Name: EV3 Glider Profile Viewer
  Description: 
  Version: 0.0.1
  Revision Date: 9/29/2014
  Author: Michael Mills
  Author URL: http://marine.rutgers.edu/~mmills/
  Function Name: Glider_Profile_Viewer

*/

(function (eduVis) {

  "use strict";

  var tool = {

    "name" : "Glider_Profile_Viewer",
    "description" : "Glider Profile Viewer",
    "url" : "",

    "version" : "0.0.1",
    "authors" : [
        {
            "name" : "Michael Mills",
            "association" : "Rutgers University",
            "url" : "http://marine.rutgers.edu/~mmills"
        }
    ],
      
    "resources" : {

      "tool":{
        
        "scripts" : [
          {
            "name" : "d3",
            "url" : "http://d3js.org/d3.v3.js",
            "global_reference" : "d3",
            "attributes" : {
                "charset" : "utf-8"
            }
          },
          {
            "name" : "jquery_ui_js", 
            "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
          }
        ],
        "stylesheets" : [
         {

           "name" : "jquery-ui-css",
            "src" : "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
          }
        ]
      },

      "controls" : {

         "scripts" : [
          {
            "resource_type" : "tool",
            "name": "Control_Data_Browser",
            "url" : "js/Control_Glider_Dataset_Browser.js",
            "attributes":{}
          }
        ],

        "stylesheets" : [
          // {
          //     "name": "data-browser-css",
          //     "src": "css/Glider_Data_Browser.css"
          // }
        ]
      }
    }

  };

  tool.Glider_Profile_Viewer = function( _target ){
    
    console.log("Glider Profile Viewer TOOL INITIALIZED");

    EduVis.tool.load_complete(this);

  };

  tool.init_tool = function() {

    // todo: include instance in call
    //console.log(" ... Testing init..... ", this)
    this.Glider_Profile_Viewer(this.dom_target);

    EduVis.tool.load_complete(this);

  };

  tool.init_controls = function() {

    tool.controls = {};
    tool.controls.Glider_Dataset_Browser_Control = EduVis.controls.Glider_Dataset_Browser_Control;
    tool.controls.Glider_Dataset_Browser_Control.init(tool);

    console.log("controls initialized");
  };

  // extend base object with tool..
  EduVis.tool.tools[tool.name] = tool;

}(EduVis));
