/**
 * Glider Profile Explorer (GPE) - Rutgers Version
 * Revised 2/6/2015
 * Written by Michael Mills and Sage Lichtenwalner
*/
(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Glider_Profile_Explorer_RU",
        "version" : "0.1",
        "description" : "Rutgers Glider Profile Explorer",
        "resources" : {
          "tool": {
            "scripts" : [
              {
                "name" : "d3",
                "url" : "http://d3js.org/d3.v3.min.js",
                "global_reference" : "d3"
              },
              {
                "name": "leaflet_js",
                "url": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"
              },
              {
                "name" : "jquery_1.11.1",
                "url" : "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
              },
              {
                "name" : "jquery_ui_1.11.0",
                "url" : "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js",
                "dependsOn":["jquery_1.11.1"]
              }
            ],
            "stylesheets" : [
              {
                "name": "jquery-smoothness",
                "src": "https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/themes/smoothness/jquery-ui.css"
              },
              {
                "name": "leaflet-css",
                "src": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css"
              },
              {
                "name": "bootstrap-glyphicons",
                "src": "http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css"
              }
            ]
          },
          "controls": {
             "scripts" : [
                {
                  "resource_type" : "tool",
                  "name": "Glider_Dataset_Chooser_RU",
                  "url" : "Glider_Dataset_Chooser_RU.js",
                  "attributes":{}
                },
                {
                  "resource_type" : "tool",
                  "name" : "mustache",
                  "url" : "mustache.js",
                  "global_reference" : "mustache"
                }
              ],
              "stylesheets" : [
              {
                "name": "gpe-css",
                "src": "Glider_Dataset_Chooser_RU.css"
              },
              ]
          }
        },
        "configuration" : {
          'institution':'Rutgers University', 
          'glider':'ru29', 
          'dataset_id':'ru29-20131110T1400',
          'date_start':'2014-01-01',
          'date_end':'2014-02-01',
          'graph_title':'RU29 - South Atlantic Leg 2',
          'parameter' : "temperature",
          'profile_id' : 1
        },
        "tools" : {},
        "parameter_metadata" : {
          "profile_id" : {
            "column": "profile_id (1)",
            "units": "",
            "title":"Profile ID"
          },
          "time" : {
            "column" : "time (UTC)",
            "units" : "UTC",
            "title" :" Time (UTC)"
          },
          "latitude" : {
            "column" : "latitude (degrees_north)",
            "units" : "\u00B0N",
            "title" : "Latitude"
          },
          "longitude" : {
            "column" : "longitude (degrees_east)",
            "units" : "\u00B0E",
            "title" : "Longitude"
          },
          "depth" : {
            "column" : "depth (m)",
            "units" : "m",
            "title" : "Depth (m)"
          },
          "salinity" : {
            "column" : "salinity (1e-3)",
            "units" : "1e-3",
            "title" : "Salinity"
          },
          "temperature" : {
            "column" : "temperature (Celsius)",
            "units" : "\u00B0C",
            "title" : "Sea Water Temperature"
          },
          "conductivity" : {
            "column" : "conductivity (S m-1)",
            "units" : "S m-1",
            "title" : "Conductivity"
          },
          "density" : {
            "column" : "density (kg m-3)",
            "units" : "kg m-3",
            "title" : "Density"
          },
          "chlorophyll_a" : {
            "column" : "chlorophyll_a (ug L-1)",
            "units" : "ug L-1",
            "title" : "Chlorophyll A" // Chlorophyll a Concentration
          },
          "oxygen_concentration" : {
            "column" : "oxygen_concentration (uMol L-1)",
            "units" : "uMol L-1",
            "title" : "Oxygen Concentration"
          },
          "oxygen_saturation" : {
            "column" : "oxygen_saturation (%)",
            "units" : "%",
            "title" : "Oxygen Saturation" //Estimated Percentage Oxygen Saturation
          },
          "volumetric_backscatter" : {
            "column" : "volumetric_backscatter_650nm (m-1 sr-1)",
            "units" : "m-1 sr-1",
            "title" : "Volumetric Backscatter 650nm"
          },
          //"parameters" : ["temperature", "salinity", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter"]
          "parameters" : ["temperature", "salinity", "density", "conductivity"]
        },
        "mapping": {
          "oceanBasemap_url" : 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
          "styles" : {

            "profile" : {
              radius: 3,
              fillColor: "#ff0000",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            },

            "profile_selected" : {
              radius: 7,
              fillColor: "#ff7800",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            },
            "profile_click" : {
              radius: 8,
              fillColor: "#00aaee",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            },
            "profile_hover" : {
              radius: 7,
              fillColor: "#ff7800",
              color: "#000",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.8
            }
          },
       }
    };

    /**
     * Initialize tool
     * Called automatically by EduVis
     */
    tool.init_tool = function() {
      this.setup(this.dom_target);
      EduVis.tool.load_complete(this);
    };
    
    /**
     * Initial setup of the visualization tool
     * Called by init_tool
     */
    tool.setup = function( _target ){
      tool.setup_ui(_target);
      tool.setup_graph(); // initialize the visualization
      tool.setup_map(); // initialize the map

      // hack to invalidate the map bounds.
      $('.nav-tabs a[href="#ev-instance-preview"]')
        .on("click", function (e) {
          //e.preventDefault();
          //$(this).tab('show');
          setTimeout(function() {
            tool.leaflet_map.map.invalidateSize();
            tool.leaflet_map.map.fitBounds(tool.leaflet_map.layer_locations.getBounds());
         }, 10);

        });
    };

    /**
     * Setup the Tool UI
     * Called by setup
     */
    tool.setup_ui = function(_target){
      //var c=this.configuration;
      $("<div />")
        .css({
          "width":"840px",
          "margin":"0",
          "height":"500px"
        })
        .append(
          $("<div />")
            .attr("id", "map-container")
            .css({
              "float":"left",
              "height":"450px",
              "width":"400px"
            })
            .append(

              $("<div />")
                .attr("id", "gpe-map-title")
                //.html(tool.configuration.dataset_id + " Profile Locations")
                //.html("Select a point to plot the corresponding profile")
            )
            .append(
              $("<div />")
                .attr("id", "gpe-map")
                .height(400)
                .width(400)
            )
            .append(
              $("<div />")
                .attr("id", "gpe-map-tools")
                .append(
                  $("<div />")
                    .css({"margin-top":"12px","width":"400px"})
                    .append(
                      $("<div />")
                        .css({
                          "float":"left",
                          "width":"75px",
                          "font-size": "20px",
                          "text-align":"center",
                          "cursor": "pointer"
                        })
                        .append(
                          $("<span />")
                            .attr("class","glyphicon glyphicon-chevron-left")
                            .on("click", function(){
                              var slider = $("#"+ _target + "-profile-slider"),
                                  val = slider.slider("option","value");
                              if ( val != slider.slider("option","min")){
                                  slider.slider("value", +val - 1 );
                              }
                            })
                        )
                    )
                    .append(
                      $("<div />")
                        .css({"float":"left","width":"250px","font-size": "12px"})
                        .append(
                          // append slider control
                          $("<div />")
                            .attr("id", _target + "-profile-slider")
                            .css({"margin-bottom": "6px"})
                        )
                        .append(
                          $("<span />")
                            .attr("id", _target + "-profile-slider-left")
                            .html("")
                            .css({"float":"left"})
                        )
                        .append(
                          $("<span />")
                            .attr("id", _target + "-profile-slider-right")
                            .html("")
                            .css({"float":"right"})
                        )
                    )
                    .append(
                      $("<div />")
                        .css({
                          "float":"right",
                          "width":"75px",
                          "font-size": "20px",
                          "text-align":"center",
                          "cursor": "pointer"
                        })
                        .append(
                          $("<span />")
                            .attr("class","glyphicon glyphicon-chevron-right")
                            .on("click", function(){
                              var slider = $("#"+ _target + "-profile-slider"),
                                  val = slider.slider("option","value");
                              if ( val != slider.slider("option","max")){
                                  slider.slider("value", +val + 1 );
                              }
                            })
                        )
                    )
                )
            )
        )
        .append(
          $("<div />")
            .attr("id", _target + "-chart")
            .css({
              "height":"450px",
              "width":"420px",
              "float":"right"
            })
            .append(
              $("<div />")
                .attr("id", _target + "-viz-container")
            )
            .append(
              $("<div />")
                .attr("id", _target + "-viz-controls")
                .css({"text-align":"center"})
                .append("Parameter: ")
                .append(
                    $("<select />")
                      .attr("id", _target + "-control-parameter-dropdown")
                )
            )
        )
        .appendTo("#"+_target);
    };

    /**
     * Setup the tool graph
     * Called by setup
     */
    tool.setup_graph = function(){

      var g = tool.graph = {},
        _target = tool.dom_target;

      var erddap_ref = tool.parameter_metadata,
          column_depth = erddap_ref.depth.column,
          config = tool.configuration,
          column = erddap_ref[config.parameter],
          column_selected = column.column,
          column_selected_title = column.title;

      g.margin = {top: 40, right: 10, bottom: 40, left: 46};
      g.width = 400 - g.margin.left - g.margin.right;
      g.height = 450 - g.margin.top - g.margin.bottom;

      //g.parseDate = d3.time.format.iso.parse;

      g.x = d3.scale.linear().range([0, g.width]);
      g.y = d3.scale.linear().range([0, g.height]);

      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(8);//.tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left");//.tickSize(0,0,0);

      g.svg = d3.select("#"+_target + "-viz-container").append("svg")
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

      g.chart.append("path")
        .attr("class", "line")
        .attr("d", g.line)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

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
        .on("mouseout", function() { g.mouse_focus.style("display", "none"); });

      g.line = d3.svg.line()
        //.interpolate("monotone")
        .x(function(d) { return g.x(d[erddap_ref[config.parameter].column]); })
        .y(function(d) { return g.y(d[column_depth]); });

      g.title = g.svg.append("text")
        .attr("class", "gtitle_dataset")
        .attr("text-anchor", "start")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 0) + "," + (0) + ") ")
        .text(tool.configuration.graph_title);
        //.attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")

      g.subtitle1 = g.svg.append("text")
        .attr("class", "gsubtitle1")
        .attr("text-anchor", "start")
        .style("font-size", "11px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 0) + "," + (18) + ") ")
        .text("");

      g.subtitle2 = g.svg.append("text")
        .attr("class", "gsubtitle2")
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + g.width) + "," + (18) + ") ")
        .text(""); 

      // g.stats = g.svg.append("text")
      //   .attr("id", _target+"_stats1")
      //   .attr("class", "glabel")
      //   .attr("text-anchor", "middle")
      //   .style("font-size", "11px")
      //   .attr("dy", "-6px")
      //   .attr("transform", "translate(" + (g.width/4+g.margin.left) + "," + (34) + ") ")
      //   .text( "Statistics");

      // g.legend = g.svg.append("path")
      //   .attr({
      //     "stroke": tool.configuration.line_color1,
      //     "stroke-width":"3",
      //     "fill":"none",
      //     "d":"M6.5,13L13,13L19.5,21.6L26,4.3L32.5,4.3"
      //   })
      //   .attr("transform", "translate(" + (g.margin.left) + "," + (0) + ") ")

      g.ylabel = g.svg.append("text")
        .attr("id", _target+"_ylabel1")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text("Depth (m)");

      g.xlabel = g.svg.append("text")
        .attr("id", _target+"_xlabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( column_selected);

      // initialize visualization controls

      // create reference to dropdown
      var parameter_dropdown = $("#"+ _target + "-control-parameter-dropdown");

      // add parameters to dropdowns
      $.each(erddap_ref.parameters, function (index, parameter_option) {

        parameter_dropdown
          .append(
            $('<option></option>')
              .val(parameter_option)
              .html(
                erddap_ref[parameter_option].title
              )
          );
      });

      // set initial value of dropdown and set change event to update chart
      parameter_dropdown
        .val( tool.configuration.parameter )
        .on("change", function(a){

          tool.configuration.parameter = $(this).val();
          tool.update_graph(tool.configuration.profile_id,tool.configuration.profile_lat,tool.configuration.profile_lng);
        });

    };

    /**
     * Setup the tool map
     * Called by setup
     */
    tool.setup_map = function(){

        /*
          Leaflet Map
        */

        // create object to hold leaflet map, layer references, and profile ids
        tool.leaflet_map = {

          "map" : {},
          "oceanBasemap_layer" : {},
          "layer_collection":[],
          "profile_ids" : {},

        };

        // initialize map
        tool.leaflet_map.map = L.map('gpe-map', {
          "center": [38.5,-78.2],
          "zoom": 3
          // ,noWrap : true
        });

        // set esri tile service url for ocean basemap
        // set leaflet layer of esri ocean basmap
        tool.leaflet_map.oceanBasemap_layer = new L.TileLayer(tool.mapping.oceanBasemap_url,{
          maxZoom: 12,
          attribution: 'Tile Layer: &copy; Esri'
        }).addTo(tool.leaflet_map.map);

        tool.update_map();

        //tool.slider_update();
        //tool.set_slider()

        //!* chart_update
        //!* slider_update

    };

    /**
     * Update the map
     * Called by setup_map and config_callback
     */
    tool.update_map = function(){

      // create shortcuts for map references
      var mapObj = tool.leaflet_map,
          map = mapObj.map;

      if(typeof mapObj.poly_line === "undefined"){
        mapObj.poly_line = L.polyline( [], {color: 'white'})
          .addTo(mapObj.map);
      }
      else{
        mapObj.map.removeLayer(mapObj.poly_line);

        mapObj.poly_line = L.polyline( [], {color: 'white'})
          .addTo(mapObj.map);
      }

      $.getJSON( tool.erddap_request_track() , function(geodata){

        // console.log(geodata);
        mapObj.profile_ids = d3.map();

        mapObj.locationsFeatureCollection = geodata;

        if(typeof mapObj.layer_locations !== "undefined"){
          mapObj.map.removeLayer(mapObj.layer_locations);
        }

        // shortcuts
        var pl = tool.leaflet_map.poly_line,
            layer_loc = tool.leaflet_map.layer_locations,
            map_styles = tool.mapping.styles;

        mapObj.layer_locations = new L.geoJson(mapObj.locationsFeatureCollection,{
          onEachFeature: function (location, location_feature) {

            //console.log("profile_id, time", location.properties.profile_id, location.properties.time);

            // add the key value pair.. profile_id, time
            mapObj.profile_ids.set(location.properties.profile_id, location.properties.time);

            // add the profile location to the profile track

            pl.addLatLng(L.latLng(location.geometry.coordinates[1],location.geometry.coordinates[0]));

            // add click event for the profile
            location_feature.on({

              "click": function(e){

                // update the profile style on click
                //profile.setStyle(tool.mapping.styles.profile_click);

                var profile_id = e.target.feature.properties.profile_id;

                // only update the style for the selected profile
                e.target.setStyle(function(feature) {
                  if (feature.properties.profile_id == profile_id) {
                    return map_styles.profile_click;
                  }
                  return map_styles.profile;
                });

                // update the graph and slider
                tool.update_graph(profile_id, d3.round(e.latlng.lat,4), d3.round(e.latlng.lng,4));
                tool.update_slider(profile_id);

              },

              // // highlight the layer path when the station is hovered
              // "mouseover": function(e){

              //   var layer = e.target;

              //   //console.log("dev: need to hightlight station in station window, if present");
              //   //layer.setStyle(tool.controls.styleStationHighlight);

              //   if (!L.Browser.ie && !L.Browser.opera) {
              //       layer.bringToFront();
              //   }

              // },

              // remove the station highlight when mouse leaves
              "mouseout": function(e){

                var layer = e.target;

                //layer.setStyle(tool.controls.styleStationReset);

                if (!L.Browser.ie && !L.Browser.opera) {
                  layer.bringToFront();
                }

              }
            });
          },
          pointToLayer: function (location, latlng) {
            return L.circleMarker(latlng, tool.mapping.styles.profile);
          }
        });

        // initialize and setup map controls

        tool.sliderKeys = mapObj.profile_ids.keys();

        tool.set_slider(0, mapObj.profile_ids.size()-1, d3.min(mapObj.profile_ids.values() ), d3.max(mapObj.profile_ids.values() ));

        //console.log("map profiles map", mapObj.profile_ids);

        // add layer to map
        map.addLayer(mapObj.layer_locations);

        // zoom to layer bounds
        map.fitBounds(mapObj.layer_locations.getBounds());

        // initialize map with first profile
        tool.init_graph(mapObj.profile_ids.keys()[0]);

      }); // end get json

    };

    /**
     * Initialize the graph
     * Called by update_map
     */
    tool.init_graph = function(pid){

      //profile.setStyle(tool.mapping.styles.profile_click);
      var profile_id = pid,
          lat, lng;

      // only update the style for the
      tool.leaflet_map.layer_locations.setStyle(function(feature) {
        if (feature.properties.profile_id == profile_id) {
          lng = d3.round(feature.geometry.coordinates[0],4);
          lat = d3.round(feature.geometry.coordinates[1],4);

          return tool.mapping.styles.profile_click;
        }
        return tool.mapping.styles.profile;
      });

      tool.update_graph(profile_id, lat, lng);

      tool.update_slider(profile_id);

    };

    /**
     * Update the graph
     * Called by init_graph and also via map marker, pulldown change and slider change 
     */
    tool.update_graph = function(pid, lat, lng){

      var g = tool.graph,
      profile_id = typeof pid === "undefined" ? tool.configuration.profile_id : pid,
      dataset_id = tool.configuration.dataset_id;

      d3.csv( tool.erddap_request_profile(dataset_id, profile_id), function(error,data){

        //console.log("error", error, data);

        //console.log(JSON.stringify(data));

        var erddap_ref = tool.parameter_metadata,
            column_depth = erddap_ref.depth.column,
            config = tool.configuration,
            column = erddap_ref[config.parameter],
            column_selected = column.column,
            column_selected_title = column.title,
            column_selected_units = column.units,
            column_time = erddap_ref.time.column,
            bisectData = d3.bisector(function(d) { return d[column_depth]; }).left,
            profile_date;

        // clean depth and selected column values
        data.forEach(function(d) {
          //d[column_date] = g.parseDate(d[column_date]);
          d[column_depth] = +d[column_depth];
          d[column_selected] = +d[column_selected];
        });

        // update x and y domains depth and the selected
        g.x.domain(d3.extent(data, (function(d) { return d[column_selected]; })));

        // update the y domain to use the range of the returned data.
        g.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

        // update chart line
        g.svg.selectAll("path.line")
          .data([data])
          //.transition()
          //.duration(1000)
          //.ease("linear")
          .attr("d", g.line);

        // update chart title with profile id and date
        profile_date = data[0]["time (UTC)"];

        g.title.text(
          tool.configuration.graph_title
        );
        
        var date_format = d3.time.format.utc("%B %e, %Y %H:%M UTC"),
        iso_format = d3.time.format.iso.parse;
        
        g.subtitle1.text(
          "Profile #"+ pid + ' - ' + date_format(iso_format(profile_date))
        );

        g.subtitle2.text(
          Math.abs(d3.round(lat,4)) + (lat>0 ? '&deg;N ' : '\xBAS ') + 
          Math.abs(d3.round(lng,4)) + (lng>0 ? '&deg;E ' : '\xBAW ')
        ); 

        g.xlabel.text(
          column_selected_title +
          (erddap_ref[config.parameter].units !== "" ? " (" + erddap_ref[config.parameter].units + ")" : "")
        );

        // // update x and y axis
        d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
        d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);

        d3.selectAll('.axis line, .axis path')
          //.style("shape-rendering","crispEdges")
          .style("fill","none")
          .style("stroke","#999")
          .style("stroke-width","1px");
        d3.selectAll('.y.axis line')
          .style("stroke-opacity",".4");


        //mouse move
        g.mousemover.on("mousemove", function(){

        var chartMiddle = g.width / 2,
            mouseY = d3.mouse(this)[1],
            y0 = g.y.invert(mouseY),
            i = bisectData(data, y0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = y0 - d0[column_depth] > d1[column_depth] - y0 ? d1 : d0,
            chartMidPoint = (g.x.domain()[1] + g.x.domain()[0])/2,
            xPosition = d[column_selected] > chartMidPoint ? -100 : 0;

        g.mouse_focus.attr("transform", "translate(" + g.x(d[column_selected]) + "," + g.y(d[column_depth]) + ")");

        g.mouse_focus.select("text").text(d3.round(d[column_depth], 1) + " m, " + d3.round(d[column_selected], 2) + " " + column_selected_units)
          .attr("transform", "translate(" + xPosition + "," + 0 + ")")

        });

      });

    };

    /**
     * Set the slider
     * Called by update_map
     */
    tool.set_slider = function( min, max, date_start, date_end) {

      //console.log(min, max, date_start, date_end, "slider");

      var iso_format = d3.time.format.iso.parse,
          date_format = d3.time.format.utc("%B %e, %Y"),
          start = iso_format(date_start),
          end = iso_format(date_end);

      $("#"+ tool.dom_target +"-profile-slider-left").html(date_format(start));
      $("#"+ tool.dom_target +"-profile-slider-right").html(date_format(end));

      $("#"+ tool.dom_target +"-profile-slider")
        .slider({
          min: 0,
          max: max,
          //value:self.getProfileKey(self.configuration.profile_id)
          //value: self.configuration.profile_id,
          slide: function(event, ui) {

            // tool.leaflet_map.selected_profile.setStyle(function(feature) {
            //   if (feature.properties.profile_id == profile_id) {
            //   //  lng = d3.round(feature.geometry.coordinates[0],4);
            //   //   lat = d3.round(feature.geometry.coordinates[1],4);
            //     return tool.mapping.styles.profile_click;
            //   }
            //   return tool.mapping.styles.profile_selected;
            // });

            // lookup up slider value in map, get associated profile id
            // ui value is current slider position
            var profile_id = tool.sliderKeys[ui.value];

            tool.configuration.profile_id = profile_id;

            tool.leaflet_map.layer_locations.setStyle(function(feature) {
              if (feature.properties.profile_id == profile_id) {
                return tool.mapping.styles.profile_selected;
              }
              return tool.mapping.styles.profile;
            });

          },
          change: function(event, ui) {

            //tool.configuration.profile_id = get this value
            // var profile = e.target,
            // lng = d3.round(profile.feature.geometry.coordinates[0],4),
            // lat = d3.round(profile.feature.geometry.coordinates[1],4);

            //profile.setStyle(tool.mapping.styles.profile_click);
            var profile_id = tool.sliderKeys[ui.value],
                lat, lng;

            tool.configuration.profile_id = profile_id;

            // only update the style for the
            tool.leaflet_map.layer_locations.setStyle(function(feature) {
              if (feature.properties.profile_id == profile_id) {
                lng = d3.round(feature.geometry.coordinates[0],4);
                lat = d3.round(feature.geometry.coordinates[1],4);
                tool.configuration.profile_lat = lat;  //Save coordinates for later use
                tool.configuration.profile_lng = lng;
                tool.leaflet_map.map.panTo([lat,lng]);
                return tool.mapping.styles.profile_click;
              }
              return tool.mapping.styles.profile;
            });

            tool.update_graph(profile_id, lat, lng);

          }
        }
      );
    };

    /**
     * Update the slider
     * Called by update_map and init_graph
     */
    tool.update_slider = function(profile_id){

      // get profile index from array
      var len = tool.sliderKeys.length-1, x=0, stop=false;
      for(; (x < len) || !stop; x++){
        //console.log("tool.sliderKeys[x]", tool.sliderKeys[x], x, stop)
        if(tool.sliderKeys[x]==profile_id){
          $("#"+ tool.dom_target +"-profile-slider")
            .slider("value",  x);
          stop=true;
          //console.log(x, stop)
        }
      }
    };

    /**
     * Request profile data from Erddap
     * Called by update_graph
     */
    tool.erddap_request_profile = function(dataset_id, profile_id, columns_selected){
      var tabledap_url = "http://erddap.marine.rutgers.edu/erddap/tabledap/",
      dataset_url = dataset_id + ".csvp?",
      //columns_default = ["time","depth", "salinity", "temperature", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter_650nm"],
      columns_default = ["time","depth", "salinity", "temperature", "conductivity","density"],
      columns = typeof columns_selected === "object" ? columns_selected : columns_default,
      query = "&profile_id=" + profile_id + "&" + columns.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";
      //console.log("QUERY FOR CSV: ", query);
      return tabledap_url + dataset_url + "profile_id," +columns.join(",") + query;
    };

    /**
     * Locations query
     * Called by Configuration tool
     */
    tool.erddap_request_track = function(){
      return "http://erddap.marine.rutgers.edu/erddap/tabledap/" + tool.configuration.dataset_id + ".geoJson?profile_id,time,latitude,longitude&time%3E="+tool.configuration.date_start + "&time%3C="+tool.configuration.date_end;
    }

    /**
     * Initial setup of tool configuration panel
     * Called automatically by EduVis when edit is enabled
     */
    tool.init_controls = function(target_div){
      tool.controls = {};
      tool.controls.Glider_Dataset_Chooser_RU = EduVis.controls.Glider_Dataset_Chooser_RU;
      tool.controls.Glider_Dataset_Chooser_RU.init(tool);
    };

    /**
     * Configuration callback
     * Called by Apply button on configuration screen
     */
    tool.config_callback = function(){
      tool.update_map();
    };

    // Extend the base EduVis object with this tool
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
