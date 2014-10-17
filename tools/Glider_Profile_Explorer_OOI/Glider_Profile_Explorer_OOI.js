/*

 * Glider Profile Explorer OOI (GPE OOI)
 * Revised 10/17/2014
 * Written by Michael Mills, Rutgers University

*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Glider_Profile_Explorer_OOI",
        "description" : "Glider Profile Explorer",
        "url" : "",

        "version" : "0.4.2",
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
              },

              {
                "name": "leaflet_js",
                "url": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"
              },
              {
                "name" : "jquery_1.11",
                "url" : "http://code.jquery.com/jquery-1.11.1.min.js",
              },
              {
                "name" : "jquery_ui_js",
                "url" : "http://code.jquery.com/ui/1.11.0/jquery-ui.min.js",
                "dependsOn":["jquery_1.11"]
              }
            ],

            "stylesheets" : [
              {   "name": "jquery-smoothness",
                  "src": "http://code.jquery.com/ui/1.11.0/themes/smoothness/jquery-ui.css"
              },
              {
                  "name": "leaflet-css",
                  "src": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css"
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
                  "name": "Control_Data_Browser",
                  "url" : "js/Control_Glider_Dataset_Browser.js",
                  "attributes":{}
                }

              ],

              "stylesheets" : [
                {
                  "name" : "Glider_Profile_Explorer_OOI",
                  "src" : "Glider_Profile_Explorer_OOI.css"
                },
              ]
          },

          "datasets" : []

        },

        "configuration" : {
          "dataset_id" : "CE05MOAS-ce_319-20140420T2200",
          "profile_id" : "157",
          "parameter" : "temperature",
          "date_start": "2014-04-24",
          "date_end": "2014-05-19"
        },

        "data" : {},
        "target_div" : "",
        "tools" : {},
        "settings" : {},
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
        "locations_query" : function(){

            //http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2200.geoJson?profile_id,time,latitude,longitude
            return "http://erddap.marine.rutgers.edu/erddap/tabledap/" + tool.configuration.dataset_id + ".geoJson?profile_id,time,latitude,longitude&time%3E="+tool.configuration.date_start + "&time%3C="+tool.configuration.date_end;
         }
       }

    };

    tool.Glider_Profile_Explorer_OOI = function( _target ){

      // parameters

      // 0 profile_id (1)
      // 1 time (UTC)
      // 2 latitude (degrees_north) -- na
      // 3 longitude (degrees_east)
      // 4 depth (m)
      // 5 salinity (1)
      // 6 temperature (Celsius)
      // 7 conductivity (S m-1)
      // 8 density (kg m-3)

      tool.settings.erddap_parameter_metadata = {
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
          "units" : "degrees north",
          "title" : "Latitude"
        },
        "longitude" : {
          "column" : "longitude (degrees_east)",
          "units" : "degrees east",
          "title" : "Longitude"
        },
        "depth" : {
          "column" : "depth (m)",
          "units" : "m",
          "title" : "Depth (m)"
        },
        "salinity" : {
          "column" : "salinity (1e-3)",
          "units" : "",
          "title" : "Salinity" // Sea Water Practical Salinity
        },
        "temperature" : {
          "column" : "temperature (Celsius)",
          "units" : "Degrees celsius",
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
          "units" : "",
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
        "parameters" : ["temperature", "salinity", "conductivity"]
      };


      // setup UI
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
                .html(tool.configuration.dataset_id + " Profile Locations")
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
                      $("<span />")
                        .css({
                            "float":"left",
                            "width":"80px",
                            "font-size": "12px",
                            "text-align":"center",
                            "cursor": "pointer"
                          })
                        .html( '<a style="margin:0 auto;" class="ui-icon ui-icon-arrowthick-1-w"></a>')
                        .on("click", function(){
                         var slider = $("#"+ _target + "-profile-slider"),
                            val = slider.slider("option","value");

                          if ( val != slider.slider("option","min")){
                              slider.slider("value", +val - 1 );
                          }
                        })
                        .append(
                          $("<span />")
                            .attr("id", _target + "-profile-slider-left")
                            .html("")
                        )

                    )
                    .append(
                      // append slider control
                      $("<div />")
                        .css({
                          "float":"left",
                          "width": "230px"
                        })
                        .attr("id", _target + "-profile-slider")
                    )
                    .append(
                      $("<span />")
                        .css({
                          "float":"right",
                          "width":"80px",
                          "font-size": "12px",
                          "text-align":"center",
                          "cursor": "pointer"
                        })
                        .html( '<i style="margin:0 auto;" class="ui-icon ui-icon-arrowthick-1-e"></i>')
                        .on("click", function(){

                          var slider = $("#"+ _target + "-profile-slider"),
                            val = slider.slider("option","value");

                          if ( val != slider.slider("option","max")){
                              slider.slider("value", +val + 1 );
                          }
                        })
                        .append(
                          $("<span />")
                            .attr("id", _target + "-profile-slider-right")
                            .html("")
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
                .append(
                    $("<select />")
                      .attr("id", _target + "-control-parameter-dropdown")
                )
            )
            //.html("visualization")
        )
        .appendTo("#"+_target);

      // initialize the visualization
      tool.visualization_setup();

      // initialize the map
      tool.map_setup();


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

      EduVis.tool.load_complete(this);

    };

    tool.visualization_setup = function(){

      var g = tool.graph = {},
        _target = tool.dom_target;

      var erddap_ref = tool.settings.erddap_parameter_metadata,
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

      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(10);//.tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left");//.tickSize(0,0,0);

      g.svg = d3.select("#"+_target + "-viz-container").append("svg")
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
        .style({
          "fill" : "none",
          "stroke" :"#666666"
          //,"stroke-width":"1px"
        })
        .call(g.xAxis);

      g.chart.append("g")
        .attr("id", _target+"_yAxis")
        .attr("class", "y axis")
        .style({
          "fill" : "none",
          "stroke" :"#666666",
          "stroke-width":"1px"
        })
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
        .interpolate("monotone")
        .x(function(d) { return g.x(d[erddap_ref[config.parameter].column]); })
        .y(function(d) { return g.y(d[column_depth]); });

      g.title = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "left")
        .style("font-size", "12px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 20) + "," + (0) + ") ")
        .text(tool.configuration.dataset_id);
        //.attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")

      g.subtitle = g.svg.append("text")
        .attr("class", "gsubtitle")
        .attr("text-anchor", "left")
        .style("font-size", "11px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 20) + "," + (18) + ") ")
        .text(
          column_selected_title + " Profile: "+ config.profile_id
        );

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
          tool.graph_update(tool.configuration.profile_id);
        });

    };

    tool.erddap_request_profile = function(dataset_id, profile_id, columns_selected){
      var tabledap_url = "http://erddap.marine.rutgers.edu/erddap/tabledap/",
      dataset_url = dataset_id + ".csvp?",
      //columns_default = ["time","depth", "salinity", "temperature", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter_650nm"],
      columns_default = ["time","depth", "salinity", "temperature", "conductivity"],
      columns = typeof columns_selected === "object" ? columns_selected : columns_default,
      query = "&profile_id=" + profile_id + "&" + columns.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";

//http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2200.csv?profile_id,time,latitude,longitude
      console.log("QUERY FOR CSV: ", query)
// SALINITY: http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2200.htmlTable?time,latitude,longitude,profile_id,salinity&salinity!=NaN
//http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_319-20140420T2200.csvp?profile_id,time,depth,salinity,temperature,conductivity
// &profile_id=1&time!=NaN&depth!=NaN&salinity!=NaN&temperature!=NaN&conductivity!=NaN!=NaN&orderBy(%22depth%22)
      return tabledap_url + dataset_url + "profile_id," +columns.join(",") + query;
    };

    tool.erddap_dataset_query = function(params_obj){

      var dataset_url = "http://erddap.marine.rutgers.edu/erddap/search/advanced.html?",
        query_params = {
          "cdm_data_type" : "trajectoryprofile",
          "variableName":"",
          "maxLat":"",
          "minLon":"",
          "maxLon":"",
          "minLat":"",
          "minTime":"",
          "maxTime":""
        };

      $.extend(true, query_params, params_obj);

      $.each(query_params,function(p,v){
        if(v !== ""){
          base_url += p + "=" + v + "&";
        }
      });

      return dataset_url;

    };

    tool.map_setup = function(){

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
          maxZoom: 19,
          attribution: 'Tile Layer: &copy; Esri'
        }).addTo(tool.leaflet_map.map);

        tool.map_update();

        //tool.slider_update();
        //tool.set_slider()

        //!* chart_update
        //!* slider_update

    };

    tool.map_update = function(){

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

      $.getJSON( tool.mapping.locations_query() , function(geodata){

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
                tool.graph_update(profile_id, d3.round(e.latlng.lat,4), d3.round(e.latlng.lng,4));
                tool.slider_update(profile_id);

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

      tool.graph_update(profile_id, lat, lng);

      tool.slider_update(profile_id);

    };

    tool.graph_update = function(pid, lat, lng){

      var g = tool.graph,
      profile_id = typeof pid === "undefined" ? tool.configuration.profile_id : pid,
      dataset_id = tool.configuration.dataset_id;

      d3.csv( tool.erddap_request_profile(dataset_id, profile_id), function(error,data){

        console.log("error", error, data);

        //console.log(JSON.stringify(data));

        // var erddap_meta = tool.settings.erddap_parameter_metadata,
        //     //column_date = erddap_meta.time.column,
        //     column_depth = erddap_meta.depth.column,
        //     column_selected = erddap_meta[tool.configuration.parameter].column,
        //     column_selected_title = erddap_meta[tool.configuration.parameter].column,

        var erddap_ref = tool.settings.erddap_parameter_metadata,
            column_depth = erddap_ref.depth.column,
            config = tool.configuration,
            column = erddap_ref[config.parameter],
            column_selected = column.column,
            column_selected_title = column.title,
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
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", g.line);

        // update chart title with profile id and date
        profile_date = data[0]["time (UTC)"].slice(0,10);

        g.title.text(
          tool.configuration.dataset_id + " - " + profile_date
        );

        g.subtitle.text(
          column_selected_title + " Profile: "+ pid
        );
        //+ " Lat: " + lat + " Long:" + lng

        g.xlabel.text(
          column_selected_title +
          (erddap_ref[config.parameter].units !== "" ? " (" + erddap_ref[config.parameter].units + ")" : "")
        );

        // // update x and y axis
        d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
        d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);

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

        g.mouse_focus.select("text").text(d3.round(d[column_depth], 1) + " m - " + d3.round(d[column_selected], 2))
          .attr("transform", "translate(" + xPosition + "," + 0 + ")")

        });

      });

    };

    tool.update_map = function(profile_id){

      //console.log("profile ID", profile_id);
      //console.log("update map", tool.leaflet_map.locationsFeatureCollection);
      //console.log("update selected profile", tool.leaflet_map.selected_profile);

      // get associated profile

    };

    tool.set_slider = function( min, max, date_start, date_end) {

      //console.log(min, max, date_start, date_end, "slider");

      var iso_format = d3.time.format.iso.parse,
          date_format = d3.time.format("%Y-%m-%d"),
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

                tool.leaflet_map.map.panTo([lat,lng]);

                return tool.mapping.styles.profile_click;
              }
              return tool.mapping.styles.profile;
            });

            tool.graph_update(profile_id, lat, lng);

          }
        }
      );
    };

    tool.slider_update = function(profile_id){

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

    tool.init_tool = function() {

      this.Glider_Profile_Explorer_OOI(this.dom_target);

    };

    tool.init_controls = function(target_div){

      tool.controls = {};
      tool.controls.Glider_Dataset_Browser_Control = EduVis.controls.Glider_Dataset_Browser_Control;
      tool.controls.Glider_Dataset_Browser_Control.init(tool);

    }

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
