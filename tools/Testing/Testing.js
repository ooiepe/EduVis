/*  *  *  *  *  *  *  *
*
* TOOL Testing
*
*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Testing",
        "description" : "A Tool Testing.",
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
                 "name" : "Testing.css",
                 "src" : "Testing.css"
             },
             {

               "name" : "jquery-ui-css",
                "src" : "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
              }
            ]
          },
          "controls":{

            "scripts" : [
                // {
                //     "resource_type" : "tool",
                //     "name": "leaflet_js",
                //     "url" : "js/leaflet.js",
                //     "namespace" : "L",
                //     "attributes":{}
                // },
                // {
                //     "resource_type" : "tool",
                //     "name": "leaflet_markercluster",
                //     "url" : "js/leaflet.markercluster.js",
                //     "namespace" : "L",
                //     "dependsOn" : ["leaflet_js"],
                //     "attributes":{}
                // },  
                // {
                //     "name" : "jquery_ui_js", 
                //     "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
                // }
            ],

            "stylesheets" : [
                // {
                //     "name": "data-browser-css",
                //     "src": "css/Data_Browser.css"
                // },
                // {
                //     "name": "leaflet-markercluster-css",
                //     "src": "css/MarkerCluster.css"
                // },
                // {
                //     "name": "leaflet-markercluster-default",
                //     "src": "css/MarkerCluster.Default.css"
                // },
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

        
        "data" : {},
        "target_div" : "Testing",
        "tools" : {}

    };

    tool.Testing = function( _target ){

      	//document.getElementById(_target_div).innerHTML = "Testing TOOL LOADED";

      	//alert("testing.js.....")

        var w = 52,
            h = 26,
            legdata = [[1,3],[2,3],[3,1],[4,5],[5,5]],
          legx = d3.scale.linear().range([0, w]).domain([0,8]),
          legy = d3.scale.linear().range([h, 0]).domain([0,6]),
          legendLine = d3.svg.line()
            .x(function(d) { console.log(d[0]); return legx(d[0]); })
            .y(function(d) { console.log(d[1]); return legy(d[1]); });

     // --> <path stroke="red" stroke-width="3" fill="none" d="M6.5,13L13,13L19.5,21.6L26,4.3L32.5,4.3"></path>


        var svg = d3.select("#"+_target).append("svg")
            .attr("id",_target+"_svggraph")
            .attr("width", 400)
            .attr("height", 400);

        svg.append("path")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("fill", "none")

            .attr("d", legendLine(legdata));

            EduVis.tool.load_complete(this);

        };

    tool.init_tool = function() {

        // todo: include instance in call
        //console.log(" ... Testing init..... ", this)
        this.Testing(this.dom_target);

    };

    tool.init_controls = function() {

        console.log("controls initialized");
    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

