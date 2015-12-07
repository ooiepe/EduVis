/**
 * Glider Profile Comparer (GPC) - Rutgers Version
 * Revised 6/8/2015
 * Written by Sage Lichtenwalner and Michael Mills 
*/
(function (eduVis) {
    "use strict";
    var tool = {
      "name" : "Glider_Profile_Comparer_RU",
      "version" : "0.1",
      "description" : "Rutgers Glider Profile Comparer, Rutgers Version",
      "resources" : {
        "tool": {
          "scripts" : [
            {
              "name" : "d3",
              "url" : "http://d3js.org/d3.v3.min.js",
              "global_reference" : "d3"
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
            },
            {
              "name": "leaflet_js",
              "url": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.js"
            }
          ],
          "stylesheets" : [
          {
            "name": "gpe-css",
            "src": "Glider_Dataset_Chooser_RU.css"
          },
          {
            "name": "leaflet-css",
            "src": "http://cdn.leafletjs.com/leaflet-0.7.2/leaflet.css"
          }
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
        'profile_id' : '316'
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
    };

    /**
     * Setup the Tool UI
     * Called by setup
     */
    tool.setup_ui = function(_target){
      $("<div />")
        .css({
          "width":"800px",
          "margin":"0",
          "height":"500px"
        })
        .append(
          $("<div />")
            .attr("id", "vis-container")
        )
        .append(
          $("<div />")
            .attr("id",  "vis-chart")
            .css({
              "width":"400px",
              "float":"left"
            })
            .append(
              $("<div />")
                .attr("id", "vis-controls")
                .css({"text-align":"center"})
                .append("Parameter 1: ")
                .append(
                    $("<select />")
                      .attr("id", "control-parameter-dropdown")
                )
                .append("<br/>")
                .append("Parameter 2: ")
                .append(
                    $("<select />")
                      .attr("id", "control-parameter2-dropdown")
                )
            )
            .append(
              $("<div />")
                .attr("id", "control-download")
                .css({
                  "text-align":"right",
                  "cursor": "pointer"
                })
                .append('<a id="profile-download-link"> Download Profile <span class="glyphicon glyphicon-download"></span></a>')
            )
        )
        .append(
          $("<div />")
            .attr("id", "control-slider")
            .css({
              "width":"400px",
              "float":"right"
            })
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
                          var slider = $("#profile-slider"),
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
                        .attr("id", "profile-slider")
                        .css({"margin-bottom": "6px"})
                    )
                    .append(
                      $("<span />")
                        .attr("id", "profile-slider-left")
                        .html("")
                        .css({"float":"left"})
                    )
                    .append(
                      $("<span />")
                        .attr("id", "profile-slider-right")
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
                          var slider = $("#profile-slider"),
                              val = slider.slider("option","value");
                          if ( val != slider.slider("option","max")){
                              slider.slider("value", +val + 1 );
                          }
                        })
                    )
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

      g.svg = d3.select("#vis-container").append("svg")
        .classed({"svg_export":true})
        .attr("id","_svggraph")
        .attr("width", 800)
        .attr("height", 450)
        .style("font-size","11px")
        .style("font-family","Tahoma, Geneva, sans-serif");

      g.svg.append("g").attr("id", "chart1");

/*
      g.svg.append("defs").append("clipPath")
          .attr("id", _target+"_clip")
        .append("rect")
          .attr("width", g.width)
          .attr("height", g.height);

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
*/

      // initialize visualization controls
      var erddap_ref = tool.parameter_metadata;

      // create reference to dropdown
      var parameter_dropdown = $("#control-parameter-dropdown");

      // add parameters to dropdowns
      $.each(erddap_ref.parameters, function (index, parameter_option) {
        parameter_dropdown.append(
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
      
      tool.update_graph();
    };


    /**
     * profileChart Class
     * 
     */

    tool.profileChart = function () {
      var margin = {top: 40, right: 10, bottom: 40, left: 50},
          width = 225,
          height = 450,
          xValue = function(d) { return d[0]; },
          yValue = function(d) { return d[1]; },
          xScale = d3.scale.linear(),
          yScale = d3.scale.linear(),
          xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
          yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(6, 0),
          area = d3.svg.area().x(X).y1(Y),
          line = d3.svg.line().x(X).y(Y);
    
      function chart(selection) {
        selection.each(function(data) {
    
          // Convert data to standard representation greedily;
          // this is needed for nondeterministic accessors.
          data = data.map(function(d, i) {
            return [xValue.call(data, d, i), yValue.call(data, d, i)];
          });

          // Update the x-scale.
          xScale
            .domain(d3.extent(data, function(d) { return d[0]; }))
            .range([0, width - margin.left - margin.right]);
    
          // Update the y-scale.
          yScale
            .domain(d3.extent(data, function(d) { return d[1]; }))
            .range([height - margin.top - margin.bottom, 0]);
    
          // Select the svg element, if it exists.
          var svg = d3.select(this).selectAll("svg").data([data]);
    
          // Otherwise, create the skeletal chart.
          var gEnter = svg.enter().append("svg").append("g");
          gEnter.append("path").attr("class", "area");
          gEnter.append("path").attr("class", "line");
          gEnter.append("g").attr("class", "x axis");
          gEnter.append("g").attr("class", "y axis");
    
          // Update the outer dimensions.
          svg .attr("width", width)
              .attr("height", height);
    
          // Update the inner dimensions.
          var g = svg.select("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
          // Update the area path.
          g.select(".area")
            .attr("d", area.y0(yScale.range()[0]));
    
          // Update the line path.
          g.select(".line")
            .attr("d", line)
            .style("fill","none")
            .style("stroke","#00457c")
            .style("stroke-width","2px");
            //.transition()
            //.duration(1000)
            //.ease("linear")
    
          // Update the x-axis.
          g.select(".x.axis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis);

          // Update the y-axis.
          g.select(".y.axis")
            .call(yAxis);

        });
      }
    
      // The x-accessor for the path generator; xScale ? xValue.
      function X(d) {
        return xScale(d[0]);
      }
    
      // The x-accessor for the path generator; yScale ? yValue.
      function Y(d) {
        return yScale(d[1]);
      }
    
      chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
      };
    
      chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
      };
    
      chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
      };
    
      chart.x = function(_) {
        if (!arguments.length) return xValue;
        xValue = _;
        return chart;
      };
    
      chart.y = function(_) {
        if (!arguments.length) return yValue;
        yValue = _;
        return chart;
      };
    
      return chart;
    };


    /**
     * Update the graph
     * Called by init_graph and also via map marker, pulldown change and slider change 
     */
    tool.update_graph = function(pid){

      var g = tool.graph,
      profile_id = (typeof pid === "undefined" ? tool.configuration.profile_id : pid),
      dataset_id = tool.configuration.dataset_id;
      
      tool.data_url = tool.erddap_request_profile(dataset_id, profile_id);
      $('#profile-download-link').attr('href',tool.data_url);

      d3.csv( tool.data_url, function(error,data){

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


        d3.select("#chart1")
          .datum(data)
          .call(tool.profileChart()
            .x(function(d) { return d[erddap_ref[config.parameter].column]; })
            .y(function(d) { return d[column_depth]; }));

        // update chart line
        g.svg.selectAll("path.line")
          .data([data])
          .attr("d", g.line);

        // update chart title with profile id and date
        profile_date = data[0]["time (UTC)"];

/*
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
*/

        d3.selectAll('.axis line, .axis path')
          //.style("shape-rendering","crispEdges")
          .style("fill","none")
          .style("stroke","#999")
          .style("stroke-width","1px");
        d3.selectAll('.y.axis line')
          .style("stroke-opacity",".4");

/*
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
          .attr("transform", "translate(" + xPosition + "," + 0 + ")");
        });
*/

      });  //end d3.csv 

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
     * Called by init_graph and also via map marker
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
    };

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
      tool.update_graph();
    };

    // Extend the base EduVis object with this tool
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
