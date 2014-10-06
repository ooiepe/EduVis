/*

 * OOI EPE - Single Time Series with Map (STSM)
 * Revised 9/11/2014
 * Written by Mike Mills and Sage Lichtenwalner

*/

(function (eduVis) {
    
    "use strict";

    var tool = {
        "name" : "Single_Time_Series_Map",
        "version" : "0.3.5",
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
                "resource_type" : "tool",
                "name": "leaflet_markercluster",
                "url" : "js/leaflet.markercluster.js",
                "namespace" : "L",
                "dependsOn" : ["leaflet_js"],
                "attributes":{}
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
                "name" : "Single_Time_Series_Map_css",
                "src" : "Single_Time_Series_Map.css"
              },
              {
                "name" : "jquery-ui-css",
                "src": "http://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css"
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
          "data_cart" : [
            { 
              "network":"NDBC",
              "station": "44033",
              "custom_name":"NDBC 44033",
              "parameters": {
                "water_temperature":{},
                "air_temperature":{}
              }
            },
            {
              "network": "NDBC",
              "station": "44025",
              "custom_name":"NDBC 44025",
              "parameters": {
                "water_temperature":{},
                "air_temperature":{}
              }
            },
            {
              "network": "CO-OPS",
              "station": "2695540",
              "custom_name": "CO-OPS 2695540",
              "parameters": {
                "air_pressure": {},
                "air_temperature": {}
              }
            }
          ]
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
      
      g.parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%SZ").parse;
      g.parseDateConfig = d3.time.format.utc("%Y-%m-%d").parse;

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


      $.each(tool.configuration.data_cart, function(index, station_obj){

        var s = station_obj;
        //$.each(network_obj,function(station, station_obj){

          // request station data
          //http://epedata.oceanobservatories.org/stations/
          $.getJSON( "http://epedev.oceanobservatories.org/timeseries/stations/" + s.network + "/" + s.station, function( data ) {

            //console.log("**** station data **** ", data);

            var options = $.extend(true, {
                "station":s.station,
                "network":s.network,
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
            if(tool.configuration.station == s.station){
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

            // zoom to the bounds of the current stations. this should be loaded into a queue and called with map_stations_loaded();
            tool.map_stations_loaded();

          });
        

      });
      
      // hack to invalidate the map bounds and show the appropriate zoom.
      $('.nav-tabs a[href="#ev-instance-preview"]').on("click",function (e) {
        //e.preventDefault();
        //$(this).tab('show');
        setTimeout(function(){
          tool.leaflet_map.map.invalidateSize();
          tool.leaflet_map.map.fitBounds(tool.leaflet_map.station_markers.getBounds());
        },500);
      })
    };

    tool.map_stations_loaded = function(){

      // need to consider a better method for queuing station callbacks
      var stations_loaded = false;

      // loop through cart. if isLoaded is true for all stations, run callbacks

      // $.each(tool.configuration.data_cart, function(network, network_obj){
      //   $.each(network_obj,function(station, station_obj){
      //     if(station_obj){
      //       console.log(station_obj);
      //     }
      //   }
      // }

      // for now, force zoom event when each station is added.
      stations_loaded = true;

      // if all stations have loaded, updated the map extent
      if(stations_loaded){

        //zoom to bounds of stations
        tool.leaflet_map.map.fitBounds(tool.leaflet_map.station_markers.getBounds());
      }
      
    };

    tool.update_map = function(){

      tool.leaflet_map.station_markers.eachLayer(function(layer){
        //layer.removeLayer();

        tool.leaflet_map.map.removeLayer(layer);
        tool.leaflet_map.station_markers.removeLayer(layer);
        //console.log("LAYER-->", layer);
      })

      tool.leaflet_map.map.invalidateSize();

      tool.init_map();
    
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
          
          //console.log("LAYER", layer, layer.getLatLng(), layer.latitude);

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

        // // are we sure we want to updated the graph here?
        // tool.draw();
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
        start = config.realtime_days;
        end = "now";  
      }
      else{
        start = config.start_date;
        end = config.end_date;
      }

      //'http://epedata.oceanobservatories.org/timeseries?'
       return 'http://epedev.oceanobservatories.org/timeseries/timeseries?' + 
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
    tool.update_graph = function(data) {

      if(typeof data === "undefined"){

        // insert an icon to let user know to select param

        $("#"+tool.dom_target+"_tool-status").html(
          $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
        );

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
          //console.log(stats);

          // update x and y axis 
          d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
          d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);
          
          d3.selectAll('.axis line, .axis path')
            .style("fill","none")
            .style("stroke","#999")
            .style("stroke-width","1px");
            //.style("shape-rendering","crispEdges")
          d3.selectAll('.y.axis line')
            .style("stroke-opacity",".4");

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

                // update station in map
                tool.graph_update_sta(evt.target.value);

                // update network and station in config
                if(tool.select_updateParameters()){

                  // station has parameter available, update graph accordingly
                  tool.draw();
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
      $.each(config.data_cart, function(index, s){

          // create new option and add it to the options array
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
          selected_param,
          data_cart_index = tool.station_get_index(station);

          // need to condition for param that is not available in a newly updated list (when station changes and the new station does not have the previously selected param.. in that case, just take the first parameter of the list.. and put an exclaimation next to the dropdown to indicated update ened)

        // reference to param
        // does current param exist in list?
      
      $(".param-icon").remove();

      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append("<option>..updating..</option>");

      // populate options array with parameters
      $.each(dc[data_cart_index].parameters, function(parameter){
        
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

        tool.update_map();
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
       
    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
