/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

    "use strict";
    //var tool = EduVis.tool.template;

    var tool = {

        "name" : "Colorpicker_Example",
        "description" : "An example tool with a color picker.",
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
                    "name" : "toolstyle2",
                    "src" : "tools/colorpicker_example/colorpicker_example.css"
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

        },

        "controls" : {


            "temp" : {

                "type" : "textbox",
                "label" : "Testing the Text Box",
                "tooltip": "What is a tooltip?",
                "default_value" : "This is a test",
                "description" : "this control is for testing the text box of template.js"
            },
            //,

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
        "target_div" : "Colorpicker_Example",
        "tools" : {}

    };

    tool.Colorpicker_Example = function(  ){

      	//document.getElementById(_target_div).innerHTML = "TEMPLATE TOOL LOADED";

        $("#" + this.dom_target).append($("<div>TEST</div>"));

        EduVis.tool.load_complete(this);

    };

    tool.init = function() {

        // todo: include instance in call
        //console.log(" ... template init..... ", this)
        this.Colorpicker_Example();

    };

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

