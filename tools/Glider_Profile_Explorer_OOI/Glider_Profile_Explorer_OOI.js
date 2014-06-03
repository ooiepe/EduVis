/*

 * Glider Profile Explorer OOI (GPE OOI)
 * Revised 6/02/2014
 * Written by Mike Mills

*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Glider_Profile_Explorer_OOI",
        "description" : "Glider Profile Explorer",
        "url" : "",

        "version" : "0.3.2",
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
              //   "name":"geoJsonExample",
              //   "url" :"js/erddap_glider_locations_geoJson_example.js"
              // },
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
                "name" : "jquery_ui_js", 
                "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
              }
            ],

            "stylesheets" : [
              // {
              //     "name": "leaflet-markercluster-css",
              //     "src": "css/MarkerCluster.css"
              // },
              // {
              //     "name": "leaflet-markercluster-default",
              //     "src": "css/MarkerCluster.Default.css"
              // },
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
            ]

          },

            "controls": {

               "scripts" : [
                    {
                        "name" : "d3",
                        "url" : "http://d3js.org/d3.v3.min.js",
                        "global_reference" : "d3"
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
          "dataset_id" : "OOI-GP05MOAS-GL001",
          "profile_id" : "1",
          "parameter" : "temperature",
          "date_start": "2013-09-17",
          "date_end": "2014-03-03"
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
        
        "trajectory_profiles" : "http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.html?cdm_data_type=trajectoryprofile",
        "locations_query" : function(){

            return "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/" + tool.configuration.dataset_id + ".geoJson?profile_id,time,latitude,longitude&time%3E="+tool.configuration.date_start + "&time%3C="+tool.configuration.date_end;
         }
       },
      "controls" : {
        "slider" : {
          "date_start" : null,
          "date_end" : null,
          "date_range_start" : null,
          "date_range_end" : null
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
          "column" : "salinity (1)",
          "units" : "",
          "title" : "Salinity"
        },
        "temperature" : {
          "column" : "temperature (Celsius)",
          "units" : "degrees celsius",
          "title" : "Temperature"
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
                .html("GP05MOAS Profile Locations")

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

      //console.log("tool loaded");

      // hack to invalidate the map bounds.
      $('.nav-tabs a[href="#ev-instance-preview"]').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        tool.leaflet_map.map.invalidateSize();
        tool.leaflet_map.map.fitBounds(tool.leaflet_map.layer_locations.getBounds());
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
        //.on("mousemove", mousemove);

      g.line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x(d[erddap_ref[config.parameter].column]); })
        .y(function(d) { return g.y(d[column_depth]); });

      g.title = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 20) + "," + (0) + ") ")
        .text("GP05MOAS");
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
    
      // need to implement start and end date constraints

      // profile_id,time,depth,salinity,temperature,conductivity,density

      var tabledap_url = "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/",
      dataset_url = dataset_id + ".csvp?",
      columns_default = ["time","depth", "salinity", "temperature", "conductivity"], // density
      columns = typeof columns_selected === "object" ? columns_selected : columns_default,
      query = "&profile_id=" + profile_id + "&" + columns.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";

      return tabledap_url + dataset_url + "profile_id," +columns.join(",") + query;
    };

    tool.erddap_dataset_query = function(params_obj){

      /* example object
            var params_obj = {
              "minLon":"20",
              "maxLon":"30",
              "minLat":"40",
              "minTime":"50"
            };
      */

      // http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.html?page=1&itemsPerPage=1000&searchFor=&protocol=%28ANY%29&cdm_data_type=trajectoryprofile&institution=%28ANY%29&ioos_category=%28ANY%29&keywords=%28ANY%29&long_name=%28ANY%29&standard_name=%28ANY%29&variableName=%28ANY%29&maxLat=&minLon=&maxLon=&minLat=&minTime=&maxTime=

      // http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.html?
      // page=1
      // itemsPerPage=1000
      // searchFor=
      // cdm_data_type=trajectoryprofile
      // institution=%28ANY%29
      // keywords=%28ANY%29&
      // long_name=%28ANY%29&
      // standard_name=%28ANY%29&
      // variableName=%28ANY%29&
      // maxLat
      // minLon
      // maxLon
      // minLat
      // minTime
      // maxTime
  
      var dataset_url = "http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.html?",
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

        mapObj.layer_locations = new L.geoJson(mapObj.locationsFeatureCollection,{
          onEachFeature: function (location, location_feature) {

            //console.log("profile_id, time", location.properties.profile_id, location.properties.time);

            // add the key value pair.. profile_id, time
            mapObj.profile_ids.set(location.properties.profile_id, location.properties.time);
            
            // add the profile location to the profile track
            tool.leaflet_map.poly_line
              .addLatLng(L.latLng(location.geometry.coordinates[1],location.geometry.coordinates[0]));

            // add click event for the profile
            location_feature.on({

              "click": function(e){
                
                // update the profile style on click
                //profile.setStyle(tool.mapping.styles.profile_click);

                var profile_id = e.target.feature.properties.profile_id;

                // only update the style for the selected profile
                tool.leaflet_map.layer_locations.setStyle(function(feature) {
                  if (feature.properties.profile_id == profile_id) {
                    return tool.mapping.styles.profile_click;
                  }
                  return tool.mapping.styles.profile;
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
        //map.fitBounds(mapObj.layer_locations.getBounds());
        //console.log("DEBUG.... fit to bounds removed.. ")

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
            bisectData = d3.bisector(function(d) { return d[column_depth]; }).left;

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
        
        // update chart title with 
        
        g.title.text(
          "GP05MOAS"
        );
        //column_selected_title

        g.subtitle.text(
          " Profile: "+ pid 
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
            mouseX = d3.mouse(this)[0],
            y0 = g.y.invert(mouseY),
            i = bisectData(data, y0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = y0 - d0[column_depth] > d1[column_depth] - y0 ? d1 : d0;
          
        g.mouse_focus.attr("transform", "translate(" + g.x(d[column_selected]) + "," + g.y(d[column_depth]) + ")");

        g.mouse_focus.select("text").text(d3.round(d[column_depth], 1) + " m - " + d3.round(d[column_selected], 2))
          .attr("transform", "translate(" + (mouseX > chartMiddle ? -90 : 0) + "," + 0 + ")");

        });

        //console.log("GRAPH UPDATE");

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

      //console.log(min, max, date_start, date_end, start, end, "slider");       

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

    tool.config_dateRange_slider = function(date_start, date_end, range_start, range_end){
        
      $("#ui-config-dateRange-slider").remove();

        var margin = {
            top: 0,
            right: 40,
            bottom: 20,
            left: 40
        },
            width = 500 - margin.left - margin.right,
            height = 50 - margin.top - margin.bottom,
            date_format = d3.time.format("%Y-%m-%d");

        var iso_format = d3.time.format.iso.parse,
            
            start = date_format.parse(date_start),
            end = date_format.parse(date_end);

        var range_date_start = range_start || date_start,
            range_date_end = range_end || date_end;

        var x = d3.time.scale.utc()
            .range([0, width])
            .domain([start, end]);

        // set the extent to the selected range within the full range
        var brush = d3.svg.brush()
            .x(x)
            .extent([date_format.parse(range_date_start), date_format.parse(range_date_end)])
            .on("brushstart", brushstart)
            .on("brush", brushmove)
            .on("brushend", brushend);

        var arc = d3.svg.arc()
            .outerRadius(height / 2)
            .startAngle(0)
            .endAngle(function (d, i) {
            return i ? -Math.PI : Math.PI;
        });

        var svg = d3.select("#ui-config-dateRange").append("svg")
            .attr("id","ui-config-dateRange-slider")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var tick_interpolate = d3.interpolate(start, end);
        var dd = [0, 0.25, 0.5, 0.75, 1].map(function (a) {
            return iso_format(tick_interpolate(a));
        });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(
              d3.svg.axis().scale(x)
                .orient("bottom")
                .tickValues(dd)
                .tickFormat(date_format)
            );

        var brushg = svg.append("g")
            .attr("class", "brush")
            .call(brush);

        brushg.selectAll(".resize").append("path")
          .attr("transform", "translate(0," + height / 2 + ")")
          .attr("d", arc);

        brushg.selectAll("rect")
          .attr("height", height);

        brushstart();
        brushmove();

        function brushstart() {
            svg.classed("selecting", true);
        }

        function brushmove() {
            var s = brush.extent();
            
            $("#config-date_start-input").val(date_format(s[0]));
            $("#config-date_end-input").val(date_format(s[1]));
        }

        function brushend() {
            svg.classed("selecting", !d3.event.target.empty());
        }

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

      var iso_format = d3.time.format.iso.parse,
        date_format = d3.time.format("%Y-%m-%d"),
        slider = tool.controls.slider;
        
        slider.date_start = tool.configuration.date_start;
        slider.date_end = tool.configuration.date_end;

        slider.date_range_start = tool.configuration.date_start;
        slider.date_range_end = tool.configuration.date_end;

        var erddap_ref = tool.settings.erddap_parameter_metadata,
      
        dropdown_deployment = $("<div />")
          .append(
            $("<h2 />")
              .html("Glider Dataset Explorer")
          )
          .append(
            $("<div />")
              .html("Customize your glider profile explorer default view.")
              .append(
                $("<ol />")
                  .append("<li>Choose a Deployment Dataset</li>")
                  .append("<li>Refine the Date Range (optional)</li>")
                  .append("<li>Apply the Configuration</li>")
              )
          )
          .append(
            $("<label />")
              .attr("for", "config-dataset_id-select")
              .html("Deployment Dataset")
          )
          .append(

            tool.controls.config_dataset_id = $("<select />")
              .attr("id","config-dataset_id-select")
              .append("<option>...loading...</option>")
              .on("change", function(){

                var val = $(this).val();
                
                $.getJSON("http://tds-dev.marine.rutgers.edu:8082/erddap/info/"+ val + "/index.json", {}, function(json){

                  var array_var_index = 2,
                      array_val_index = 4,
                      date_start,
                      date_end;

                  $.each(json.table.rows,function(i,row){
                    
                    var row_var = row[array_var_index],
                        row_val = row[array_val_index];

                    if( row_var == "time_coverage_start"){
                      date_start = iso_format(row_val);
                    }
                    
                    if( row_var == "time_coverage_end"){
                      date_end = iso_format(row_val);
                    }
                  });

                  slider.date_start = date_format(date_start);
                  slider.date_end = date_format(date_end);
                  slider.date_range_start = date_format(date_start);
                  slider.date_range_end = date_format(date_end);

                  // now set the slider to the full range of the requested dataset
                  // if its the config dataset load the specific start and end dates
                  if(tool.configuration.dataset_id == val){

                    slider.date_range_start = tool.configuration.date_start;
                    slider.date_range_end = tool.configuration.date_end;
                    
                    tool.config_dateRange_slider( slider.date_start, slider.date_end, slider.date_range_start, slider.date_range_end);

                  }
                  else{

                    tool.config_dateRange_slider( slider.date_start, slider.date_end, slider.date_range_start, slider.date_range_end );

                  }

                  // set the date picker start and end range restrictions
                  $("#config-date_start-input").datepicker("option", {
                    "minDate":date_format(date_start),
                    "maxDate":date_format(date_end)
                  });

                  $("#config-date_end-input").datepicker("option", {
                    "minDate":date_format(date_start),
                    "maxDate":date_format(date_end)
                  });

                });

            })

          )
          .append(
            $("<div />")
              .attr("id","ui-config-map-container")
              .css({
                "width":"400px",
                "height":"400px",
                "background-color":"red"

              })
              .append(
                  $("<div />")
                  .attr("id","ui-config-map")
                  .css({
                    "width":"400px",
                    "height":"400px"
                  })
              )
          )
          .append(
            $("<div />")
              .attr("id","ui-config-dateRange")
              .append(
                $("<div />")
                  .attr("id","ui-config-dateRange-start")
                  .append(
                    $("<label />")
                      .attr("for","config-date_start-input")
                      .html("Start Date")
                  )
                  .append(
                    
                    // var controls.data_start-input = 
                    $("<input />")
                      .attr("id","config-date_start-input")
                      .addClass('datepicker')
                      .datepicker({
                          "dateFormat": "yy-mm-dd",
                          //"minDate": tool.configuration.date_start,
                          //"maxDate": tool.configuration.date_end,
                          //"showOn": "button",
                          "changeMonth": true,
                          "changeYear": true,
                          //"showButtonPanel": true,
                          "onSelect" : function(d,i){
                            tool.config_dateRange_slider(slider.date_start, slider.date_end, d, $("#config-date_end-input").val());
                          },
                          "defaultDate": tool.configuration.date_start
                      })
                      .val(tool.configuration.date_start)
                  )
              )
              .append(
                $("<div />")
                  .css("margin-bottom","10px")
                  .attr("id","ui-config-dateRange-end")
                  .append(
                    $("<label />")
                      .attr("for","config-date_end-input")
                      .html("End Date")
                  )
                  .append(
                    $("<input />")
                      .attr("id","config-date_end-input")
                      .addClass('datepicker')
                      .datepicker({
                            "dateFormat": "yy-mm-dd",
                            //"minDate": tool.configuration.date_start,
                            //"maxDate": tool.configuration.date_end,
                            //"showOn": "button",
                            "changeMonth": true,
                            "changeYear": true,
                            //"showButtonPanel": true,
                            "onSelect" : function(d,i){

                                tool.config_dateRange_slider(slider.date_start, slider.date_end, $("#config-date_start-input").val(), d);
                            },
                            "defaultDate": tool.configuration.date_start

                        })
                        .val(tool.configuration.date_end)
                  )
              )

          )
         
          .append(
            $("<div />")
              .attr("id","ui-config-apply")
              .append(
                $("<div />")
                  .attr("id", "config-apply")
                  .addClass("btn btn-medium")
                  .html("Apply")
                  .css({"margin-top":"20px"})
                  .on("click",function(){
                    // update the parameter configuration value

                    tool.configuration.date_start = $("#config-date_start-input").val();
                    tool.configuration.date_end = $("#config-date_end-input").val();

                    // update map and graph
                    tool.map_update();
                    //tool.graph_update();

                  })
              )
          )
          .appendTo("#vistool-controls");

        // only request datasets with institution of OOI
        $.getJSON('http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.json?searchFor=&cdm_data_type=trajectoryprofile&protocol=tabledap&institution=ooi', {}, function(json, textStatus) {
              
            var ds = json, datasets = [],
            vals_we_want = ["Dataset ID", "Title"],
            ci = 0,
            clen = ds.table.columnNames.length;

            function getColumnKey(columnValue) {
              for (ci = 0; ci < clen; ci++) {
                  if (ds.table.columnNames[ci] == columnValue) return ci;
              }
              return -1;
            }

            function getRowValue(row, columnValue) {

              var columnKey = getColumnKey(columnValue),
                  rowValue = ds.table.rows[row][columnKey];
              return rowValue;
            }

            $.each(ds.table.rows, function (i, row) {
              var dset = {};
              $.each(vals_we_want, function (x, v) {
                  dset[v] = getRowValue(i, v);
              });
              datasets.push(dset);
            });

            $("#config-dataset_id-select").children().remove();

            // console.log(datasets);
            $.each(datasets, function(i,dset){
              
               $("#config-dataset_id-select")
                 .append('<option value="' + dset["Dataset ID"] +'">' + dset["Title"]+'</option>');
            });

            // set the default seleted option for the dataset dropdown
            tool.controls.config_dataset_id
              .val(tool.configuration.dataset_id);

            tool.controls.config_dataset_id.trigger("change");

            
            // add the leaflet map tool control
            tool.controls.leaflet_map = {
              "map" : L.map('ui-config-map', {
                "center": [38.5,-78.2],
                "zoom": 3
                // ,noWrap : true
              })
            };

            // add the ocean basemap to the map tool control
            tool.controls.leaflet_map.oceanBasemap_layer = new L.TileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",{ 
              maxZoom: 19, 
              attribution: 'Tile Layer: &copy; Esri' 
            }).addTo(tool.controls.leaflet_map.map);

            //tool.map_update();

        });
    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
