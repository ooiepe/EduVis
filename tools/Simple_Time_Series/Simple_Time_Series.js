/* Simple Time Series Tool
 * Revised 10/17/2013
 */
(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Simple_Time_Series",
        "description" : "The Hello World of EV.",
        "url" : "??__url_to_tool_help_file__?",
        "version" : "0.1",
        "authors" : [
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
                    "url" : "http://d3js.org/d3.v3.js",
                    "global_reference" : "d3",
                    "attributes" : {
                        "charset" : "utf-8"
                    }
                }


            ],
            "stylesheets" : [
                 {
                     "name" : "Simple_Time_Series_css",
                     "src" : "Simple_Time_Series.css"
                 }
            ],
            "datasets" : []            
        },

        "configuration" : {
          "station" : "44025",
          "start_date" : "7",
          "end_date" : "now"
        },

        "controls" : {
            "station" : {
                "type" : "textbox",
                "label" : "Station",
                "tooltip": "Enter a NDBC Station ID.",
                "default_value" : "44025",
                "description" : "Enter a NDBC Station ID.",
                "update_event" : graph_update_sta
            },
            "start_date" : {
                "type" : "textbox",
                "label" : "Start Date",
                "tooltip": "Enter date in the format yyyy/mm/dd or a number of days you want prior to the end date.",
                "default_value" : "7",
                "description" : "Enter the starting date.",
                "update_event" : graph_update_sd
            },
            "end_date" : {
                "type" : "textbox",
                "label" : "End Date",
                "tooltip": "Enter date in the format yyyy/mm/dd or the word 'now'.",
                "default_value" : "now",
                "description" : "Enter the ending date.",
                "update_event" : graph_update_ed
            }
        },
        "data" : {},
        "target_div" : "Hello_World",
        "tools" : {},
        "graph" : {}
    };

    tool.setup = function( _target ){
      var g = this.graph;

      g.margin = {top: 26, right: 25, bottom: 20, left: 60},
      g.width = 840 - g.margin.left - g.margin.right,
      g.height = 400 - g.margin.top - g.margin.bottom;
      
      g.parseDate = d3.time.format.iso.parse;
      
      g.x = d3.time.scale().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);
      
      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);
      
      g.svg = d3.select("#"+_target).append("svg")
        	.attr("id","svggraph")
          .attr("width", g.width + g.margin.left + g.margin.right)
          .attr("height", g.height + g.margin.top + g.margin.bottom);
      
      g.svg.append("defs").append("clipPath")
          .attr("id", "clip")
        .append("rect")
          .attr("width", g.width)
          .attr("height", g.height);
      
      g.focus = g.svg.append("g")
          .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");
      
      g.line1 = d3.svg.line()
          .interpolate("monotone")
          .x(function(d) { return g.x(d.date); })
          .y(function(d) { return g.y(d.data); });
      
      g.svg.append("text")
          .attr("class", "gtitle")
          .attr("text-anchor", "middle")
          .attr("font-size", "18")
          .attr("y", 0)
          .attr("dy", ".75em")
          .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
          .text("NDBC Station " + this.configuration.station);
      
      g.svg.append("text")
          .attr("id", "ylabel")
          .attr("class", "glabel")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("y", 0)
          .attr("dy", "1em")
          .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
          .text("Discharge (cfs)");
    };

    tool.draw = function() {
      var g = this.graph;
      g.url = 'http://epedev.oceanobservatories.org/timeseries/data.php?network=NDBC&station=' + this.configuration.station + '&parameter=air_temperature&start_time='+this.configuration.start_date+'&end_time='+this.configuration.end_date;
      
      d3.csv(g.url, function(error, data) {
        tool.drawgraph(data);
      });

    };
    
    tool.drawgraph = function(data) {
      var g = this.graph;

      var cols = d3.entries(data[0]);
      data.forEach(function(d) {
        d.date = g.parseDate(d.date);
        d.data = +d[cols[1].key];
      }); 

      g.x.domain(d3.extent(data, (function(d) { return d.date; })));
      g.y.domain(d3.extent(data, (function(d) { return d.data; })));
      
      g.focus.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + g.height + ")")
          .call(g.xAxis);
    
      g.focus.append("g")
          .attr("class", "y axis")
          .call(g.yAxis);
          
      g.focus.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", g.line1)
          .attr("fill","none")
          .attr("stroke","#a33333")
          .attr("stroke-width","2px");
      
      d3.select('#ylabel').text(cols[1].key);
    };    
    
    tool.init = function() {
        this.setup(this.dom_target);
        this.draw();
        EduVis.tool.load_complete(this);
    };

    function graph_update_sta(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.station = val;
        tool.graph_update();
    }
    function graph_update_sd(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.start_date = val;
        tool.graph_update();
    }
    function graph_update_ed(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.end_date = val;
        tool.graph_update();
    }
    
    tool.graph_update = function() {
      var g = this.graph;
      g.url = 'http://epedev.oceanobservatories.org/timeseries/data.php?network=NDBC&station=' + this.configuration.station + '&parameter=air_temperature&start_time='+this.configuration.start_date+'&end_time='+this.configuration.end_date;
      
      d3.csv(g.url, function(error, data) {
        tool.updategraph(data);
      });

    };
    
    tool.updategraph = function(data) {
      var g = this.graph;

      var cols = d3.entries(data[0]);
      data.forEach(function(d) {
        d.date = g.parseDate(d.date);
        d.data = +d[cols[1].key];
      }); 

      g.x.domain(d3.extent(data, (function(d) { return d.date; })));
      g.y.domain(d3.extent(data, (function(d) { return d.data; })));
      
      g.svg.selectAll("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", g.line1);
      
      d3.select('#ylabel').text(cols[1].key);
    };  

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

