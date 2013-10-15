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

        "name" : "Hello_World",
        "description" : "The Hello World of EV.",
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
                // {
                //     "name" : "toolstyle",
                //     "src" : "tools/Hello_World/Hello_World.css"
                // }
            ],

            "stylesheets_external" : [],

            "datasets" : []
            
        },

        "configuration" : {
        	"hello_message" : "Hello, World!"
        },

        "controls" : {

            "hello_message" : {

                "type" : "textbox",
                "label" : "Hello Message",
                "tooltip": "Enter your hello world message?",
                "default_value" : "Hello, World!",
                "description" : "Modfiy your hello world message."
            }
        },
        "data" : {},
        "target_div" : "Hello_World",
        "tools" : {}

    };

    tool.Hello_World = function( _target ){

      	//document.getElementById(_target_div).innerHTML = "TEMPLATE TOOL LOADED";

        $("#"+_target).append(
        
            $("<div/>").html(tool.configuration.hello_message)
        );

        EduVis.tool.load_complete(this);

    };

    tool.init = function() {

        this.Hello_World(this.dom_target);

    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

