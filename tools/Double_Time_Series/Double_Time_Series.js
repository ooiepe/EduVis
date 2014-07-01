/**
 * OOI EPE - Double Time Series (STS)
 * Revised 7/1/2014
 * Written by Michael Mills and Sage Lichtenwalner
*/

(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Double_Time_Series",
        "version" : "0.3.3",
        "description" : "This tool allows you to create an interactive time series graph of selected stations and variables. You can also customize the date range that is displayed.",
        "authors" : [
          {
            "name" : "Michael Mills",
            "association" : "Rutgers University",
            "url" : "http://rucool.marine.rutgers.edu"
          },
          {
            "name" : "Sage Lichtenwalner",
            "association" : "Rutgers University",
            "url" : "http://rucool.marine.rutgers.edu"
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
                 "name" : "Double_Time_Series_css",
                 "src" : "Double_Time_Series.css"
             },
             {

               "name" : "jquery-ui-css",
                "src" : "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
              }
            ]
          },
          "controls":{

            "scripts" : [
                {
                    "resource_type" : "tool",
                    "name": "leaflet_js",
                    "url" : "js/leaflet.js",
                    "namespace" : "L",
                    "attributes":{}
                },
                {
                    "resource_type" : "tool",
                    "name": "leaflet_markercluster",
                    "url" : "js/leaflet.markercluster.js",
                    "namespace" : "L",
                    "dependsOn" : ["leaflet_js"],
                    "attributes":{}
                },  
                {
                    "name" : "jquery_ui_js", 
                    "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
                },
                {
                    "resource_type" : "tool",
                    "name": "Control_Data_Browser",
                    "url" : "js/Control_Data_Browser.js",
                    "attributes":{}
                }
            ],

            "stylesheets" : [
                {
                    "name": "data-browser-css",
                    "src": "css/Data_Browser.css"
                },
                {
                    "name": "leaflet-markercluster-css",
                    "src": "css/MarkerCluster.css"
                },
                {
                    "name": "leaflet-markercluster-default",
                    "src": "css/MarkerCluster.Default.css"
                },
                {
                    "name" : "jquery-ui-css",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                },
                {   "name": "jquery-smoothness",
                    "src": "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
                },
                {
                    "name": "leaflet-css",
                    "src": "http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css"
                }
            ],


          },
          "datasets" : []            
        },

        // default chart properties
        "configuration" : {
          // updated by visualization
          "station1" : "44033",
          "network1" : "NDBC",
          "parameter1" : "water_temperature",
          "station2" : "44033",
          "network2" : "NDBC",
          "parameter2" : "air_temperature",
          
          // update by browser
          "realtime_days" : "2",
          "start_date": "2013-01-01",
          "end_date": "2013-12-31",
          "date_type" : "archived",
          "data_cart" : {
            "NDBC": { 
              "44033": { 
                "parameters": {
                  "water_temperature":{},
                  "air_temperature":{}
                },
                "custom_name":"NDBC 44033"
              },
              "44025": { 
                "parameters": {
                  "water_temperature":{},
                  "air_temperature":{}
                },
                "custom_name":"NDBC 44025"
              }
            }
          },

          //not updated
          "line_color1":"#a33333",
          "line_color2":"#6699CC"
        },

        "data" : {},
        // "target_div" : "Hello_World",
        "tools" : {},
        "graph" : {}
    };

    
    
    /**
     * Initial setup of visualization tool
     * Called by init_tool
     */
    tool.setup = function( _target ){
      var g = this.graph,
      bisectDate = d3.bisector(function(d) { return d.date; }).left;

      g.margin = {top: 40, right: 60, bottom: 40, left: 60};
      g.width = 840 - g.margin.left - g.margin.right;
      g.height = 400 - g.margin.top - g.margin.bottom;
      
      g.parseDate = d3.time.format.iso.parse;
      g.formatDate = d3.time.format("%Y-%m-%d");
      
      g.x = d3.time.scale.utc().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);

      g.x1 = d3.time.scale.utc().range([0, g.width]);
      g.x2 = d3.time.scale.utc().range([0, g.width]);

      g.y1 = d3.scale.linear().range([g.height, 0]);
      g.y2 = d3.scale.linear().range([g.height, 0]);
      
      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis1 = d3.svg.axis().scale(g.y1).orient("left");//.tickSize(0,0,0);
      g.yAxis2 = d3.svg.axis().scale(g.y2).orient("right");//.tickSize(0,0,0);
      
      g.svg = d3.select("#"+_target).append("svg")
        .attr("id",_target+"_svggraph")
        .attr("width", g.width + g.margin.left + g.margin.right)
        .attr("height", g.height + g.margin.top + g.margin.bottom)
        .style("font-size","11px")
        .style("font-family","Tahoma, Geneva, sans-serif");
      
      g.svg.append("defs").append("clipPath")
          .attr("id", _target+"_clip")
        .append("rect")
          .attr("width", g.width)
          .attr("height", g.height);
      
      g.focus = g.svg.append("g")
          .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");

      g.focus.append("g")
        .attr("id", _target+"_xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .call(g.xAxis);
        
      g.focus.append("g")
        .attr("id", _target+"_yAxis1")
        .attr("class", "y axis var1")
        .call(g.yAxis1);
      
      g.focus.append("g")
        .attr("id", _target+"_yAxis2")
        .attr("class", "y axis var2")
        .attr("transform","translate(" +g.width +",0)")
        .call(g.yAxis2);

      g.linePath1 = g.focus.append("path")
        .attr("class", "line1")
        .attr("d", g.line1)
        .style("fill","none")
        .style("stroke",tool.configuration.line_color1)
        .style("stroke-width","2px");

      g.linePath2 = g.focus.append("path")
        .attr("class", "line2")
        .attr("d", g.line2)
        .style("fill","none")
        .style("stroke",tool.configuration.line_color2)
        .style("stroke-width","2px");

      g.line1 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x1(d.date); })
        .y(function(d) { return g.y1(d.data); });

      g.line2 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x2(d.date); })
        .y(function(d) { return g.y2(d.data); });

      g.mouse_focus1 = g.focus.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus1.append("circle")
        .attr("r", 4.5);

      g.mouse_focus1.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      g.mouse_focus2 = g.focus.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus2.append("circle")
        .attr("r", 4.5);

      g.mouse_focus2.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      g.mousemover = g.focus.append("rect")
        .attr("class", "overlay")
        .attr("width", g.width)
        .attr("height", g.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { 
          g.mouse_focus1.style("display", null);
          g.mouse_focus2.style("display", null);
        })
        .on("mouseout", function() { 
          g.mouse_focus1.style("display", "none");
          g.mouse_focus2.style("display", "none");
        });
      

      // g.title = g.svg.append("text")
      //   .attr("class", "gtitle")
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "18px")
      //   .attr("y", 0)
      //   .attr("dy", ".75em")
      //   .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
      //   .text( 
      //     this.configuration.network1 + " Station " + this.configuration.station1 + " AND "+
      //     this.configuration.network2 + " Station " + this.configuration.station2
      //   );

      g.title1 = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width/4+g.margin.left) + "," + (0) + ") ")
        .text( 
          this.configuration.network1 + " - " + this.configuration.station1 + " - " + this.configuration.parameter1
        );

      g.stats1 = g.svg.append("text")
        .attr("id", _target+"_stats1")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/4+g.margin.left) + "," + (34) + ") ")
        .text( "Statistics");

      g.legend1 = g.svg.append("path")
        .attr({
          "stroke": tool.configuration.line_color1,
          "stroke-width":"3",
          "fill":"none",
          "d":"M6.5,13L13,13L19.5,21.6L26,4.3L32.5,4.3"
        })
        .attr("transform", "translate(" + (g.margin.left) + "," + (0) + ") ");

      g.title2 = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width/2+g.margin.left*4) + "," + (0) + ") ")
        .text( 
          this.configuration.network2 + " - " + this.configuration.station2 + " - " + this.configuration.parameter2
        );

      g.stats2 = g.svg.append("text")
        .attr("id", _target+"_stats2")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left*4) + "," + (34) + ") ")
        .text( "Statistics");

      g.legend2 = g.svg.append("path")
        .attr({
          "stroke": tool.configuration.line_color2,
          "stroke-width":"3",
          "fill":"none",
          "d":"M6.5,13L13,13L19.5,21.6L26,4.3L32.5,4.3"
        })
        .attr("transform", "translate(" + (g.width + g.margin.right/3) + "," + (0) + ") ");
      
      g.ylabel1 = g.svg.append("text")
        .attr("id", _target+"_ylabel1")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text( this.configuration.parameter1);

      g.ylabel2 = g.svg.append("text")
        .attr("id", _target+"_ylabel2")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (g.width + g.margin.left + g.margin.right) + "," + (g.height/2+g.margin.top) + "), rotate(90)")
        .text( this.configuration.parameter2);

      g.xlabel = g.svg.append("text")
        .attr("id", _target+"_xlabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( "Date Range");

      // g.stats = g.svg.append("text")
      //   .attr("id", _target+"_stats")
      //   .attr("class", "glabel")
      //   .attr("text-anchor", "end")
      //   .style("font-size", "11px")
      //   .attr("dy", "-6px")
      //   .attr("transform", "translate(" + (g.width/4+g.margin.left) + "," + (22) + ") ")
      //   .text( "Statistics");

      
      tool.select_createDropdowns(_target);
      
      tool.select_updateStations("1");
      tool.select_updateStations("2");
      
      tool.select_updateParameters("1");
      tool.select_updateParameters("2");

    };

    /**
     * Draw first dataset following initial tool setup 
     * Called by init_tool
     */
    tool.draw = function(variable) {
      var url = tool.createUrl(variable);
      
      $('<img style="height:28px;" class="loading-icon' +variable + '"  src="' + EduVis.Environment.getPathTool(tool.name) + '/img/loading_small.gif" />')
        .appendTo($("#"+tool.dom_target+"_tool-status"+variable));

      d3.csv(url, function(error, data) {

        $(".loading-icon"+variable).remove();

        if(typeof data !== "undefined"){
          tool.updategraph(data,variable);  
        }
        else{
          if(typeof error !== "undefined"){

            $("#"+tool.dom_target+"_tool-status"+variable).html(
              $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not currently available for this Station.</i>')
            );
          }
        }
      });
    };

    /**
     * Update graph and config when station pulldown is changed 
     */
    tool.graph_update_sta = function(network_station,variable){
        var net_sta = network_station.split(","),
            network = net_sta[0],
            station = net_sta[1];

        tool.configuration["network"+variable] = network;
        tool.configuration["station"+variable] = station;

        // are we sure we want to updated the graph here?
        tool.draw(variable);
    };

    /**
     * Update graph and config when parameter pulldown is changed 
     */
    tool.graph_update_param = function(parameter,variable){

        //tool.configuration.station = "";

        tool.configuration["parameter"+variable] = parameter;
        tool.draw(variable);
    };

    // /**
    //  * Update graph and config when start date is changed 
    //  * Not currently used?
    //  */
    // function graph_update_sd(evt,variable){
    //     var target = evt.target,
    //         val = target.value;
    //     tool.configuration.start_date = val;
    //     tool.draw(variable);
    // }
    // /**
    //  * Update graph and config when end date is changed 
    //  * Not currently used?
    //  */
    // function graph_update_ed(evt,variable){
    //     var target = evt.target,
    //         val = target.value;
    //     tool.configuration.end_date = val;
    //     tool.draw(variable);
    // }

    /**
     * Create the URL to request timeseries data
     * Called by draw and graph_update
     */    
    tool.createUrl = function(variable){

      var config = this.configuration,
          network = config["network"+variable],
          station = config["station"+variable],
          parameter = config["parameter"+variable],
          start,
          end;

      if(config.date_type == "realtime"){
        start = config.realtime_days;
        end = "now";  
      }
      else{
        start = config.start_date;
        end = config.end_date;
      }

      return 'http://epedata.oceanobservatories.org/timeseries?' + 
        'network=' + network + 
        '&station=' + station + 
        '&parameter=' + parameter + 
        '&start_time=' + start +
        '&end_time=' + end;
    };
    
    /**
     * Update visualization with new data
     * Called by draw and graph_update
     */    
    tool.updategraph = function(data, variable) {

      console.log("variable: ", variable);

      if(typeof data === "undefined"){

        // insert an icon to let user know to select param

        $("#"+tool.dom_target+"_tool-status"+variable).html(
          $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
        );

      }
      else{

        if(data.length === 0){

            // insert an icon to let user know to select param
          $("#"+tool.dom_target+"_tool-status"+variable).html(
            $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
          );

        }
        else{

          // todo: parse out date for chart domain..

          var g = this.graph,
              cols = d3.entries(data[0]),
              bisectDate = d3.bisector(function(d) { return d.date; }).left,
              line = g["line" + variable],
              linePath = g["linePath" + variable],
              x = g["x" + variable],
              y = g["y" + variable];

          data.forEach(function(d) {
            d.date = g.parseDate(d[cols[0].key]);
            d.data = +d[cols[1].key];
          }); 

          g["ts_data" + variable] = data;

          // Update X domains to use date range from the tool when in archive mode, otherwise use the range of the returned data.
          if(this.configuration.date_type == "realtime"){
            g.x.domain(d3.extent(data, (function(d) { return d.date; })));
            x.domain(d3.extent(data, (function(d) { return d.date; })));
          } else {
            g.x.domain([g.parseDate(this.configuration.start_date),g.parseDate(this.configuration.end_date)]).nice();
            x.domain([g.parseDate(this.configuration.start_date),g.parseDate(this.configuration.end_date)]).nice();
          }
          // Update the Y domains to use the range of the returned data.
          g.y.domain(d3.extent(data, (function(d) { return d.data; }))).nice();
          y.domain(d3.extent(data, (function(d) { return d.data; }))).nice();

          linePath
            .data([data])
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("d", line);
          
          g["title"+variable].text( this.configuration["network" + variable] + " " + this.configuration["station" + variable] + " " + this.configuration["parameter" + variable]);

          g["ylabel"+variable].text(cols[1].key);
          var datelimits = g.x.domain();
          g.xlabel.text(d3.time.format.utc("%B %e, %Y")(datelimits[0]) + " to " + d3.time.format.utc("%B %e, %Y")(datelimits[1]));
          var stats = tool.average(data);
          
          g["stats"+variable].text("Mean: " + d3.round(stats.mean,2) + " / StDev: " + d3.round(stats.deviation,2) );
          
          // update x and y axis 
          d3.select("#"+tool.dom_target+"_yAxis"+variable).call(g["yAxis"+variable]);

          // update correct axis
          d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);
          
          d3.selectAll('.axis line, .axis path')
            .style("fill","none")
            .style("stroke","#999")
            .style("stroke-width","1px");

            //.style("shape-rendering","crispEdges")
          d3.selectAll('.y.axis line var'+variable)
            .style("stroke-opacity",".4");

          //update the mouseover values
          g.mousemover.on("mousemove", function(){

            var mouseX = d3.mouse(this)[0],
                data1 = tool.graph["ts_data1"],
                data2 = tool.graph["ts_data2"],
                x1 = g.x1.invert(mouseX),
                x2 = g.x2.invert(mouseX),

                i1 = bisectDate(data1, x1,1),
                i2 = bisectDate(data2, x2,1),

                d10 = data1[i1 - 1] || 0,
                d11 = data1[i1] || 0,
                d1 = x1 - d10.date > d11.date - x1 ? d11 : d10,

                d20 = data2[i2 - 1] || 0,
                d21 = data2[i2] || 0,
                d2 = x2 - d20.date > d21.date - x2 ? d21 : d20,

                xMax = g.x(g.x.domain()[1]),
                xPosition = g.x(x1)>(xMax/2) ? -110:0;

            if(typeof d1 !== undefined){
              g.mouse_focus1
                .attr("transform", "translate(" + g.x1(d1.date) + "," + g.y1(d1.data) + ")");
              g.mouse_focus1.select("text")
                .text(g.formatDate(d1.date) + " - " + d3.round(d1.data,4))
                .attr("transform", "translate(" + xPosition + "," + 0 + ")");
            }
            
            if(typeof d2 !== undefined){
              g.mouse_focus2
                .attr("transform", "translate(" + g.x2(d2.date) + "," + g.y2(d2.data) + ")");
              g.mouse_focus2.select("text")
                .text(g.formatDate(d2.date) + " - " + d3.round(d2.data,4))
                .attr("transform", "translate(" + xPosition + "," + 0 + ")");
            }

          });

        }
      }
      
      // remove loading image
      $(".loading-icon"+variable).remove();

    };
    
    /**
     * Calculates general statistics on data
     * Called by updategraph
     * This should be replaced by d3.deviation and other related functions when (if?) implemented.
     */
    tool.average = function(data) {
      var a = [];
      data.forEach(function(d) {
        a.push(d.data);
      });
      var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
      for(var m, s = 0, l = t; l--; s += a[l]);
      for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
      return r.deviation = Math.sqrt(r.variance = s / t), r;
    };

    /**
     * Generate station and parameter pulldowns
     * Called by setup
     */
    tool.select_createDropdowns = function(_target){
     
      console.log(tool.controls);
      tool.controls;

      //tool.controls.Data_Browser_Control.dropdown1 = {};
      //tool.controls.Data_Browser_Control.dropdown2 = {};

      var tc = EduVis.controls.Data_Browser_Control, 
          dd1 = tc.dropdown1,
          dd2 = tc.dropdown2,
          dd_width = (tool.graph.width/2);// - tool.graph.margin.left - tool.graph.margin.right

      dd1 = $("<div/>", {
          "id": _target+"_tool-dropdown-1"
        })
        .css({
          "width" : dd_width +"px",
          "float" : "left",
          "padding-left" : tool.graph.margin.left + "px",
          "text-align":"center"
          
        })
        .append(
          $("<div />")
          .append(
            $("<span/>")
              .html("Station 1:&nbsp;")
          )
          .append(
            $("<select></select>")
            .attr({
              "id" : _target+"_select-stations-1",
            })
            .css({
                "margin":"6px 10px 6px 0"
            })
            .on("change", function(evt){

              // update network and station in config
              if(tool.select_updateParameters("1")){
                tool.graph_update_sta(evt.target.value,"1");
              }
              else{
                // set option shere

                $("#"+_target+"_tool-status1")
                  .html(
                    $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Please choose a new parameter.</i>')
                  );
              }
            })
          )
        )
        .append(
          $("<div/>")
            .append(
              $("<span/>")
                .html("Parameter 1:&nbsp;")
            )
            .append(
              $("<select></select>")
              .attr({
                "id" : _target + "_select-parameters-1"
              })
              .css({
                  "margin":"6px 10px 6px 0"
              })
              .on("change", function(evt){

                $(".param-icon").remove();
                
                tool.graph_update_param(evt.target.value,"1");

              })
            )
            .append(
              $("<span/>",{
                  "id" : _target+"_tool-status1"
              })
            )
          );
      

      dd2 = $("<div/>",{
          "id": _target+"_tool-dropdown-2"
        })
        .css({
          "width" : dd_width +"px",
          "float" : "right",
          "padding-right" : tool.graph.margin.right + "px",
          "text-align":"center"
        })
        .append(
          $("<div />")
          
          .append(
            $("<span/>")
              .html("Station 2:&nbsp;")
          )
          .append(
            $("<select></select>")
            .attr({
              "id" : _target+"_select-stations-2"
            })
            .css({
                "margin":"6px 10px 6px 0"
            })
            .on("change", function(evt){

              // update network and station in config
              if(tool.select_updateParameters("2")){
                tool.graph_update_sta(evt.target.value,"2");
              }
              else{
                // set option shere

                $("#"+_target+"_tool-status2")
                  .html(
                    $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Please choose a new parameter.</i>')
                  );
              }
            })
          )
        )
        .append(
          $("<div/>")
            .append(
              $("<span/>")
                .html("Parameter 2:&nbsp;")
            )
            .append(
              $("<select></select>")
              .attr({
                "id" : _target + "_select-parameters-2"
              })
              .css({
                  "margin":"6px 0 6px 0"
              })
              .on("change", function(evt){

                $(".param-icon").remove();
                
                tool.graph_update_param(evt.target.value,"2");

              })
            )
            .append(
              $("<span/>",{
                  "id" : _target+"_tool-status2"
              })
            )
        );

      var tool_controls = $("<div/>")
        .css({
          //"text-align" : "center",
          //"height" : "50px"
        })
        .append(
          $("<div/>",{
              "id": _target+"_tool-dropdowns",
              // "css":{
              //   "vertical-align":"middle"
              // }

          })

          //dropdowns 1
          .append( dd1 )
          
          //dropdowns 2
          .append( dd2 )
        )
        .appendTo(
          $("#"+_target)
        );
    };

    /**
     * Update station pulldown to match config
     * Called by setup and init_controls
     */
    tool.select_updateStations = function(variable){

      var config = tool.configuration,
        options = [];

      // clear the current stations
      $("#"+tool.dom_target+"_select-stations-" + variable).empty();

      // build the stations
      $.each(config.data_cart, function(network, network_obj){

        $.each(network_obj,function(station, station_obj){

          // create new option and add it to the options array
          var option = $("<option/>")
            .attr({
              "value": network + "," + station
            })
            .html(
               station_obj.custom_name
            );

          options.push(option);

        });
      });

      // add all the options from the options array to the select

      // find network-station in dropdown.. if not exists.. choose one

      $("#"+tool.dom_target+"_select-stations-" + variable)
        .append(options);

      // check if value is in list
      // if not, change configuration to the first item in the list.

      if($("#"+tool.dom_target+"_select-stations-"+ variable +" option[value='" + config["network" + variable] + "," + config["station" + variable] + "']").val() === undefined){

        $("#"+tool.dom_target+"_select-stations-"+ variable + " option:first")
        .prop("selected", "selected");
          
        var net_sta = $("#"+tool.dom_target+"_select-stations-" + variable).val().split(",");
            
        config.network1 = net_sta[0];
        config.station1 = net_sta[1];

      }
      else{

        $("#"+tool.dom_target+"_select-stations-" + variable)
          .val(config["network" + variable] + "," + config["station" + variable]);

      }
    };

    /**
     * Update parameter pulldown to match config
     * Called by setup, init_controls (when apply is clicked) and select_createDropdowns
     */
    tool.select_updateParameters = function(variable){

      //console.log($("#"+tool.dom_target+"_select-stations").val());

      var net_sta = $("#"+tool.dom_target+"_select-stations-" + variable).val().split(","),
          network = net_sta[0],
          station = net_sta[1],
          config = tool.configuration,
          dc = config.data_cart,
          options = [],
          selected_param;
          // need to condition for param that is not available in a newly updated list (when station changes and the new station does not have the previously selected param.. in that case, just take the first parameter of the list.. and put an exclaimation next to the dropdown to indicated update ened)

        // reference to param
        // does current param exist in list?
      
      $(".param-icon").remove();

      $("#"+tool.dom_target+"_select-parameters-"+ variable)
      .empty()
      .append("<option>..updating..</option>");

      $.each(dc[network][station].parameters,function(parameter){

          // create new option and add it to the options array
          var option = $("<option></option>")
            .attr({
              "value": parameter
            })
            .html(parameter);

          options.push(option);

      });

      // clear loading indicator and append options
      $("#"+tool.dom_target+"_select-parameters-" + variable)
        .empty()
        .append(options);

      selected_param = $("#"+tool.dom_target+"_select-parameters-"+variable + " option")
        .filter(function(){

          //console.log("config param", config.parameter1);
          return ($(this).val() == config["parameter"+variable]);
        })
        .prop('selected', true);

      if(selected_param.length === 0){

        config.network1 = net_sta[0];
        config.station1 = net_sta[1];

        $("#"+tool.dom_target+"_tool-status"+variable)
          .html(
            $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Please choose a new parameter.</i>')
          );

        $("<option>(choose one)</option>")
          .prop("selected", true)
          .insertBefore($("#"+tool.dom_target+"_select-parameters-"+variable+" option:first"));

        return false;
      }

      return true;

    };

    /**
     * Initialize tool
     * Called automatically by EduVis
     */
    tool.init_tool = function(_target) {
      this.setup(this.dom_target);
      this.draw("1");
      this.draw("2");

      EduVis.tool.load_complete(this);
    };

    /**
     * Initial setup of tool configuration panel
     * Called automatically by EduVis when edit is enabled
     */
    tool.init_controls = function(){

      tool.controls = {};
      tool.controls.Data_Browser_Control = EduVis.controls.Data_Browser_Control;
      tool.controls.Data_Browser_Control.init(tool);
       
    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));