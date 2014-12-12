/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

  "use strict";

  var tool = {

      "name" : "Template",
      "description" : "A Tool Template.",
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

          //
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
              "name" : "Testing.css",
              "src" : "Testing.css"
            },
            // {
            //   "name" : "jquery-ui-css",
            //    "src" : "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
            // }
          ]
        },
        "controls":{

          "scripts" : [
            // {
            //     "name" : "jquery_ui_js", 
            //     "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
            // }
          ],

          "stylesheets" : [
            // {
            //     "name" : "jquery-ui-css",
            //     "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
            // },
            // {   "name": "jquery-smoothness",
            //     "src": "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
            // },
            // {
            //     "name": "leaflet-css",
            //     "src": "http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css"
            // }
          ]
        }
      },     

      "configuration" : {
        "property_name" : "value"
      },

      "target_div" : "Template"

  };

  tool.Template = function( _target ){

    // This is the main tool function. 
    // It must be named the same as the tool directory.

    
    // The EduVis load_complete function is a simple console.log 
    // notification indicating the tool has loaded.
    EduVis.tool.load_complete(this);

  };

  tool.init = function() {

    // The init function is required. This is how all tools are initialized.
    // Here you can perform pre tool functions, if necessary.

    this.Template(this.dom_target);

  };

  // extend base object with tool..
  EduVis.tool.tools[tool.name] = tool;

}(EduVis));

