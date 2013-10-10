/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

    "use strict";
    //var tool = EduVis.tool.template;

    //console.log("tool template", tool);

    var tool = {

        "name" : "Time_Series",
        "description" : "A Time Series Chart using the new web services.",
        "url" : "??__url_to_tool_help_file__?",

        "version" : "0.0.1",
        "authors" : [
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            },
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~sage"
            }
        ],
        
        "resources" : {

            "scripts_local" : [],

            "scripts_external" : [
            	{
                    "name" : "d3",
                    "url" : "http://d3js.org/d3.v3.min.js",
                    "global_reference" : "d3",
                    "attributes" : {
                        "charset" : "utf-8"
                    }
                }

            ],

            "stylesheets_local" : [
                {
                    "name" : "toolstyle",
                    "src" : "tools/Time_Series/Time_Series.css"
                }
            ],

            "stylesheets_external" : [
                {
                    "name" : "jquery-ui",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                }
            ],

            "datasets" : [] // in case we being to support additional local resource files
            
        },

        "configuration" : {
        	"alertMessage" : "this is an Alert Message.",
            "data" : "Seven, 7\nEight, 8\nNine, 9"
        },

        "controls" : {

            "data": {},
            "temp" : {

                "type" : "textbox",
                "label" : "Testing the Text Box",
                "tooltip": "What is a tooltip?",
                "default_value" : "This is a test",
                "description" : "this control is for testing the text box of template.js"
            }
            //,

            // "color" : {
            //     "type" : "colorpicker",
            //     "label" : "Bar Color",
            //     "tooltip" : "Select a hexidecimal color for your graph.",
            //     "default_value" : "#4682B4",
            //     "validation" : {
            //         "type" : "hexcolor"
            //     }
            // }
        },
        "data" : {},
        "target_div" : "Template",
        "tools" : {}

    };

    tool.Time_Series = function( _target ){

      	alert(tool.configuration.alertMessage);

        EduVis.tool.load_complete(this);

    };

    tool.init = function() {

        //console.log(" ... template init..... ", this)
        this.Time_Series(this.dom_target);

    };

    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

