/*

 * OOI EPE - Single Time Series (STS)
 * Revised 10/9/2014
 * Written by Mike Mills and Sage Lichtenwalner

*/

(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Single_Time_Series",
        "version" : "0.3.4",
        "description" : "This tool allows you to create an interactive time series graph of selected stations and variables. You can also customize the date range that is displayed.",
        "authors" : [
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : "http://rucool.marine.rutgers.edu"
            },
            {
                "name" : "Michael Mills",
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
                "name" : "jquery_1.11",
                "url" : "https://code.jquery.com/jquery-1.11.1.min.js",
              },
              {
                "name" : "jquery_ui_js",
                "url" : "http://code.jquery.com/ui/1.11.0/jquery-ui.min.js",
                "dependsOn":["jquery_1.11"]
              }
            ],
            "stylesheets" : [
             {
                 "name" : "Single_Time_Series_css",
                 "src" : "Single_Time_Series.css"
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
                    //"resource_type" : "tool",
                    "name": "leaflet_js",
                    "url" : "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js",
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
                    "dependsOn" : ["leaflet_js"],
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
          "station" : "44033",
          "network" : "NDBC",
          "parameter" : "water_temperature",

          // update by browser
          "realtime_days" : "2",
          "start_date": "2013-01-01",
          "end_date": "2013-12-31",
          "date_type" : "archived",
          "data_cart" : [
            {
              "network" : "NDBC",
              "station" : "44033",
              "custom_name":"NDBC 44033",
              "parameters": {
                "water_temperature":{},
                "air_temperature":{}
              }
            },
            {
              "network" : "NDBC",
              "station" : "44025",
              "custom_name":"NDBC 44025",
              "parameters": {
                "water_temperature":{},
                "air_temperature":{}
              }
            }
          ],
          "datepicker_ui" : "off"
        },
        "settings":{},
        "data" : {},
        // "target_div" : "Hello_World",
        "tools" : {},
        "graph" : {},
        "param_units" : {}
      };

    //     "controls" : {
    //
    //       "layer_station_markers" : {},
    //       "timerSearchProgress" : {},
    //       "timerSearchQueue" : {},
    //       "stationMarkerOptions" : {
    //
    //         "NDBC" : {
    //             radius: 6,
    //             fillColor: "#ff0000",
    //             color: "#000",
    //             weight: 1,
    //             opacity: 1,
    //             fillOpacity: 0.8
    //         },
    //         "CO-OPS" : {
    //             radius: 6,
    //             fillColor: "#ffff00",
    //             color: "#000",
    //             weight: 1,
    //             opacity: 1,
    //             fillOpacity: 0.8
    //         }
    //       },
    //
    //       "styleStationHighlight" : {
    //           weight: 5,
    //           color: '#666',
    //           dashArray: '',
    //           fillOpacity: 0.6
    //       },
    //
    //       "styleStationClicked" : {
    //           weight: 8,
    //           color: '#ff0000',
    //           dashArray: '',
    //           fillOpacity: 0.7
    //       },
    //
    //       "styleStationReset" : {
    //           radius: 6,
    //           color: "#000",
    //           weight: 1,
    //           opacity: 1,
    //           fillOpacity: 0.8
    //       },
    //
    //       "ui-datepicker-toggle" : {
    //
    //       }
    //     }
    // };

    /**
     * Initial setup of visualization tool
     * Called by init_tool
     */
    tool.setup = function( _target ){
      var g = this.graph;

      g.margin = {top: 26, right: 25, bottom: 40, left: 60};
      g.width = 840 - g.margin.left - g.margin.right;
      g.height = 400 - g.margin.top - g.margin.bottom;

      g.parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%SZ").parse;
      g.parseDateConfig = d3.time.format.utc("%Y-%m-%d").parse;

      g.formatDate = d3.time.format("%Y-%m-%d");

      g.x = d3.time.scale.utc().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);

      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);

      g.svg = d3.select("#"+_target).append("svg")
        .classed({"svg_export":true})
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
        .attr("id", _target+"_yAxis")
        .attr("class", "y axis")
        .call(g.yAxis);

      g.focus.append("path")
        //.datum(data)
        .attr("class", "line")
        .attr('clip-path', 'url(#'+ _target+"_clip" +')')
        .attr("d", g.line1)
        .style("fill","none")
        .style("stroke","#a33333")
        .style("stroke-width","2px");

      g.mouse_focus = g.focus.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus.append("circle")
        .attr("r", 4.5);

      g.mouse_focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

      g.mousemover = g.focus.append("rect")
        .attr("class", "overlay")
        .attr("width", g.width)
        .attr("height", g.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { g.mouse_focus.style("display", null); })
        .on("mouseout", function() { g.mouse_focus.style("display", "none"); })

      g.line1 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x(d.date); })
        .y(function(d) { return g.y(d.data); });

      g.title = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
        .text( this.configuration.network + " Station " + this.configuration.station);

      g.ylabel = g.svg.append("text")
        .attr("id", _target+"_ylabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text( this.configuration.parameter);

      g.xlabel = g.svg.append("text")
        .attr("id", _target+"_xlabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( "Date Range");

      g.stats = g.svg.append("text")
        .attr("id", _target+"_stats")
        .attr("class", "glabel")
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width+g.margin.left) + "," + (g.margin.top) + "), rotate(0)")
        .text( "Statistics");

      tool.ui_init(_target);

    //  tool.select_createDropdowns(_target);
    //  tool.select_updateStations();
    //  tool.select_updateParameters();

    };

    tool.ui_init = function(_target){

      // add tool control container
      tool.ui_controls = $("<div/>")
        .attr({
          "id": _target + "_ui_tool_controls"
        })
        .css({
          "text-align" : "center"
          //,
          //"height" : "50px"
        })
        .append(

          $("<div/>")
            .attr({
              "id" : _target+"_tool-status"
            })
        )

      // add controls container
      $("#"+_target).append(tool.ui_controls);

      // add dropdown controls
      tool.select_createDropdowns(_target);

      // update station and paremeters based on configuration
      tool.select_updateStations();
      tool.select_updateParameters();

      // add datepicker elements
      tool.configuration.datepicker_ui = "on";

      if(tool.configuration.datepicker_ui == "on"){

        var start_date = tool.configuration.start_date,
            end_date = tool.configuration.end_date;
        //save tool start and end dates
        tool.settings.date_start_default = start_date;
        tool.settings.date_end_default = end_date;

        tool.ui_datePicker(_target);
      }

    }



    tool.ui_datePicker = function(_target){


      $("#"+ _target + "_ui_tool_controls")
        .append(

          $("<div />")
            .attr({"id":"ui_tool_date_toggle"})
            .append(
              "Start Date: &nbsp;"
            )
            .append(

              $("<input />")
              .attr({
                "id": "tool-date-start",
                "name":"tool-date-start",
                "type": "text"
              })
              .addClass('datepicker input-small')
              .datepicker({
                "dateFormat": "yy-mm-dd",
                "changeMonth": true,
                "changeYear": true,
                "minDate":tool.configuration.start_date,
                "maxDate":tool.configuration.end_date,
                "onClose" : function(d,i){

                  //console.log(d,i);
                  tool.configuration.start_date = d;

                  tool.draw();

                  $("#tool-date-end").datepicker( "option", "minDate" , d);

                  //tool.graph_update_dates( d, tool.configuration.end_date);
                  //
                  //
                  // var g = tool.graph;
                  //
                  // g.x.domain([g.parseDateConfig(d),g.parseDateConfig(tool.configuration.end_date)])
                  //
                  // g.svg.selectAll("path.line")
                  //   .transition()
                  //   .duration(1000)
                  //   .ease("linear")
                  //   .attr("d", tool.graph.line1);
                  //
                  // console.log(" update graph with new start and end dates?");

                },
                "defaultDate": tool.configuration.start_date
              })
              .val(tool.configuration.start_date)
            )
            .append(
              "&nbsp;&nbsp;&nbsp;End Date: &nbsp;"
            )
            .append(

              $("<input />")
              .attr({
                "id": "tool-date-end",
                "name":"tool-date-end",
                "type": "text"
              })
              .addClass('datepicker input-small')
              .datepicker({
                "dateFormat": "yy-mm-dd",
                "changeMonth": true,
                "changeYear": true,
                "minDate":tool.configuration.start_date,
                "maxDate":tool.configuration.end_date,
                "onClose" : function(d,i){

                  //console.log(d,i);

                  tool.configuration.end_date = d;
                  tool.draw();

                  $("#tool-date-start").datepicker( "option", "maxDate" , d);

                  //tool.graph_update_dates( tool.configuration.start_date,d);
                  // var g = tool.graph;
                  //
                  // g.x.domain([g.parseDateConfig(tool.configuration.start_date),g.parseDateConfig(d)])
                  //
                  // g.svg.selectAll("path.line")
                  //   .transition()
                  //   .duration(1000)
                  //   .ease("linear")
                  //   .attr("d", tool.graph.line1);
                  //
                  //
                  // console.log(" update graph with new start and end dates?");

                },
                "defaultDate": tool.configuration.end_date
              })
              .val(tool.configuration.end_date)
            )
            .append("<br />")
            .append(
              $("<a>")
                .addClass("btn")
                .html("Reset Default")
                .on("click",function(){

                  var default_start = tool.settings.date_start_default,
                      default_end = tool.settings.date_end_default;

                  tool.configuration.start_date = default_start;
                  tool.configuration.end_date = default_end;

                  $("#tool-date-end")
                    .val(default_end)
                    .datepicker("option","minDate",default_start)
                    .datepicker("option","maxDate",default_end)
                    .datepicker("setDate",default_end);

                  $("#tool-date-start")
                    .val(default_start)
                    .datepicker("option","minDate",default_start)
                    .datepicker("option","maxDate",default_end)
                    .datepicker("setDate",default_start);

                  tool.draw();
                })
            )
          )

      // things needed.

      // add startdate date picker

      // add end date date picker

      // add events to update the graph when dates change

    };

    /**
     * Draw first dataset following initial tool setup
     * Called by init_tool
     */
    tool.draw = function() {
      var url = tool.createUrl();

      $('<img class="loading-icon"' + '" src="' + EduVis.Environment.getPathTools() + 'Single_Time_Series/img/loading_small.gif" />')
        .appendTo($("#"+tool.dom_target+"_tool-status"))

      d3.csv(url, function(error, data) {

        $(".loading-icon").remove();

        if(typeof data !== "undefined"){
          tool.updategraph(data);
        }
        else{
          if(typeof error !== "undefined"){

            $("#"+tool.dom_target+"_tool-status").html(
              $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not currently available for this Station.</i>')
            )

          }
        }
      });

    };

    /**
     * Update graph and config when station pulldown is changed
     */
    tool.graph_update_sta = function(network_station){
        var net_sta = network_station.split(","),
            network = net_sta[0],
            station = net_sta[1];

        tool.configuration.network = network;
        tool.configuration.station = station;

        // are we sure we want to updated the graph here?
        tool.draw();
    };

    /**
     * Update graph and config when parameter pulldown is changed
     */
    tool.graph_update_param = function(parameter){

        //tool.configuration.station = "";

        tool.configuration.parameter = parameter;
        tool.draw();
    };

    // tool.graph_update_dates = function(date_start,date_end){
    //
    //     tool.configuration.start_date = date_start;
    //     tool.configuration.end_ate = date_end;
    //
    //     tool.draw();
    // }

    /**
     * Update graph and config when start date is changed
     * Not currently used?
     */
    function graph_update_sd(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.start_date = val;
        tool.draw();
    }
    /**
     * Update graph and config when end date is changed
     * Not currently used?
     */
    function graph_update_ed(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.end_date = val;
        tool.draw();
    }

    /**
     * Create the URL to request timeseries data
     * Called by draw and graph_update
     */
    tool.createUrl = function(){

      var config = this.configuration,
          network = config.network,
          station = config.station,
          parameter = config.parameter,
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


      return tool.web_services.data_url + "timeseries?" +
        'network=' + network +
        '&station=' + station +
        '&parameter=' + parameter +
        '&start_time=' + start +
        '&end_time=' + end;
    }

    /**
     * Update visualization with new data
     * Called by draw and graph_update
     */
    tool.updategraph = function(data) {

      if(typeof data === "undefined"){

        // insert an icon to let user know to select param

        $("#"+tool.dom_target+"_tool-status").html(
          $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
        )

      }
      else{

        if(data.length == 0){

            // insert an icon to let user know to select param
          $("#"+tool.dom_target+"_tool-status").html(
            $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
          );

        }
        else{

          // todo: parse out date for chart domain..

          var g = this.graph,
              cols = d3.entries(data[0]),
              bisectDate = d3.bisector(function(d) { return d.date; }).left,
              date_format = d3.time.format("%Y-%m-%d");

          data.forEach(function(d) {
            d.date = g.parseDate(d[cols[0].key]);
            d.data = +d[cols[1].key];
          });

          // Update X domain to use date range from the tool when in archive mode, otherwise use the range of the returned data.
          if(this.configuration.date_type == "realtime"){
            g.x.domain(d3.extent(data, (function(d) { return d.date; })));
          } else {
            g.x.domain([g.parseDateConfig(this.configuration.start_date),g.parseDateConfig(this.configuration.end_date)]).nice();
          }
          // Updte the Y domain to use the range of the returned data.
          g.y.domain(d3.extent(data, (function(d) { return d.data; }))).nice();

          g.svg.selectAll("path.line")
            .data([data])
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("d", g.line1);

          g.title.text( this.configuration.network + " Station " + this.configuration.station);
          g.ylabel.text(tool.proper_case(cols[1].key,"_"));
          var datelimits = g.x.domain();
          g.xlabel.text(d3.time.format.utc("%B %e, %Y")(datelimits[0]) + " to " + d3.time.format.utc("%B %e, %Y")(datelimits[1]));
          var stats = tool.average(data);
          g.stats.text("Mean: " + d3.round(stats.mean,2) + " / StDev: " + d3.round(stats.deviation,2) );

          // update x and y axis
          d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
          d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);

          d3.selectAll('.axis line, .axis path')
            .style("fill","none")
            .style("stroke","#999")
            .style("stroke-width","1px")
            //.style("shape-rendering","crispEdges")
          d3.selectAll('.y.axis line')
            .style("stroke-opacity",".4")

          //mouse move
          g.mousemover.on("mousemove", function(){

            var mouseX = d3.mouse(this)[0],
                x0 = g.x.invert(mouseX),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0,
                xMax = g.x(g.x.domain()[1]),
                xPosition = g.x(x0)>(xMax/2) ? -110:0;

            g.mouse_focus.attr("transform", "translate(" + g.x(d.date) + "," + g.y(d.data) + ")");
            g.mouse_focus.select("text").text(g.formatDate(d.date) + " - " + d3.round(d.data,4))
              .attr("transform", "translate(" + xPosition + "," + 0 + ")");

          });

        }
      };

      // remove loading image
      $(".loading-icon").remove();

    };

    /**
     * Calculates general statistics on data
     * Called by updategraph
     * This should be replaced by d3.deviation and other related functions when (if?) implemented.
     */
    tool.average = function(data) {
      var a=Array();
      data.forEach(function(d) {
        a.push(d.data);
      });
      var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
      for(var m, s = 0, l = t; l--; s += a[l]);
      for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
      return r.deviation = Math.sqrt(r.variance = s / t), r;
    }

    /**
     * Generate station and parameter pulldowns
     * Called by setup
     */
    tool.select_createDropdowns = function(_target){

      $("#"+ _target + "_ui_tool_controls")

        .append(
          $("<div/>")
            .attr({
              "id": _target+"_tool-dropdowns"
            })
            .append("Station: &nbsp;")
            .append(
              $("<select></select>")
              .attr({
                "id" : _target+"_select-stations"
              })
              .on("change", function(evt){

                // update network and station in config
                if(tool.select_updateParameters()){
                  tool.graph_update_sta(evt.target.value);
                }
                else{
                  // set option shere

                  $("#"+_target+"_tool-status")
                    .html(
                      $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Please choose a new parameter.</i>')
                    )
                }
              })
            )
            .append("&nbsp;&nbsp;&nbsp;Parameter: &nbsp;")
            .append(
              $("<select></select>")
              .attr({
                "id" : _target + "_select-parameters"
              })
              .on("change", function(evt){

                $(".param-icon").remove();

                tool.graph_update_param(evt.target.value)

              })
            )
        )
        .append(

          $("<div/>")
            .attr({
              "id" : _target+"_tool-status"
            })
        )
        .appendTo(
          $("#"+_target)
        )

    };

    /**
     * Update station pulldown to match config
     * Called by setup and init_controls
     */
    tool.select_updateStations = function(){

      var config = tool.configuration,
          options = [],
          len = config.data_cart.length,
          x=0;

      // clear the current stations
      $("#"+tool.dom_target+"_select-stations").empty();

      for(;x<len;x++){

        var s = config.data_cart[x];
        var option = $("<option/>")
          .attr({
            "value": s.network + "," + s.station
          })
          .html(
            function(){
              if(typeof s.custom_name === "undefined"){
                return s.network + " - " + s.station;
              }
              else{
                return s.custom_name;
              }
            }
          );

        options.push(option);

      };
      // add all the options from the options array to the select

      // find network-station in dropdown.. if not exists.. choose one

      $("#"+tool.dom_target+"_select-stations")
        .append(options);

      // check if value is in list
      // if not, change configuration to the first item in the list.

      if($("#"+tool.dom_target+"_select-stations option[value='" + config.network + "," + config.station + "']").val() === undefined){

        $("#"+tool.dom_target+"_select-stations option:first")
        .prop("selected", "selected");

        var net_sta = $("#"+tool.dom_target+"_select-stations").val().split(",");

        config.network = net_sta[0];
        config.station = net_sta[1];

      }
      else{

        $("#"+tool.dom_target+"_select-stations")
        .val(config.network + "," + config.station);

      }

      //console.log("*****" + config.network + "," + config.station);

    };

    /**
     * Update parameter pulldown to match config
     * Called by setup, init_controls (when apply is clicked) and select_createDropdowns
     */
    tool.select_updateParameters = function(){

      //console.log($("#"+tool.dom_target+"_select-stations").val());

      var net_sta = $("#"+tool.dom_target+"_select-stations").val().split(","),
          network = net_sta[0],
          station = net_sta[1],
          config = tool.configuration,
          dc = config.data_cart,
          options = [],
          selected_param,
          data_cart_index = tool.station_get_index(station);

      $(".param-icon").remove();

      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append("<option>..updating..</option>");

      $.each(dc[data_cart_index].parameters,function(parameter){

        // create new option and add it to the options array
        var option = $("<option></option>")
          .attr({
            "value": parameter
          })
          .html(tool.proper_case(parameter,"_"));

        options.push(option);

      });

      // clear loading indicator and append options
      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append(options);

      selected_param = $("#"+tool.dom_target+"_select-parameters option")
        .filter(function(){
          //console.log("config param", config.parameter);
          return ($(this).val() == config.parameter);
        })
        .prop('selected', true);

      if(selected_param.length == 0){

        // update the configuration network and station
        var net_sta = $("#"+tool.dom_target+"_select-stations").val().split(",");

        config.network = net_sta[0];
        config.station = net_sta[1];

        $("#"+tool.dom_target+"_tool-status")
          .html(
            $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Please choose a new parameter.</i>')
          )

        $("<option>(choose one)</option>")
          .prop("selected", true)
          .insertBefore($("#"+tool.dom_target+"_select-parameters option:first"))

        return false;
      }

      return true;

    };

    // convert delimted string to proper case and removes delimter
    // i.e. water_temperature --> Water Temperature
    tool.proper_case = function(make_proper, delim){

      var string_proper = "";

      // convert make_proper to proper case.. split on delim
      $.each(make_proper.split(delim),function(p,part){
        string_proper += part.charAt(0).toUpperCase() + part.substr(1).toLowerCase() + " ";
      });

      return string_proper;
    };

    /** Find station array index by station name **/
    tool.station_get_index = function(station){

      var dc = tool.configuration.data_cart, index = false;

      $.each(dc,function(i,s){
        if(s.station == station){index = i};
      });
      return index;
    }

    /**
     * Called by data browser control
     */
    tool.update_callback = function(){

      tool.select_updateStations();
      tool.select_updateParameters();

    };

    tool.web_services = {

      //http://epedev.oceanobservatories.org/timeseries/stations/
      //http://epedata.oceanobservatories.org/timeseries?

      "data_url" : "http://epe.marine.rutgers.edu/epedata/"
    };

    /**
     * Initialize tool
     * Called automatically by EduVis
     */
    tool.init_tool = function(_target) {
      this.setup(this.dom_target);
      this.draw();
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

      tool.controls.ui_date_toggle = $("<div/>")
        .append("Datepicker Toggle: &nbsp;")
        .append(
          $("<select></select>")
            .attr({"id":"ui_control_date_toggle"})
            .on("change",function(evt){

              tool.configuration.datepicker_ui = evt.target.value;

              //tool.controls.Data_Browser_Control.apply_button_update("modified");

            })
            .val(tool.configuration.datepicker_ui)
            .append('<option value="on">On</option>')
            .append('<option value="off">Off</option>')

        );

        tool.controls.ui_date_toggle.insertBefore("#db-selection-search");

    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
