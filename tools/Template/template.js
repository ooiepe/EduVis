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

        "name" : "Template",
        "description" : "A Tool Template.",
        "url" : "??__url_to_tool_help_file__?",

        "version" : "0.0.1",
        "authors" : [
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            }
        ],
        
        "resources" : {

            "scripts_local" : [],

            "scripts_external" : [
            	{
                    "name" : "d3",
                    "url" : "http://d3js.org/d3.v3.min.js",
                    "global_reference" : "d3"
                }

            ],

            "stylesheets_local" : [
                {
                    "name" : "toolstyle",
                    "src" : "tools/Template/Template.css"
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
        	"alertMessage":"this is an Alert Message."
        },

        "controls" : {

            "data": {
                "type" : "textarea",
                "label" : "Data Array",
                "tooltip" : "Enter data in the following format:<br><br><em>label, value<br>label, value</em><br><br>Enter each pair of data on its own line.",
                "default_value" : "One, 1\nTwo, 2\nThree, 3\nFour, 4\nFive, 5"
            },

            "color" : {
                "type" : "colorpicker",
                "label" : "Bar Color",
                "tooltip" : "Select a hexidecimal color for your graph.",
                "default_value" : "#4682B4",
                "validation" : {
                    "type" : "hexcolor"
                }
            }
        },
        "data" : {},
        "target_div" : "Template_1",
        "tools" : {}

    };

    tool.Template = function( _target_div ){

        // reference data here
        var target_div = "#" + _target_div || tool.target_div;

      	$("#" + _target_div).html("TEMPLATE TOOL LOADED");

      	alert(tool.configuration.alertMessage);

        return ;

    },

    tool.init = function() {

        // todo: include instance in call
        
        this.Template(this.target_div);

    };

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

