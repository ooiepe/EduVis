/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

    function hello_message_update(evt){

        var target = evt.target,
            val = target.value;

        // update tool configuration value for hello_message
        tool.configuration.hello_message = val;

        console.log("tool", tool);
        console.log("evt",evt);
        console.log("this",this);

        // update visual
        d3.select("#hello-world-tool-svg-text").text(val);

    }


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

           "scripts" : [
                {
                    "name" : "d3",
                    "url" : "http://d3js.org/d3.v3.min.js",
                    "global_reference" : "d3"
                }
            ],

            "stylesheets" : [
               {
                    "name" : "toolstyle",
                    "src" : "Hello_World.css"
                }
            ],

            "datasets" : []
            
        },

        "configuration" : {
            // configuration id should match control id
            "hello_message" : "Hello, World!"

        },

        "controls" : {

            "hello_message" : {

                "type" : "textbox",
                "label" : "Hello Message",
                "tooltip": "Enter your hello world message?",
                "default_value" : "Hello, World!",
                "description" : "Modify your hello world message.",
                "update_event" : hello_message_update
            }
        },
        "data" : {},
        "target_div" : "Hello_World",
        "tools" : {}

    };

    tool.Hello_World = function( _target ){

        d3.select("#"+_target)
            .append("svg")
                .attr(
                    {
                        "height":100,
                        "width":850
                    }
                )
                .append("text")
                    .attr(
                        {
                            "id":"hello-world-tool-svg-text",
                            "x": 10,
                            "y": 50,
                            "fill": "blue",
                            "font-size":40
                        }
                    )
                    .text(tool.configuration.hello_message);

        // $("#"+_target).append(
   
        //     $("<h2/>",{
        //         id : "hello-world-tool-text",
        //         html: tool.configuration.hello_message
        //     })
                
        // );

        //alert("instance loaded from folder non relative path.");

        EduVis.tool.load_complete(this);

    };

    tool.init = function() {

        this.Hello_World(this.dom_target);

    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

