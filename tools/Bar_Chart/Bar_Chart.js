// Bar Chart Tool for Testing
// Adapted from http://bost.ocks.org/mike/d3/workshop/bar-chart.html
// By Sage 3/9/12, adapted by Mike

(function (eduVis) {

    "use strict";
    //var tool = EduVis.tool.template;

    //console.log("tool template", tool);

    var tool = {

        "name" : "Bar_Chart",
        "description" : "A simple bar chart tool.",
        "url" : "??__url_to_tool_help_file__?",

        "version" : "0.0.1",
        "authors" : [
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : ""
            },

            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            }
        ],
        
        "resources" : {

            "scripts_local" : [

                // {
                //     "name" : "leaflet",
                //     //"version" : "latest"
                //     "resource_path" : "resources/js/",
                //     "resource_file_name" : "leaflet.js",
                //     "global_reference" : "L"
                // }

            ],

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
                    "src" : "tools/Bar_Chart/Bar_Chart.css"
                }
            ],

            "stylesheets_external" : [
                {
                    "name" : "jquery-ui",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                }
            ],

            "datasets" : [] // in case we begin to support additional local resource files
            
        },

        "configuration" : {
            "data" : "One, 1\nTwo, 2\nThree, 3\nFour, 4\nFive, 5",
            "color" : "steelblue"
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
        "data" : {
            "bardata" : [],
            "barlabels" : []
        },
        "target_div" : "Bar_Chart_1",
        "tools" : {}

    };

    tool.Bar_Chart = function( _target_div ){

        // reference data here
        var bardata = this.data.bardata,
        barlabels = this.data.barlabels,
        target_div = "#" + _target_div || tool.target_div;

        $.each(tool.configuration.data.split("\n"), function (key,value) {
            var parts = value.split(",");
            bardata[key] = +parts[1];
            barlabels[key] = parts[0];
        });

        var margin = {top: 40, right: 40, bottom: 40, left: 40},
            width = 640 - margin.left - margin.right,
            height = 480 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .domain(d3.range(bardata.length))
            .rangeRoundBands([0, width], 0.2);

        var y = d3.scale.linear()
          .domain([0, d3.max(bardata)])
          .range([height,0]);
        
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(0)
            .tickPadding(8);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickPadding(8);

        var svg = d3.select( "#" + this.dom_target).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "bar chart")
          .append("g")
            .attr("transform", "translate(" + margin.right + "," + margin.top + ")");
        
        svg.selectAll(".bar")
            .data(bardata)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, i) { return x(i); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d); })
            .attr("height", function(d) { return height - y(d); })
            .attr("style","fill:" + tool.configuration.color);
              
        svg.append("g")
            .attr("class", "y axis")
            //.attr("transform", "translate(0,0)")
            .call(yAxis);
        
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
          .selectAll("text")
            .text(function(d) { return barlabels[d]; });

        
        EduVis.tool.load_complete(this);

        return ;

    },

    tool.init = function() {

        // todo: include instance in call
     
        this.Bar_Chart(this.dom_target);

    };

    // extend base object with tool.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
