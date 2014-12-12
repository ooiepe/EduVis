/*  *  *  *  *  *  *  *
*
* HELLO WORLD
*
*/

(function (eduVis) {

    // function hello_message_update(evt){

       

    // }


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

            "tool": {

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
                ]
            },

            "controls": {

               "scripts" : [
                    {
                        "name" : "d3",
                        "url" : "http://d3js.org/d3.v3.min.js",
                        "global_reference" : "d3"
                    },

                    {
                        "resource_type" : "tool",
                        "name": "leaflet_js",
                        "url" : "js/leaflet.js",
                        "namespace" : "L",
                        "attributes":{}
                    }

                ],

                "stylesheets" : [
                    {
                        "name": "leaflet-markercluster-css",
                        "src": "css/MarkerCluster.css"
                    },
                    {
                        "name": "leaflet-markercluster-default",
                        "src": "css/MarkerCluster.Default.css"
                    },
                ]
            },

            "datasets" : []
            
        },

        "configuration" : {
            // configuration id should match control id
            "hello_message" : "Hello, World!"

        },

        "data" : {},
        "target_div" : "Hello_World",
        "tools" : {}

    };

    tool.Hello_World = function( _target, identifier ){

        //this.control.hello_world = 
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


        EduVis.tool.load_complete(this);

    };


    tool.init_tool = function() {

        // run additional tool setup functions here

        // activate Hello World tool
        this.Hello_World(this.dom_target);

    };

    tool.init_controls = function(target_div){

        // do we create and return a full DOM element.. or draw to the provided div target?
        // hello_message
        
        var ctrl_hello_input,

            hello_message = $("<div/>")
            .append(

                //label 

                $("<label />")
                    .attr({
                        'for': 'hello_world_textbox'
                    })
                    .html("Hello Message")

            )
            .append(

                //hello_world_textbox
                
               ctrl_hello_input = $("<input />")
                    .attr({
                        'id': 'hello_world_textbox',
                        'type': 'textbox',
                        'value': tool.configuration.hello_message,
                        'title': 'Enter text for the Hello Word message.',
                        'maxlength': '100'
                    })
                    .addClass("span2")
                    // .on("change", function (a) {
                        
                        
                    // })
            )
            .append(
                
                $("<input>")
                    .attr({
                        'id': 'hello_world_btn',
                        'type': 'button',
                        'title': 'Apply Configuration',
                        'value': 'Apply'
                    })
                    .addClass("btn")
                    
                    .on("click", function (evt) {

                        var target = $(ctrl_hello_input),
                            val = target.val();

                        // update tool configuration value for hello_message
                        tool.configuration.hello_message = val;

                        // update visual
                        d3.select("#hello-world-tool-svg-text").text(val);


                    })
            )

        $(target_div).append(hello_message);

    };



    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

