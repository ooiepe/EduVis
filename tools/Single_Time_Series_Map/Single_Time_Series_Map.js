/*

 * OOI EPE - Single Time Series with Map (STSM)
 * Revised 5/27/2014
 * Written by Mike Mills and Sage Lichtenwalner

*/

(function (eduVis) {
    
    "use strict";

    var tool = {
        "name" : "Single_Time_Series_Map",
        "version" : "0.3.2",
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
          "tool" : {
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
                //"resource_type" : "tool",
                "name": "leaflet_js",
                "url" : "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js",
                "namespace" : "L"
              },
              {
                "name" : "jquery_ui_js", 
                "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js"
              }

            ],
            "stylesheets" : [
              {
                "name" : "Single_Time_Series_Map_css",
                "src" : "Single_Time_Series_Map.css"
              },
              {
                "name" : "jquery-ui-css",
                "src" : "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
              },
              {
                "name": "leaflet-css",
                "src": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css"
              }
            ]
          },
          "controls" : {

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
                    "src": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css"

                }
            ],


          },
          "datasets" : []            
        },

        // default chart properties
        "configuration" : {
          // updated by visualization
          "station" : "44025",
          "network" : "NDBC",
          "parameter" : "water_temperature",
          
          // update by browser
          "realtime_days" : "2",
          "start_date": "2013-07-01",
          "end_date": "2013-07-20",
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
          }
        },

        "data" : {},
        // "target_div" : "Hello_World",
        "tools" : {},
        "graph" : {}
    };

    tool.controls = {
    
      "layer_station_markers" : {},
      "timerSearchProgress" : {},
      "timerSearchQueue" : {},
      "stationMarkerOptions" : {

        "NDBC" : {
            radius: 6,
            fillColor: "#ff0000",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        },
        "CO-OPS" : {
            radius: 6,
            fillColor: "#ffff00",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }
      },

      "styleStationHighlight" : { 
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.6
      },

      "styleStationClicked" : { 
          weight: 8,
          color: '#ff0000',
          dashArray: '',
          fillOpacity: 0.7
      },

      "styleStationReset" : {
          radius: 6,
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }
        
    };
    
    /**
     * Initial setup of visualization tool
     * Called by init_tool
     */
    tool.setup = function( _target ){
      
      var g = this.graph,
        width_chart_container = 580,
        height_chart_container = 400,
        width_map_container = 220,
        height_map_container = 400,
        height_map = 280;

      // set up div containers
      $("#"+_target)
        .width(820)
        .height(500)
        .css({
          "margin":"0 auto",
          "position":"relative",
          "overflow":"auto",
        })
        .append(

          $("<div />")
            .attr("id", _target + "-chart-container")
            .width(width_chart_container)
            .height(height_chart_container)
            // .height()
            .css({
              "position" : "absolute",
              "left" : "0",
              "top" : "0",
              // "width" : width_chart_container + "px",
              // "height" : height_chart_container + "px",
              "padding" : "0",
              "margin":"0"
            })
            .append(
              $("<div />")
                .attr("id", _target + "-sts-chart")
                .width(width_chart_container)
            )
        )
        .append(

          $("<div />")
            .attr("id", _target + "-map-container")
            .width(width_map_container)
            .height(height_map_container)
            .css({
              "position":"absolute",
              "left" : width_chart_container + "px"
             
            })
            .append(
              $("<div />")
                .attr("id", _target + "-sts-map")
                .height(height_map)
                .width(width_map_container)
                // .css({
                //    "position":"absolute",
                //    "left" : "0",
                //    "top": "0"
                // })
            )
            .append(
              $("<div />")
                .attr("id", _target + "-sts-map-metadata")
                .width(width_map_container)
            )
        );

      // setup chart
      g.margin = {top: 26, right: 25, bottom: 40, left: 60};
      g.width = width_chart_container - g.margin.left - g.margin.right;
      g.height = height_chart_container - g.margin.top - g.margin.bottom;
      
      g.parseDate = d3.time.format.iso.parse;
      g.formatDate = d3.time.format("%Y-%m-%d");
      
      g.x = d3.time.scale.utc().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);
      
      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);
      
      g.svg = d3.select("#"+ _target + "-sts-chart").append("svg")
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
      
      g.chart = g.svg.append("g")
          .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");

      g.chart.append("g")
        .attr("id", _target+"_xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .call(g.xAxis);
        
      g.chart.append("g")
        .attr("id", _target+"_yAxis")
        .attr("class", "y axis")
        .call(g.yAxis);

      // add overlay here.. with mousemove event for X axis valuation

      g.chart.append("path")
        //.datum(data)
        .attr("class", "line")
        .attr("d", g.line1)
        .style("fill","none")
        .style("stroke","#a33333")
        .style("stroke-width","2px");

      g.line1 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x(d.date); })
        .y(function(d) { return g.y(d.data); });

      g.mouse_focus = g.chart.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus.append("circle")
          .attr("r", 4.5);

      g.mouse_focus.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      g.mousemover = g.chart.append("rect")
        .attr("class", "overlay")
        .attr("width", g.width)
        .attr("height", g.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { g.mouse_focus.style("display", null); })
        .on("mouseout", function() { g.mouse_focus.style("display", "none"); })
        //.on("mousemove", mousemove);
      
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

      tool.select_createDropdowns(_target);
      tool.select_updateStations();
      tool.select_updateParameters();

      // setup map

      tool.leaflet_map = {

        "map" : {},
        "oceanBasemap_url" : 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
        "oceanBasemap_layer" : {},
        "layer_collection":[],
        "station_markers" : [],
        "styles" : {

          "station" : {
            radius: 6,
            fillColor: "#ff0000",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          },

          "station_other" : {
            radius: 7,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          },
          "station_click" : {
            radius: 8,
            fillColor: "#00aaee",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          },
          "station_hover" : {
            radius: 7,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          }
        }
      };

      //extend marker
      tool.stationCircleMarker = L.CircleMarker.extend({
         options: { 
            station: 'station',
            network: 'network',
            description:"description"
         }
      });

      // initialize map
      tool.leaflet_map.map = L.map( _target + '-sts-map', {
        "center": [38.5,-78.2],
        "zoom": 3
        // ,noWrap : true
      });

      tool.leaflet_map.oceanBasemap_layer = new L.TileLayer(tool.leaflet_map.oceanBasemap_url,{ 
        maxZoom: 19, 
        attribution: 'Tile Layer: &copy; Esri' 
      })
      .addTo(tool.leaflet_map.map);

      tool.leaflet_map.station_markers = new L.featureGroup();

      tool.init_map();


    };

    tool.init_map = function(){

      $.each(tool.configuration.data_cart, function(network, network_obj){

        $.each(network_obj,function(station, station_obj){

          // request station data for single station. no support for multiple stations
          $.getJSON( "http://epedata.oceanobservatories.org/stations/" + network + "/" + station, function( data ) {

            console.log("**** station data **** ", data);

            var options = $.extend(true, {
                "station":station,
                "network":network,
                "description": data.description
              }, tool.leaflet_map.styles.station);

            var stationMarker = new tool.stationCircleMarker([data.latitude, data.longitude], options)
              .on("click",function(a){

                //reset layer styles
                // tool.leaflet_map.station_markers.eachLayer(function(layer){
                //   console.log("LAYER", layer);

                //   layer.setStyle(tool.leaflet_map.styles.station);
                // });
                tool.leaflet_map.station_markers.setStyle(tool.leaflet_map.styles.station);

                $("#" + tool.dom_target + "_select-stations")
                  .val(data.network + "," + data.name)
                  .change();
                
                $("#" + tool.dom_target + "-sts-map-metadata")
                  .html(
                    '<div class="station_popup">'+
                    //'<div class="popup-title">' + data.network + ' ' + data.name + '</div>'+
                    '<div class="popup-title">' + data.description.replace(/-/g, "<br />") + '</div>'+
                    '<div class="popup-desc"> '+
                      'Lat: ' + data.latitude + '<br />'+
                      'Lng: ' + data.longitude +
                     '</div>'+
                   '</div>'
                  );

                a.target.setStyle(tool.leaflet_map.styles.station_click);

              })
              .addTo(tool.leaflet_map.map)
              // .bindPopup(
              //   data.network + ' ' + data.name
              // )
              .addTo(tool.leaflet_map.station_markers);

            // set default selected station and station details
            if(tool.configuration.station == station){
              //stationMarker.openPopup();

              stationMarker.setStyle(tool.leaflet_map.styles.station_click);

              $("#" + tool.dom_target + "-sts-map-metadata")
                .html(
                  '<div class="station_popup">'+
                  //'<div class="popup-title">' + data.network + ' ' + data.name + '</div>'+
                  '<div class="popup-title">' + data.description.replace(/-/g, "<br />") + '</div>'+
                  '<div class="popup-desc"> '+
                    'Lat: ' + data.latitude + '<br />'+
                    'Lng: ' + data.longitude +
                   '</div>'+
                 '</div>'
                )
            }

            //zoom to bounds
            tool.leaflet_map.map.fitBounds(tool.leaflet_map.station_markers.getBounds());

          });
        });
      });
      
      // hack to invalidate the map bounds and show the appropriate zoom.
      $('.nav-tabs a[href="#ev-instance-preview"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        tool.leaflet_map.map.invalidateSize();
        tool.leaflet_map.map.fitBounds(tool.leaflet_map.station_markers.getBounds());
      })
    };

    tool.update_map = function(){

      this.leaflet_map.station_markers.eachLayer(function(layer){
        layer.removeLayer();
      })

      this.init_map();
    }

    /**
     * Draw first dataset following initial tool setup 
     * Called by init_tool
     */
    tool.draw = function() {
      var url = tool.createUrl();
      
      $('<img class="loading-icon"' + '" src="' + EduVis.Environment.getPathTools() + 'Single_Time_Series_Map/img/loading_small.gif" />')
        .appendTo($("#"+tool.dom_target+"_tool-status"))

      d3.csv(url, function(error, data) {

        $(".loading-icon").remove();

        if(typeof data !== "undefined"){
          tool.update_graph(data);  
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

         // update map
        // tool.leaflet_map.station_markers.setStyle(function(station){
        //    //alert(station);
        //    return tool.leaflet_map.styles.station_click;
        // })

        tool.leaflet_map.station_markers.setStyle(tool.leaflet_map.styles.station);

        tool.leaflet_map.station_markers.eachLayer(function(layer){
          
          console.log("LAYER", layer, layer.getLatLng(), layer.latitude);

          if(station == layer.options.station){
            layer.setStyle(tool.leaflet_map.styles.station_click);

            $("#" + tool.dom_target + "-sts-map-metadata")
              .html(
                '<div class="station_popup">'+
                //'<div class="popup-title">' + data.network + ' ' + data.name + '</div>'+
                '<div class="popup-title">' + layer.options.description.replace(/-/g, "<br />") + '</div>'+
                '<div class="popup-desc"> '+
                  'Lat: ' + layer.getLatLng().lat + '<br />'+
                  'Lng: ' + layer.getLatLng().lng +
                 '</div>'+
               '</div>'
              );
          }
        });

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
        start = config.realtime_days,
        end = "now";  
      }
      else{
        start = config.start_date,
        end = config.end_date;
      }

      return 'http://epedata.oceanobservatories.org/timeseries?' + 
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
    tool.update_graph = function(data) {

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
              bisectDate = d3.bisector(function(d) { return d.date; }).left;

          data.forEach(function(d) {
            d.date = g.parseDate(d[cols[0].key]);
            d.data = +d[cols[1].key];
          }); 

          // Update X domain to use date range from the tool when in archive mode, otherwise use the range of the returned data.
          if(this.configuration.date_type == "realtime"){
            g.x.domain(d3.extent(data, (function(d) { return d.date; })));
          } else {
            g.x.domain([g.parseDate(this.configuration.start_date),g.parseDate(this.configuration.end_date)]).nice();
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
          g.ylabel.text(cols[1].key);
          var datelimits = g.x.domain();
          g.xlabel.text(d3.time.format.utc("%B %e, %Y")(datelimits[0]) + " to " + d3.time.format.utc("%B %e, %Y")(datelimits[1]));
          var stats = tool.average(data);
          g.stats.text("Mean: " + d3.round(stats.mean,2) + " / StDev: " + d3.round(stats.deviation,2) );
          //console.log(stats);

          // update x and y axis 
          d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
          d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);
          
          d3.selectAll('.axis line, .axis path')
            .style("fill","none")
            .style("stroke","#999")
            .style("stroke-width","1px")
            //.style("shape-rendering","crispEdges")
          d3.selectAll('.y.axis line')
            .style("stroke-opacity",".4");

          //mouse move
          g.mousemover.on("mousemove", function(){
            var chartMiddle = g.width / 2,
                mouseX = d3.mouse(this)[0],
                x0 = g.x.invert(mouseX),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            g.mouse_focus.attr("transform", "translate(" + g.x(d.date) + "," + g.y(d.data) + ")");
            g.mouse_focus.select("text").text(g.formatDate(d.date) + " - " + d3.round(d.data,4))
              .attr("transform", "translate(" + (mouseX > chartMiddle ? -110 : 0) + "," + 0 + ")");
          })
        }
      }
      
      // remove loading image
      $(".loading-icon").remove();

    };
    
    /**
     * Calculates general statistics on data
     * Called by update_graph
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
     
      var tool_controls = $("<div/>")
        .css({
          "text-align" : "center",
          "height" : "50px"
        })
        .append(
          $("<div/>")
            .attr({
              "id": _target+"_tool-dropdowns"
            })
            .append("Station: ")
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
            .append("&nbsp;&nbsp;&nbsp;Parameter: ")
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
          $("#"+_target+"-sts-chart")
        )

    };

    /**
     * Update station pulldown to match config
     * Called by setup and init_controls
     */
    tool.select_updateStations = function(){

      var config = tool.configuration,
        options = [];

      // clear the current stations
      $("#"+tool.dom_target+"_select-stations").empty();

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
          selected_param;
          // need to condition for param that is not available in a newly updated list (when station changes and the new station does not have the previously selected param.. in that case, just take the first parameter of the list.. and put an exclaimation next to the dropdown to indicated update ened)

        // reference to param
        // does current param exist in list?
      
      $(".param-icon").remove();

      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append("<option>..updating..</option>");

      // populate options array with parameters
      $.each(dc[network][station].parameters, function(parameter){
        // create new option and add it to the options array
        var option = $("<option></option>")
          .attr({
            "value": parameter
          })
          .html(parameter);

        options.push(option);

      });

      // clear loading indicator and append options
      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append(options);

      // set the default selected paramter
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
       
      // place data browser in provided Dom, otherwise add to body
      var dataBrowserDom = $("<div/>",{"id": "data_browser"}),

      dataBrowser_html = $("<div/>", {
        id : "data-broswer"
      }),

      // html_data_browser -> hdb

      db_header = $("<div>",{
        id : "data-browser-header"
      }),

      db_wrap = $("<div>",{
        id:"data-browser-wrap",
        "css":{
          "height":"600px"
        }
      }),

      db_sidebar_left = $("<div/>",{
        "id":"db-sidebar-left"
      })
      .append(

        $("<div/>",{"id":"db-data-selection-controls"})
          .append(
            $("<div/>", {
              "id":"db-select-parameters"
            })
            .html(
              $("<h5>Parameters</h5>")
              .css({"border-bottom":"1px solid #CCCCCC"})
            )
          )
          .append(
              $("<div/>", {
                "id":"db-select-networks"
              })
              .html(
                $("<h5>Networks</h5>")
                .css({"border-bottom":"1px solid #CCCCCC"})
              )
          )
          .append(

            $("<div/>", {
                "id":"db-select-dates"
            })
            .html(
              $("<h5>Date Range</h5>")
              .css({"border-bottom":"1px solid #CCCCCC"})
            )
            .append(
              $("<div/>")
              .append(
                $("<select/>",{
                    "id":"db-dates-dropdown"
                })
                .on("change", function(evt){

                  $("#db-dates-realtime").hide();
                  $("#db-dates-archived").hide();

                  $("#db-dates-"+evt.target.value).show();

                  tool.controls.apply_button_update("modified");

                })
                .append('<option value="realtime">Real Time</option>')
                .append('<option value="archived">Archived</option>')
              )
            )
            //tabs
            // .append(
            //   $("<div/>", {
            //     "id":"db-dates-tabs"
            //   })
            //   .append(
            //     $("div").html("tab1")
            //   )
            //   .append(
            //     $("div").html("tab2")
            //   )
            // )
            .append(
              $("<div/>", {
                "id":"db-dates-archived"
              })
              .css({"display":"none"})
              .append(

                $("<div/>")
                .append(
                  $("<label />")
                  .attr({
                      'title':  "The Start date.",
                  })
                  .html("<b>Start Date<b>")
                )
                .append(

                  $("<input />")
                  .attr({
                    "id": "db-date-start",
                    "name":"db-date-start",
                    "type": "text",
                  })
                  .addClass('datepicker')
                  .datepicker({
                      "dateFormat": "yy-mm-dd",
                      "changeMonth": true,
                      "changeYear": true,
                      "onClose" : function(d,i){

                        $("#date_range_label").remove();

                        if(tool.controls.verify_date_range()){

                          tool.controls.apply_button_update("modified");
                          $("#db-btn_search").removeClass("disabled");

                        }
                        else{

                          $("#db-btn_search").addClass("disabled");

                          $("<label />")
                            .attr("id","date_range_label")
                            .html("Please select a date range that is one year or less.")
                            .css({"color":"red"})
                            .insertBefore('#db-selection-search')
                        }

                      },
                      "defaultDate": tool.configuration.start_date

                  })
                  .val(tool.configuration.start_date)
                )
              )
              .append(
                $("<div/>")
                .append(
                  $("<label />")
                  .attr({
                      'title':  "The End date.",
                  })
                  .html("<b>End Date<b>")
                )
                .append(

                  $("<input />")
                  .attr({
                      "id": "db-date-end",
                      "name":"db-date-end",
                      "type": "text",
                  })
                  .addClass('datepicker')
                  .datepicker({
                      "dateFormat": "yy-mm-dd",
                      "changeMonth": true,
                      "changeYear": true,
                      "onSelect" : function(d,i){
                        
                          $("#date_range_label").remove();

                          if(tool.controls.verify_date_range()){

                            tool.controls.apply_button_update("modified");
                            $("#db-btn_search").removeClass("disabled");

                          }
                          else{

                            $("#db-btn_search").addClass("disabled");

                            $("<label />")
                              .attr("id","date_range_label")
                              .html("Please select a date range that is one year or less.")
                              .css({"color":"red"})
                              .insertBefore('#db-selection-search')
                          }

                      },
                      "defaultDate": tool.configuration.end_date

                  })
                  .val(tool.configuration.end_date)
                )
              )
            )
          )
          .append(
            $("<div/>", {
              "id":"db-dates-realtime"
            })
            .css({"display":"none"})
            .append(
              $("<div/>")
              .append(
                $("<label />")
                .attr({
                    'title':  "Days Prior.",
                })
                .html("<b>Days Prior<b>")
              )
              .append(
                
              )
              .append(

                $("<input />")
                .attr({
                  "id": "db-reatltime_days",
                  "name":"db-reatltime_days",
                  "type": "text",
                })
                .addClass('small')
                .val(tool.configuration.realtime_days)
                .on("change", function(){
                  tool.controls.apply_button_update("modified")
                })
              )
              .append(
                $("<div/>")
                .append(
                  $("<select/>")
                  .on("change",function(evt){
                    if(evt.target.value !== "Predefined")
                      $("#db-reatltime_days").val(evt.target.value);
                  })
                  .append($('<option>Predefined</option>'))
                  .append($('<option value="1">24 hours</option>'))
                  .append($('<option value="7">1 Week</option>'))
                  .append($('<option value="30">1 Month</option>'))
                )
              )
            )

          )
          .append(
          $("<div/>", {
              "id":"db-selection-search"
          })
          .append(
            $("<div/>", {
                "id":"db-select-networks"
            })
            .html(
              $("<h5>&nbsp;</h5>")
                .css({"border-bottom":"1px solid #CCCCCC"})
            )
          )
          .append(
            $("<input/>", {
                "type":"button",
                "id":"db-btn_search",
                "value": "search"
            })
          )
          .append(
            $("<div>",{"id":"db-search-progress"})      //search-progress
          )
        )
      ),

      db_main_content = $("<div/>",{
        "id":"db-main-content"                              /// data browser main-content
      })
      .append(
        $("<div/>", {
          "id":"db-map"
        })
      )
      .append(
        $("<div/>", {
          "id":"db-mapinfo"
        })
      ),

      db_sidebar_right = $("<div/>",{
        "id":"db-sidebar-right"                             /// data browser sidebar-right
      })
      .append(
        $("<div/>", {
          "id":"db-station-window"
        })
        .append(
          $("<h5/>", {
            "class":"db-title",
            "css":{
                "border-bottom":"1px solid #CCCCCC"
            }
          })
          .html("Station Details")
        )
        .append(
          $("<div/>", {
            "id":"db-station-details"
          })
        )
      )
      .append(
        $("<div/>", {
          "id":"db-data-cart-window"
        })
        .append(
          $("<h5/>", {
            "class":"db-title",
            "css":{
                "border-bottom":"1px solid #CCCCCC"
            }
          })
          .html("Selected Station List")
        )
        .append(
          $("<div/>", {
            "id":"db-data-cart"
          })
        )
      )
       .append(
          $("<div/>", {
            "id":"db-data-cart-apply",
          })
          .append(
            $("<button>", {
              "id":"btn-apply",
              "type":"button",
              "class":"btn btn-medium disabled",
            })
            .css({
              "width": "100px",
              "margin-right":"10px"
            })
            .html('Apply') //icon-exclamation-sign
            .on("click",function(){

              var config = tool.configuration;

              // default chart properties
             
              // updated by the visualization

              // "station" : "44033",
              // "network" : "NDBC",
              // "parameter" : "water_temperature",

              // updated by the data browser
               
              config["date_type"] = $("#db-dates-dropdown").val();

              if(config["date_type"] == "archived"){
               
                config["start_date"] =  $("#db-date-start").val();
                config["end_date"] =  $("#db-date-end").val();
                config["realtime_days"] = 0; //? set to zero?

              }
              else{

                //var tmpDate = new Date(),
                    // month,
                    // day,
                    // dateString;

                // month = tmpDate.getMonth() + 1;
                // month = month<10? "0" + month : month;

                // day = tmpDate.getDate();
                // day = day<10 ? "0" + day : day;

                // dateString = tmpDate.getFullYear() + "-" + month + "-" + day;

                config["end_date"] =  "now";
                config["start_date"] =  $("#db-reatltime_days").val();

                config["realtime_days"] =  $("#db-reatltime_days").val();

              }
  
              tool.select_updateStations();
              tool.select_updateParameters();

              tool.controls.apply_button_update("up-to-date");

              tool.update_map();

           })
          )
          .append(
            $('<img src="'+ EduVis.Environment.getPathTools() + 'Single_Time_Series_Map/img/check_green.png"' + ' id="apply-check" style="display:none" />')
          )   
      ),

      db_footer = $("<div/>", {
          "id":"db-footer"
      });

      dataBrowser_html
        .append(db_header)
        .append(
          db_wrap
          .append(db_sidebar_left)
          .append(db_main_content)
          .append(db_sidebar_right)
          .append(db_footer)
        )

      dataBrowserDom
        .append(dataBrowser_html)
        .appendTo("#vistool-controls");

      // set default configuration options

      $("#db-dates-"+tool.configuration.date_type).show();

      $("#db-dates-dropdown").val(tool.configuration.date_type);

      var height = $(dataBrowserDom).height(),
      header = $("#db-header").height(),
      footer = $("#db-footer").height(),
      mainHeight = height - header - footer - 2,
      winStationHeight = (mainHeight/2-60), // now compensate for Apply button original->(mainHeight/2-20)
      winCartHeight = winStationHeight,
      winApplyHeight = 60;

      $("#data-browser-wrap").height(mainHeight);
      $("#db-map").height(mainHeight);

      $("#db-station-details").height(winStationHeight);
      $("#db-data-cart").height(winStationHeight);
      $("#db-data-cart-apply").height(winApplyHeight);

    // END DataBrowser HTML

    //--//

    // BEGIN dataBrowser JavaScript

    // initialize leaflet map
      tool.controls.map = L.map('db-map', {
        center: [38.5,-78.2],
        zoom: 3
        // ,noWrap : true
      });

      // set esri tile service url for ocean basemap
      var oceanBasemap_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
      
      // set leaflet layer of esri ocean basmap
      oceanBasemap_layer = new L.TileLayer(oceanBasemap_url,{ 
        maxZoom: 19, 
        attribution: 'Tile Layer: &copy; Esri' 
      })
      .addTo(tool.controls.map),

      // set resize timer for window 
      resizeTimer;

//
// PARAMETERS
//

    // get the parameters from the json file.
     $.getJSON( "http://epedata.oceanobservatories.org/parameters", function( data ) {
        
        //var parameters = this.db_data.parameters,
        var parameters = data.parameters,
        selects = [];

        $.each( parameters, function( params, param) {

          selects.push( 
            $("<div/>")
              .attr("title", param.description)
              .append( 
                $("<input />")
                .attr({
                  "id":"db-select-"+param.name,
                  "type":"checkbox",
                  "value":param.name
                })
              )
              .append( 
                $("<label/>")
                .attr("for","db-select-"+param.name)
                .html(param.name)
              )
              .append( 
                $("<a></a>")
                .attr("title", param.description)
              )
          );

      });
     
      $( "<div/>", {
        "class": "db-select-list",
        "html": selects
      })
      .css({
        "max-height":"140px",
        "overflow-y":"scroll"
      })
      .appendTo( "#db-select-parameters" );
   });

// //
// // networks
// //

      $.getJSON( "http://epedata.oceanobservatories.org/networks", function( data ) {

        //{ "networks": [ { "id": "ndbc", "name": "NDBC", "description": "National Data Buoy Center", "url": "http://sdf.ndbc.noaa.gov/" }, { "id": "co-ops", "name": "CO-OPS", "description": "Center for Operational Oceanographic Products and Services", "url": "http://opendap.co-ops.nos.noaa.gov/" } ] }
        
        //var networks = this.db_data.networks,
        var networks = data.networks,
        selects = [];

        $.each( networks, function( networks, network) {

          selects.push( 
            $("<div/>")
            .attr("title", network.description)
            .append( 
              $("<input />")
              .attr({
                  "id":"db-select-" + network.name,
                  "type":"checkbox",
                  "value":network.name
              })
            )
            .append( 

              $("<label/>")
              .attr("for","db-select-" + network.name)
              .html(network.name)
            )
            .append( 

              $("<a></a>")
              .attr("title", network.description)
              .attr("href","#" + network.name)
            )
          );
        });
     
        $( "<div/>", {
          "class": "db-select-list",
          html: selects
        })
        .appendTo( "#db-select-networks" );

      });

      // check any parameters that currently exist in the data cart

      // attach search to the button for now
      $("#db-btn_search").on("click", tool.controls.searchQueue);

      tool.controls.dataCart();

    };

    /**
     * ???
     * Not currently used?
     */
    tool.controls.processDateTime = function(){

      // get reference to date elements
      var el_date_start = $("#db-date-start"),
          el_date_end = $("#db-date-end"),
          el_date_label = $("#db-date-details");

      //console.log("el_date_start: " +el_date_start.val());
      //console.log("el_date_end: " +el_date_end.val());
    };


    /** 
      verify the date range is maximum 1 year
    */

    tool.controls.verify_date_range = function(){

      var el_date_start = $("#db-date-start"),
          el_date_end = $("#db-date-end"),
          
          date_start = new Date(el_date_start.val()),
          date_end = new Date(el_date_end.val()),

          date_start_ms = date_start.getTime(),
          date_end_ms = date_end.getTime(),

          oneday_ms = 1000 * 60 * 60 * 24,

          diff_ms = Math.abs(date_start_ms - date_end_ms),
          diff_days = Math.floor(diff_ms/oneday_ms);
        
          if(diff_days > 366){  
            return false;
          }else{
            return true;
          }
          // if(diff_days > 365){
          //   // is the start date or end date a leap year?
          //   if( (new Date(date_start.getFullYear(), 1, 29).getMonth() == 1) || (new Date(date_end.getFullYear(), 1, 29).getMonth() == 1) ){
          //     if(diff_days > 366){
          //       return false;
          //     }
          //     else{
          //       return true;
          //     }
          //   }
          //   return false;
          // }
          // else{
          //   return true;
          // }
    };

    /**
     * Perform delayed station search
     * Attached to search button in init_controls 
     */
    tool.controls.searchQueue = function(){

        var self = this,
            time_segments = 5,
            time_overall = 2000,
            time_interval = time_overall/time_segments,
            time_progress_interval = 100/time_segments;
        
        // turn on the progress bar and set value to 25
        $( "#db-search-progress" )
        .progressbar({"enabled":true, value: time_progress_interval});
        
        // clear interval
        clearInterval(tool.controls._timerSearchProgress);

        // set the interval timer to increment 25. time is 3/4 second
        tool.controls._timerSearchProgress = setInterval(function(){

          var progressbar = $( "#db-search-progress" ),
              progressValue = progressbar.progressbar("value");

          progressbar.progressbar({"value": progressValue + time_progress_interval});

        }, time_interval);

        clearTimeout(tool.controls._timerSearchQueue);
        tool.controls._timerSearchQueue = setTimeout(function(){
            
          // tun the search timer
          tool.controls.searchData();

          $( "#db-search-progress" ).progressbar( "value",0);
          clearInterval(tool.controls._timerSearchProgress);

        }, time_overall);

    };

    /**
     * Station search
     * Called by searchQueue
     */
    tool.controls.searchData = function (){

        if(tool.controls.map.hasLayer(tool.controls.layer_station_markers)){
            tool.controls.map.removeLayer(tool.controls.layer_station_markers);
        }

        var search_stations_query = "http://epedata.oceanobservatories.org/" + tool.controls.stationSearch();

        $.getJSON( search_stations_query, function(geodata){

            //console.log(geodata);

            var stationsFeatureCollection = geodata,

            layer_stations = new L.GeoJSON(stationsFeatureCollection,
            {
                onEachFeature: function (station, station_feature) {
                    
               //   layer.bindPopup(
                        // station.properties.description
               //   );
                    //console.log(station.properties.network + " - " + station.properties.name, station);

                    //station_feature.setAttribute("title","testing");

                    station_feature.on({

                        "click": function(e){
                            //alert("Name:" + station.properties.name);

                            // network and station name are needed for the station pull
                            //http://ooi.dev/epe/data-services/stations/CO-OPS/UNI1024
                            
                            //todo: show station being clicked.. epedev-232
                            var layer = e.target;
                            layer.setStyle(tool.styleStationClicked);

                            setTimeout(function(){layer.setStyle(tool.styleStationReset);},2000);

                            tool.controls.stationWindowUpdate(station);

                        },

                        // highlight the layer path when the station is hovered
                        "mouseover": function(e){

                            var layer = e.target;

                            //console.log("dev: need to hightlight station in station window, if present");

                            layer.setStyle(tool.controls.styleStationHighlight);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        },

                        // remove the station highlight when mouse leaves
                        "mouseout": function(e){

                            var layer = e.target;
                
                            layer.setStyle(tool.controls.styleStationReset);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        }
                    });
                },
                pointToLayer: function (station, latlng) {
                    //console.log(tool.stationMarkerOptions[station.properties.network]);

                    return L.circleMarker(latlng, tool.controls.stationMarkerOptions[station.properties.network]);
                }
            
            });

            tool.controls.layer_station_markers = new L.markerClusterGroup();
            
            tool.controls.layer_station_markers
                .addLayer(layer_stations);
                //.addLayers([if we want to add multiple layers]);
            
            //this.map.addLayer(this.layer_station_markers);
            tool.controls.map.addLayer(tool.controls.layer_station_markers);

        });
    };

    /**
     * Add a network,station,parameter to the data cart
     * Attached to Add button in Station Window
     * @param station station object from geojson, includes geometry
     * @param param parameter
     */
    tool.controls.data_cart_add_param = function(station, param){

        var sp = station.properties,
            network = sp.network,
            station = sp.name;

        tool.controls.dataCartAddParam(network,station,param);
    };
    
    /**
     * Adds a network,station,parameter to the configuration
     * Called by data_cart_add_param and stationWindowUpdate_fromCart
     */
    tool.controls.dataCartAddParam = function(network,station,param){
        
      var data_cart_item = {};
         
      data_cart_item[network] = {};
      data_cart_item[network][station] = {};
      data_cart_item[network][station]["parameters"] = {};
      data_cart_item[network][station]["parameters"][param]={};
      
      // extend the cart item into the cart.. bascially, just appending the parameter.
      $.extend(true, tool.configuration.data_cart, data_cart_item);

      tool.controls.apply_button_update("modified");
    }

    /**
     * Extracts the bounds of the current map view 
     * Called by stationSearch
     * @param {object} reference to global map
     * @return {String} the map bounding box string "lng_min,lat_min,lng_max,lat_max" - bbox 
     */
    tool.controls.searchMapBounds = function(_map){
      // example return bbox string "-73.970947265625,40.54720023441049,-71.28753662109375,41.88592102814744"

      return _map.getBounds().toBBoxString();
    };

    /** 
     * Set a style of the feature to prove interaction
     * Not currently used?
     * @param {event click object e} 
     */
    tool.controls.highlightFeature = function(){
        var layer = e.target;

        //console.log(layer);

        layer.setStyle({ // highlight the feature
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        //map.info.update(layer.feature.properties); // Update infobox
    };

    /**
     * Identify checked networks or parameters
     * Called by stationSearch
     * @param selectionType network or parameter
     * generate comma separated list of selected parameters from:  parameters,networks
     */
    tool.controls.getSelections = function(selectionType){

        var selections = [];
        // find selected parameters
        $("#db-select-" + selectionType + " .db-select-list input:checked")
        .each(
          function(i, selected){
              selections.push($(selected).val());
          }
        );

        return selections.join(",");
    };

    /*
     * Update the station window div with station details when a dot is clicked
     * Attached to map dots in searchData
     *   @param station station object
     */
    tool.controls.stationWindowUpdate = function(station){

        //console.log("station", station);

        var station_dom_id = "station-" + station.properties.network + "-"+station.properties.name;

        if( $("#" + station_dom_id).length > 0){

            // item already exists in DOM, no need for request, just set visibility of div
            //console.log("station already present")

        }
        else{

            // $("#station_window_dropdown")
            // .append(
            //  $("<option/>")
            //      .val(station.properties.network + "|" + station.properties.name)
            //      .html(station.properties.network + " - " + station.properties.name)
            // )

            // coordinates -- + "(" + station.geometry.coordinates[0] + ", " + station.geometry.coordinates[1] + ")"
        
            // request station from data-services

            $.getJSON( "http://epedata.oceanobservatories.org/stations/" + station.properties.network + "/" + station.properties.name, function( data ) {

                // get reference to drop down
                // if exists, check for presence of current network/station

                // move to function to add to station dropdown.. also add to object to track additions / subtractions
                var dom_station_window = $("<div></div>")
                    .attr({
                        "id" : station_dom_id
                    });

                $.each(data.parameters, function(parameters, param){
                    
                    //console.log("param",param);

                    dom_station_window.append( $("<div/>") 
                        
                        .append( 

                            $("<label/>")
                                .attr("for","select-" + station_dom_id + "_" + param)
                                .html(param)
                        )
                        .append( 

                            $("<a/>")
                                .attr({
                                    "class":"btn btn-info btn-mini",
                                    "id":"select-" + station_dom_id + "_" +  param,
                                    "href" : "#a-"+ station_dom_id + "_" +  param
                                })
                                .html("Add")
                                .on("click", function(evt){

                                    //evt.stopPropagation();
                                    evt.stopImmediatePropagation();

                                    tool.controls.data_cart_add_param(station, param);
                                    tool.controls.dataCart();
                                })
                        )
                        .append( 

                            $("<a></a>")
                                .attr("title", param.description)
                                .attr("href", "#"+param)
                        )
                    )

                });

                $("#db-station-details")
                .empty()
                .append(
                    $("<h4/>")
                        .addClass("title")
                        .html("Network: (" + station.properties.network + ") " + station.properties.name)
                )
                .append(dom_station_window)
                .scrollTop(0);

            });
        }
    };

    /**
     * Create the URL to query available stations
     * Called by searchData
     */
    tool.controls.stationSearch = function (){
        var location = tool.controls.searchMapBounds(tool.controls.map),
            start_time = "1",
            end_time = "now",
            networks = tool.controls.getSelections("networks"),
            params = tool.controls.getSelections("parameters"),
            service_url,
            el_start_time = $("#db-date-start").val(),
            el_end_time = $("#db-date-end").val();

        // some testing of dates
        //  only testing for presense of values for now

        if(el_start_time != ""){
            start_time = el_start_time;
            
            if(el_end_time == ""){
                end_time = start_time;
            }
        }

        if(el_end_time != ""){
          end_time = el_end_time;

          if(el_start_time == ""){
            start_time = end_time;
          }
        }

        service_url = "/stations/search?location=" + location +
            "&start_time=" + start_time+
            "&end_time=" + end_time+
            "&networks=" + networks+
            "&parameters=" + params;

        //console.log("service_url: " + service_url);

        return service_url;
    };

    /**
     * Update the Data Cart div
     * Called by init_controls, stationWindowUpdate and stationWindowUpdate_fromCart
     */
    tool.controls.dataCart = function(){

      var dc = $("#data-cart"),
          cart_networks = $("<div />");

      $.each( tool.configuration.data_cart , function( network, station){
            
        var cart_network = $("<div />")
            .addClass("cart-network")
            //.html("<h4>"+network+"</h4>");

        var cart_network_stations = $("<div />")
            .addClass("cart-stations");

        $.each(station, function( station, station_obj){

          if(typeof station_obj.custom_name === "undefined"){
            station_obj.custom_name = network + " " + station;
          }          

          var cart_network_station = $("<div />")
          .addClass("cart-station")
          .html('<div class="station-name" >' + station_obj.custom_name +"</div>")
          .click(function(){
              tool.controls.stationWindowUpdate_fromCart(network,station);
          })
          .hover(
            function() {
              var sta = $(this);
              //console.log("sta****", sta);

              // is there already a span element? if so, remove it
              if(sta.parent().has( "span" ).length > 0) $(".cart-station-tools").remove();
                  
              var tmpSpan = $("<span />")
                //.html("&nbsp;&nbsp;")
                .css({
                    "position":"relative",
                    "top":"0",
                    "float":"right",
                    "margin":"2px"
                    //"border":"1px solid red",
                })
                //.addClass("cart-station-tools")
                .append(
                  $("<span />")
                    .css("float","left")
                    .attr("title","Edit Name for " + station)
                    .addClass("cart-station-tools ui-icon ui-icon-pencil")

                    .on("click", function(evt_station_edit_name_click){

                      var station_input; 
                      $(tmpSpan).remove();
                      // load input box and cancel button
                      var current_name = sta.find(".station-name").html();

                      //console.log("station remove click");
                      sta.find(".station-name")
                        .empty()
                        .append(

                          $("<div />")
                            .append(
                              station_input = $("<input />")
                                .attr("type","text")
                                .addClass("input input-medium")
                                .val(station_obj.custom_name)
                                .on("click", function(e){e.stopImmediatePropagation();})
                            )
                            .append(
                              $("<span />")
                              .css("float","right")
                                .addClass("cart-station-tools ui-icon ui-icon-circle-close")
                                .on("click",function(evt){
                                  sta.find(".station-name").html(station_obj.custom_name);

                                })
                            )
                            .append(
                              $("<span />")
                              .css("float","right")
                                .addClass("cart-station-tools ui-icon ui-icon-circle-check")
                                .on("click",function(evt){

                                  station_obj.custom_name = station_input.val();
                                  sta.find(".station-name").html(station_obj.custom_name);

                                })
                            )
                            .hover(function(hover_evt){
                              hover_evt.stopImmediatePropagation();
                            })

                        )


                      evt_station_edit_name_click.stopImmediatePropagation();

                      //delete tool.configuration.data_cart[network][station];

                      //$(".cart-param-tools").remove();

                      //sta.fadeOut();

                      tool.controls.apply_button_update("modified");

                      // simply remove this item.. no need for full redraw
                      //tool.dataCart();
                    })

                )
                .append(
                  $("<span />")
                    .css("float","left")
                    .attr("title","Remove Station " + station)
                    .addClass("cart-station-tools ui-icon ui-icon-circle-close")

                    .on("click", function(evt_station_remove_click){

                      //console.log("station remove click");

                      evt_station_remove_click.stopImmediatePropagation();

                      delete tool.configuration.data_cart[network][station];

                      $(".cart-param-tools").remove();

                      sta.fadeOut();

                      tool.controls.apply_button_update("modified");

                      // simply remove this item.. no need for full redraw
                      //tool.dataCart();
                    })
                )
                .prependTo(sta);
                
            },
            function() {
                $( this ).find( "span" ).remove();
            }
          )
            
          var station_params = $("<div></div>")
              .addClass("cart-params");

          $.each(station_obj.parameters, function(param){
                
            var station_param = $("<div></div>")
                .addClass("cart-param")
                .html(param)

                //mouseover of parameter item
                .hover(
                  function() {
                    var par = $(this);

                    $( par ).append( 
                      $("<span/>")
                      .html(
                          "&nbsp;&nbsp;"
                          
                      )//'<img src="' + EduVis.Environment.getPathTools() + 'Single_Time_Series/img/x_black.png" />'
                      .css({
                        "float":"right",
                        "margin":"2px",
                        //"border":"1px solid red",
                      })
                      .attr("title", "Remove " + param)
                      .addClass("cart-station-tools ui-icon ui-icon-circle-close")

                      .on("click", function(evt_param_remove_click){

                        //console.log("param remove click");
                        
                        // click of remove button will delete the item from the cart
                        // do we want an ok prompt?

                        evt_param_remove_click.stopImmediatePropagation();

                        delete tool.configuration.data_cart[network][station]["parameters"][param];

                        $(".cart-param-tools").remove();

                        par.fadeOut();

                        tool.controls.apply_button_update("modified");

                      })
                    );
                  },
                  function() {
                    $( this ).find( "span" ).remove();
                  }
                );

            station_params.append(station_param);                   

          });

          cart_network_station
            .append(station_params);

          cart_network_stations
            .append(cart_network_station);

        });

        cart_network
          .append(cart_network_stations);

        cart_networks
          .append(cart_network);

      });

      // clear and update data cart
      $("#db-data-cart")
      .empty()
      .append(cart_networks);

      $(".db-data-cart").draggable("option", "handle", "h4");

    };

    /**
     * Update the station window div with details when a parameter is clicked in the cart
     * Called by dataCart
     */
    tool.controls.stationWindowUpdate_fromCart = function(network,station){

      var station_dom_id = "station-" + network + "-"+station;

      if( $("#" + station_dom_id).length > 0){
          // item already exists in DOM, no need for request, just set visibility of div
          //console.log("station already present")
      }
      else{

        $.getJSON( "http://epedata.oceanobservatories.org/stations/" + network + "/" + station, function( data ) {

          //console.log("**** station data **** ", data);

          var stationObj = data;

          // get reference to drop down
          // if exists, check for presence of current network/station

          // move to function to add to station dropdown.. also add to object to track additions / subtractions
          //
          var dom_station_window = $("<div></div>")
              .attr({
                "id" : station_dom_id
              });

          $.each(data.parameters, function(parameters, param){
              
            //console.log("param",param);

            dom_station_window.append( 

              $("<div/>")
              .css({"overflow":"overlay"})
              
              .append( 
                $("<label/>")
                .attr("for","select-" + station_dom_id + "_" + param)
                .html(param)
              )
              .append( 

                // <button class="btn btn-mini" type="button">Mini button</button>
                $("<a/>")
                .attr({
                  "class":"btn btn-mini station-window-add",
                  "id":"select-" + station_dom_id + "_" +  param,
                  "type" : "button"
                })
                .html("Add")
                .on("click", function(evt){

                  //evt.stopPropagation();
                  evt.stopImmediatePropagation();

                  tool.controls.dataCartAddParam(network, station, param);
                  tool.controls.dataCart();
                })
              )
            )
          });

          $("#db-station-details")
          .empty()
          .append(
            $("<div>")
            .append(
              $("<h4/>")
              .addClass("title")
              .html("Network: (" + network + ") " + station)
            )
            .hover(
              function() {
                $(this).parent().prepend(
                  $('<span class="station-detail-hover" style="float:right">[this]</span>')
                )
              },
              function() {
                $( ".station-detail-hover" ).remove();
              }
            )
          )
          .append(dom_station_window);
        });
      }
    };

    /*
     * Update the Apply button by enabling or disabling via class and changing icon between exlamation mark or checkmark
     * 
    */
    tool.controls.apply_button_update = function(status){

      // status up-to-date or modified?
      if(status == "modified"){

        $("#btn-apply")
          .attr('class', 'btn btn-medium')
          .html('Apply');

          // <i class="icon-exclamation-sign"></i>'
        
      }
      else if(status == "up-to-date"){

        $("#btn-apply")
          .attr('class', 'btn btn-medium disabled')
          .html('Apply');
           //<i class="icon-ok-sign"></i>'

          $("#apply-check").show().fadeOut(3000);

      }
    }

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
