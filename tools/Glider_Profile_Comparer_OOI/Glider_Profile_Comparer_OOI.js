/*

 * Glider Profile Comparer OOI (GPC OOI)
 * Revised 10/31/2014
 * Written by Michael Mills, Rutgers University

*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Glider_Profile_Comparer_OOI",
        "description" : "Glider Profile Comparer",
        "url" : "",

        "version" : "0.0.4",
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
                "global_reference" : "d3",
                "attributes":{"charset":"utf-8"}
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
                  "global_reference" : "d3",
                  "attributes":{"charset":"utf-8"}
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
                  "name" : "Glider_Profile_Comparer_OOI_css",
                  "src" : "Glider_Profile_Comparer_OOI.css"
                },
              ]
          },

          "datasets" : []

        },



        "c_orig" : {

          "dataset_id" : "CE05MOAS-ce_312-20140420T2200",
          "glider_name" : "CE05MOAS",
          "profile_id" : "125",

          "var1" : "salinity",
          "var2" : "temperature",

          "date_start": "2014-05-02",
          "date_end": "2014-06-10"

        },
        "configuration" : {
          "dataset_id": "CP05MOAS-cp_388-20141006T2010",
          "glider_name": "CE05MOAS",
          "profile_id": 42,
          "var1": "salinity",
          "var2": "temperature",
          "date_start": "2014-10-11",
          "date_end": "2014-10-13"
        },

        "data" : {},
        "target_div" : "",
        "tools" : {},
        "settings" : {

          "erddap_parameter_metadata" : {
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
              "units" : "1e-3",
              "title" : "Salinity" // Sea Water Practical Salinity
            },
            "temperature" : {
              "column" : "temperature (Celsius)",
              "units" : "&#176; C",
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
          }
         }
       },
       "UI" : {},
       "DATA" : {}
    };

    tool.callback_download_track = function(){


    };

    tool.callback_download_profile = function(){


    };

    tool.callback_slider_update = function(){


    }

    tool.Glider_Profile_Comparer_OOI = function( _target ){

      var c=this.configuration;

      // set up data objects and data requests
      tool.DATA.init_services();

      // show data download status.. "Preparing Tool Data"
      // download track data..
      // -> on complete, download profile data
      // -> on complete, update charts

      // create controls
      tool.UI.setup();

      //update profile track
      tool.update_track_profiles(
        c.dataset_id,
        c.profile_id,
        c.date_start,
        c.date_end
      );

      // d3.select("body")
      //   .on("keydown", function() {
      //
      //     var evt = d3.event(this);
      //
      //     console.log("keypress",evt);
      //
      //     // left or right press
      //     //
      //
      //
      //   })

      EduVis.tool.load_complete(this);

    };


    tool.UI.slider = function(profile_extent, date_extent){

      var c = tool.configuration,
        _target = c.dom_target,
        profile_selected = c.profile_id;

      d3.select("#" + _target + "_profile_slider").remove();

      var date_format_utc = d3.time.format("%Y-%m-%d %H:%M");

      // var tick_interpolate = d3.interpolate(profile_extent[0], profile_extent[1]);
      //
      // var dd = [0, 1].map(function (a) {
      //     return tick_interpolate(a);
      // });
      //console.log("dd",dd);

      var width = 380,
          height = 50;

      var x = d3.scale.linear()
          .range([0, width])
          .domain(profile_extent)
          .clamp(true);

      var brush = d3.svg.brush()
          .x(x)
          .extent([profile_selected, profile_selected])
          .on("brush", brushed)
          .on("brushend", brushend);

      var svg = d3.select("#" + "svg_container").append("g")
          .attr("id", _target + "_profile_slider")
          .attr("transform", "translate(" + 100 + "," + 440 + ")");

      var xaxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickValues([profile_extent[0], profile_extent[1]])
          .tickFormat(d3.format("f"))

      var gXaxis = svg.append("g")
          .attr("class", "x axis slider")
          .attr("transform", "translate(0," + 20 + ")")
          .call(xaxis);

      var slider = svg.append("g");

      var slider_svg = slider.append("g")
          .attr("class", "slider")
          .call(brush);

      slider_svg.select(".background")
          .attr("height", height);

      slider_svg.selectAll(".extent,.resize")
          .remove();

      var handle_container = slider_svg.append("g")
          .attr("class", "profile_data")
          .append("text")
          .attr("x",200)
          .attr("y",40)
          .attr("text-anchor", "middle")
          .text("");

      var handle = slider_svg.append("path")
          .attr("class", "handle")
          .attr("stroke", "red")
          .attr("stroke-width", "1")
          .attr("fill","none")
          .attr("transform", "translate(-10,0)")
          .attr("d","M1,1L21,1L21,14L11,21L1,14Z");

          //.attr("d","M1,1h21l21,14v21l1,14Z");
          //.attr("d","M1,1L21,1L21,14L11,21L1,14Z");

      slider_svg
          .call(brush.extent([profile_selected, profile_selected]))
          .call(brush.event);

      var btn_ProfilePrev = slider.append("g")
            .append("path")
            .attr("stroke", "red")
              .attr("stroke-width", "1")
              .attr("fill","red")
              .attr("transform", "translate(-36,10)")
              .attr("d","M8 12L16 2 22 2 22 22 16 22Z")
              .on("click",left_clicked);


      var btn_ProfileNext = slider.append("g")
            .append("path")
              .attr("stroke", "red")
              .attr("stroke-width", "1")
              .attr("fill","red")
              .attr("transform", "translate(396,10)")
              .attr("d","M2 2L8 2 16 12 8 22 2 22Z")
              .on("click",right_clicked);

      tool.UI.slider_svg = slider_svg;

      function left_clicked(){

        var profile = tool.configuration.profile_id,
            profile_data = tool.get_track_profile_info(profile-1);

        if(typeof profile_data !== "undefined"){

          tool.configuration.profile_id--;

          handle
            .attr("transform", "translate(" + (x(profile_data.profile_id) - 10) + ",0)");

          handle_container
            .text("Profile: " + profile_data.profile_id + " - " + date_format_utc(profile_data.time));

          tool.update_charts(profile_data);

          // update labels;
        }

      }

      function right_clicked(){

        var profile = tool.configuration.profile_id,
            profile_data = tool.get_track_profile_info(profile+1);

        if(typeof profile_data !== "undefined"){

          tool.configuration.profile_id++;

          handle
            .attr("transform", "translate(" + (x(profile_data.profile_id) - 10) + ",0)");

          handle_container
            .text("Profile: " + profile_data.profile_id + " - " + date_format_utc(profile_data.time));

          tool.update_charts(profile_data);

        }
      }

      function brushed() {
          var value = brush.extent()[0];

          if (d3.event.sourceEvent) { // not a programmatic event
            value = x.invert(d3.mouse(this)[0]);
            brush.extent([value, value]);
          }

          var profile_data = tool.get_track_profile_info(Math.floor(value));

          if(typeof profile_data !== "undefined"){

            handle
              .attr("transform", "translate(" + (x(value) - 10) + ",0)");

            handle_container
              .text("Profile: " + profile_data.profile_id + " - " + date_format_utc(profile_data.time));

          }

      }

      function brushend() {

          var value = brush.extent()[0];

          //console.log("SLIDER UPDATE ->", value, x(value),Math.floor(x(value)));
          var profile_data = tool.get_track_profile_info(Math.floor(value));

          console.log("!!!! PROFILE DATA --> ", Math.floor(value), profile_data);

          if(typeof profile_data !== "undefined"){


            //update configuration profile id
            tool.configuration.profile_id = profile_data.profile_id;

            // update chart when slider is changed
            tool.update_charts(profile_data);
          }
      }
    };

    tool.update_track_profiles = function(dataset_id, profile_id, date_start, date_end){

      console.log("DOWNLOAD Track Data", tool.DATA.erddap_endpoints.glider_track(dataset_id, date_start, date_end,undefined ,".csvp"));

      // profile_id,time,latitude,longitude
      // ,UTC,degrees_north,degrees_east

      d3.csv(tool.DATA.erddap_endpoints.glider_track(dataset_id, date_start, date_end, undefined ,".csvp"), function(d,i) {
        return {

          ind : i,
          profile_id: +d.profile_id,
          time: d3.time.format.utc("%Y-%m-%dT%H:%M:%SZ").parse(d["time (UTC)"]),
          lat: +d["latitude (degrees_north)"],
          lon: +d["longitude (degrees_east)"]

        };
      }, function(error, rows) {

          // set profile_collection data object
          tool.DATA.profile_collection = rows;

          // set min and max profiles for slider move display
          var profile_extent = d3.extent(rows,function(d){return d.profile_id;}),
              date_extent = d3.extent(rows,function(d){return d.time;});

          // update slider with new dataset
          tool.UI.slider(profile_extent, date_extent);

      });

    };

    tool.update_charts = function(profile_data){

      console.log("!!!!PROFILE DATA", profile_data);

      var c = tool.configuration,
          dataset_id = c.dataset_id,
          profile_id = profile_data.profile_id;

      console.log("UPDATE CHARTS:", dataset_id, profile_id);

      // download profile for dataset_id and profile_id
      d3.csv( tool.DATA.erddap_endpoints.profile(dataset_id, profile_id), function(error,data){

        if(error){console.log(error);}

        var erddap_ref = tool.settings.erddap_parameter_metadata,
            column_depth = erddap_ref.depth.column,
            config = tool.configuration,

            chart1 = tool.UI.chart1,
            chart2 = tool.UI.chart2,
            chart3 = tool.UI.chart3,

            column1 = erddap_ref[config.var1],
            column2 = erddap_ref[config.var2],

            column_selected1 = column1.column,
            column_selected2 = column2.column,

            column_selected_title1 = column1.title,
            column_selected_title2 = column2.title,

            column_time = erddap_ref.time.column,
            bisectData = d3.bisector(function(d) { return d[column_depth]; }).left,
            profile_date,

            date_format_utc = d3.time.format("%Y-%m-%d %H:%M");

        //console.log("Data downloaded", data);

        data.forEach(function(d) {
          //d[column_date] = g.parseDate(d[column_date]);
          d[column_depth] = +d[column_depth];
          d[column_selected1] = +d[column_selected1];
          d[column_selected2] = +d[column_selected2];
        });

        // get the X extent
        chart1.extent_x = d3.extent(data, (function(d) { return d[column_selected1]; }));

        //update the x domain for chart1
        chart1.x.domain(chart1.extent_x);

        // update the y domain to use the range of the returned data.
        chart1.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

        // set the new tick values
        chart1.axisX.tickValues(tool.axisTicks(chart1.extent_x));

        // update the x and y axis for chart1
        chart1.select(".x.axis").transition().ease("linear").call(chart1.axisX);
        chart1.select(".y.axis").transition().ease("linear").call(chart1.axisY);

        // update chart line
        chart1.select("path.line")
          .data([data])
          .transition()
          //.duration(500)
          .ease("linear")
          .attr("d", chart1.line);

        // get the X extent
        chart2.extent_x = d3.extent(data, (function(d) { return d[column_selected2]; }));

        // update the x domain for chart2
        chart2.x.domain(chart2.extent_x);

        // update the y domain to use the range of the returned data.
        chart2.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

        // set the new tick values
        chart2.axisX.tickValues(tool.axisTicks(chart2.extent_x));

        // update the x axis for chart 2
        chart2.select(".x.axis").transition().ease("linear").call(chart2.axisX);
        chart2.select(".y.axis").transition().ease("linear").call(chart2.axisY);

        // update chart line
        chart2.select("path.line")
          .data([data])
          .transition()
          //.duration(500)
          .ease("linear")
          .attr("d", chart2.line);

        // update the domain for chart3
        chart3.x.domain(d3.extent(data, (function(d) { return d[column_selected1]; })));

        // update the y domain to use the range of the returned data.
        chart3.y.domain(d3.extent(data, (function(d) { return d[column_selected2]; })));

        // set the new tick values
        chart3.axisX.tickValues(tool.axisTicks(chart1.extent_x));

        // set the new tick values
        chart3.axisY.tickValues(tool.axisTicks(chart2.extent_x));

        // update the x and y axis for chart3
        chart3.select(".x.axis").transition().ease("linear").call(chart3.axisX);
        chart3.select(".y.axis").transition().ease("linear").call(chart3.axisY);

        // update path for chart3
        chart3.select("path.line")
          .data([data])
          .transition()
          //.duration(500)
          .ease("linear")
          .attr("d", chart3.line);


        chart3.labelName.text(c.dataset_id);
        // update chart labels

        chart3.labelTitleRight.text("Profile # " + profile_id);
        //chart3.labelTitleRight.text(column_selected_title1 + "-" + column_selected_title2);

        chart3.labelTitle.text(date_format_utc(profile_data.time));

        //chart3.labelSubTitleRight.text(profile_data.time);

        chart3.labelSubTitle
          .text("Location: " + d3.round(profile_data.lat,3) + " N " + d3.round(profile_data.lon,3)+" W")
          .html("Location: " + d3.round(profile_data.lat,3) + "&deg; N " + d3.round(profile_data.lon,3)+"&deg;W")
        // update dataset object
        tool.DATA.dataset = data;

      });

      //  profile_date = data[0]["time (UTC)"];



    };

/*

  Variable selection updates..

*/
    tool.UI.select_update = function(chart_id, id, variable){

      console.log(1, id,variable);

      var erddap_ref = tool.settings.erddap_parameter_metadata,
          column_depth = erddap_ref.depth.column,

          config = tool.configuration,

        chart = tool.UI["chart" + chart_id],
        chart3 = tool.UI.chart3,

        column = erddap_ref[variable],
        column_selected = column.column,
        column_selected_title = column.title,
        column_time = erddap_ref.time.column,

        data = tool.DATA.dataset;

        config["var"+chart_id] = variable;

      // only need to update the newly selected variable.. other variables have been cleaned on download
      data.forEach(function(d) {
        //d[column_depth] = +d[column_depth];
        d[column_selected] = +d[column_selected];
      });

      console.log("SELECTED", column_selected);

      chart.extent_x = d3.extent(data, (function(d) { return d[column_selected]; }));
      // update the x domain of the selected chart.. either chart1 or chart2
      chart.x.domain(chart.extent_x);

      // set the new tick values
      chart.axisX.tickValues(tool.axisTicks(chart.extent_x));

      // update the y domain to use the range of the returned data.
      chart.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

      // update chart line
      chart.select("path.line")
        .data([data])
        .transition()
        //.duration(500)
        //.ease("linear")
        .attr("d", chart.line);

      // update the x axis for the given chart
      //chart.axis_x.call(chart.axisX);
      chart.axis_x.transition()
        //.ease("linear")
        .call(chart.axisX);

      // if it is chart1, chart 3 x domain needs to be updated, otherwise it is the y domain
      if(chart_id == 1){
        chart3.extent_x = d3.extent(data, (function(d) { return d[column_selected]; }));
        chart3.x.domain(chart3.extent_x);
        // set the new tick values
        chart3.axisX.tickValues(tool.axisTicks(chart3.extent_x));
        chart3.axis_x.transition()
          //.ease("linear")
          .call(chart3.axisX);
        chart3.labelX.text(column_selected_title);
      }
      else{
        var chart3_extent_y = d3.extent(data, (function(d) { return d[column_selected]; }));
        chart3.y.domain(chart3_extent_y);

        chart3.axisY.tickValues(tool.axisTicks(chart3_extent_y));
        chart3.axis_y
          .transition()
          //.ease("linear")
          .call(chart3.axisY)

          // .selectAll("text")
          //   .style("text-anchor", "end")
          //   //.attr("dx", "-.8em")
          //   //.attr("dy", ".15em")
          //   .attr("transform", function(d) {
          //       return "rotate(45)";
          //     });

        chart3.labelY.text(column_selected_title);
      }

      chart3.select("path.line")
        .data([data])
        .transition()
        //.duration(500)
        //.ease("linear")
        .attr("d", chart3.line);

    };

    // called by update_profile_collection on request callback
    tool.get_track_profile_info = function(profile_id){
      var d = tool.DATA.profile_collection,
          x = 0,
          len = d.length;

      for(x;x<len;x++){
          if(d[x].profile_id == +profile_id){
            return d[x];
          }
      }
    };

    tool.axisTicks = function(extent){

      var tick_interpolate = d3.interpolate(extent[0],extent[1]);
      var dd = [0.1, 0.3, 0.5, 0.7, 0.9].map(function (a) {
          return tick_interpolate(a);
      });
      return dd;
    };

    tool.DATA.init_services = function(){


          // ERDDAP Tabledap requests


      var errdap_tabledap = "http://erddap.marine.rutgers.edu/erddap/tabledap/",

          errdap_track_vars = [
            "profile_id",
            "time",
            "latitude",
            "longitude"
          ],

          erddap_profile_vars = [
            "time",
            "depth",
            "salinity",
            "temperature",
            "conductivity",
            "density"
            //"chlorophyll_a",
            //"oxygen_concentration",
            //"oxygen_saturation",
            //"volumetric_backscatter_650nm"
          ];

      function _glider_track(dataset_id, date_start, date_end, variables, return_type) {

          // use user-defined variables array or local array
          var vars_track = typeof (variables) === "undefined" ? errdap_track_vars : variables,
              return_data_type = typeof (return_type) === "undefined" ? ".geoJson" : return_type,
              query = "&time%3E=" + date_start + "T00:00:00Z"+
                      "&time%3C=" + date_end + "T23:59:59Z";

          // build request url
          return errdap_tabledap + dataset_id + return_data_type + "?" + vars_track.join(",") + query;

      };

      function _profile(dataset_id, profile_id, variables) {

          var vars_profile = typeof (variables) === "undefined" ? erddap_profile_vars : variables,
              dataset_url = dataset_id + ".csvp?",
              query = "&profile_id=" + profile_id + "&" + vars_profile.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";

          return errdap_tabledap + dataset_url + "profile_id," +vars_profile.join(",") + query;

      };

      tool.DATA.erddap_endpoints = {
          glider_track : _glider_track,
          profile : _profile
      };

    };

    tool.UI.mousemove1 = function(){

      try{

      console.log("mouse moved on 1");

      var c = tool.configuration,
          erddap_ref = tool.settings.erddap_parameter_metadata,
          ref1 = erddap_ref[c.var1],
          ref2 = erddap_ref[c.var2],
          col_x1 = ref1.column,
          col_x2 = ref2.column,
          col_y = erddap_ref.depth.column,
          data = tool.DATA.dataset,
          chart1 = tool.UI.chart1,
          chart2 = tool.UI.chart2,
          chart3 = tool.UI.chart3,

          units1 = ref1.units,
          units2 = ref2.units,

          bisect_y = d3.bisector(function(d) { return d[col_y]; }).left,
          y0 = chart1.y.invert(d3.mouse(this)[1]),
          i = bisect_y(data, y0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = y0 - d0[col_y] > d1[col_y] - y0 ? d1 : d0,

          c1_dx = d[col_x1],
          c1_dy = d[col_y],
          c1_x = chart1.x(c1_dx),
          c1_y = chart1.y(c1_dy),
          c1_mid_x = ((chart1.extent_x[1] + chart1.extent_x[0]) / 2)>c1_dx ? {"text-anchor":"start", "x":"10"} : {"text-anchor":"end","x":"-10" },

          c2_dx = d[col_x2],
          c2_dy = d[col_y],
          c2_x = chart2.x(c2_dx),
          c2_y = chart2.y(c2_dy),
          c2_mid_x = ((chart2.extent_x[1] + chart2.extent_x[0]) / 2)>c2_dx ? {"text-anchor":"start", "x":"10"} : {"text-anchor":"end","x":"-10" },

          c3_x = chart3.x(c1_dx),
          c3_y = chart3.y(c2_dx),

          formatNum = d3.format(".2f");

          chart1.tooltip.attr("transform", "translate(" + c1_x + "," + c1_y + ")")
            .select("text")
            .text(formatNum(c1_dx), c1_dx)
            .html(formatNum(c1_dx) + " " + units1)
            .attr(c1_mid_x);

          chart2.tooltip.attr("transform", "translate(" + c2_x + "," + c2_y + ")")
            .select("text")
            .text(formatNum(c2_dx) + " ")
            .html(formatNum(c2_dx) + " " + units2)
            .attr(c2_mid_x);

          chart3.tooltip.attr("transform", "translate(" + c3_x + "," + c3_y + ")")
            .select("text")
            .text(formatNum(c1_dx) + " - " + formatNum(c2_dx))
            .html(formatNum(c1_dx) + " - " + formatNum(c2_dx))
            .attr(c1_mid_x);

          }
          catch(err){
            console.log("ERROR: ", err, err.message);
          }


    };

    tool.config_callback = function(){

      console.log("apply click");
      var c = tool.configuration;

      // update track profiles
      // data and charts are updated in subsequent callback

      tool.update_track_profiles(
        c.dataset_id,
        c.profile_id,
        c.date_start,
        c.date_end
      );

    };

    tool.UI.setup = function(){

      var ui = tool.UI.attrs,
          m = {top: 20, right: 20, bottom: 20, left: 20},
          w = 280 - m.left - m.right,
          h = 450 - m.top - m.bottom,
          _target = tool.dom_target;

      var erddap_ref = tool.settings.erddap_parameter_metadata,
          column_depth = erddap_ref.depth.column,
          config = tool.configuration,
          column1 = erddap_ref[config.var1],
          column2 = erddap_ref[config.var2],

          column_selected1 = column1.column,
          column_selected2 = column2.column,

          column_selected_title1 = column1.title,
          column_selected_title2 = column2.title;

      var ui_container = d3.select("#vistool")
        .append("div")
        .attr("id", "vis_container")
        .style({
          "width":"834px",
          "margin":"0",
          "height":"500px",
          "border":"2px solid #333333"
        });

      var svg = ui_container.append("svg")
        .attr("id", "svg_container")
        .attr("width", 830)
        .attr("height", 500)
        // .style("font-size","11px")
        // .style("font-family","Tahoma, Geneva, sans-serif");

      var charts = svg.append("g")
        .attr("transform", "translate(60,60)")
        .attr("width", 210)
        .attr("height", 320);

      //
      //Chart 1:
      //

      // Chart1: container
      var chart1 = charts.append("g")
        .attr("transform", "translate(20,0)")
        .attr("width", 210)
        .attr("height", 320);

      // Chart1: scales
      chart1.x = d3.scale.linear().range([0, 210]);
      chart1.y = d3.scale.linear().range([0, 320]);

      // Chart1: axis defs x and y
      chart1.axisX = d3.svg.axis()
        .scale(chart1.x)
        .orient("bottom")//.tickSize(5,0,0);

      chart1.axisY = d3.svg.axis()
        .scale(chart1.y)
        .orient("left");//.tickSize(0,0,0);

      // Chart1: x axis placement and call
      chart1.axis_x = chart1.append("g")
        .attr("id", _target+"_chart1_axisX")
        .attr("class", "x axis x1")
        .attr("transform", "translate(0," + 320 + ")")
        .call(chart1.axisX);

      // Chart1: y axis placement and call
      chart1.axis_y = chart1.append("g")
        .attr("id", _target+"_chart1_axisY")
        .attr("class", "y axis y1")
        //.attr("transform", "translate(0," + h + ")")
        .call(chart1.axisY);

      chart1.append("path")
        .attr("class", "line")
        .attr("d", chart1.line)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      chart1.line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return chart1.x(d[erddap_ref[config.var1].column]); })
        //.x(function(d) { return chart1.x(d[column_selected1]); })
        .y(function(d) { return chart1.y(d[column_depth]); });

      chart1.tooltip = chart1.append("g")
        .attr("class", "tooltip1")
        //.attr("transform", "translate(20,0)")
        .style("display", "none");

      chart1.tooltip.append("circle")
            .attr("r", 4.5);

      chart1.tooltip.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

      chart1.append("rect")
        .attr("class", "overlay")
        .attr("fill","none")
        .attr("pointer-events", "all")
        .attr("width", 210)
        .attr("height", 320)
        .on("mouseover", function() {
          chart1.tooltip.style("display", null);
          chart2.tooltip.style("display", null);
          chart3.tooltip.style("display", null);
        })
        .on("mouseout", function() {
          chart1.tooltip.style("display", "none");
          chart2.tooltip.style("display", "none");
          chart3.tooltip.style("display", "none");
          })
        .on("mousemove", tool.UI.mousemove1);


      console.log("ERDDAPPPP", column_selected1);

      //
      //Chart 2:
      //

      // Chart2: container
      var chart2 = charts.append("g")
        .attr("transform", "translate(240,0)")
        .attr("width", 210)
        .attr("height", 320);

      // Chart2: scales
      chart2.x = d3.scale.linear().range([0, 210]);
      chart2.y = d3.scale.linear().range([0, 320]);

      // Chart2: x axis definitions
      chart2.axisX = d3.svg.axis().scale(chart2.x).orient("bottom");//.tickSize(5,0,0);

      chart2.axisY = d3.svg.axis()
        .scale(chart2.y)
        .orient("left")
        .tickFormat("")
        .tickSize(3,3);//.tickSize(0,0,0);

      // Chart2: x axis placement and call
      chart2.axis_x = chart2.append("g")
        .attr("id", _target+"_chart2_axisX")
        .attr("class", "x axis x2")
        .attr("transform", "translate(0," + 320 + ")")
        .call(chart2.axisX);


      // Chart1: y axis placement and call
      chart2.axis_y = chart2.append("g")
        .attr("id", _target+"_chart2_axisY")
        .attr("class", "y axis y2")
        //.attr("transform", "translate(0," + h + ")")
        .call(chart2.axisY);


      chart2.append("path")
        .attr("class", "line")
        .attr("d", chart2.line)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      chart2.line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return chart2.x(d[erddap_ref[config.var2].column]); })
        .y(function(d) { return chart2.y(d[column_depth]); });

        chart2.tooltip = chart2.append("g")
          .attr("class", "tooltip2")
          //.attr("transform", "translate(210,0)")
          .style("display", "none");

        chart2.tooltip.append("circle")
              .attr("r", 4.5);

        chart2.tooltip.append("text")
              .attr("x", 9)
              .attr("dy", ".35em");

        chart2.append("rect")
          .attr("class", "overlay")
          .attr("fill","none")
          .attr("pointer-events", "all")
          .attr("width", 210)
          .attr("height", 320)
          .on("mouseover", function() {
            chart1.tooltip.style("display", null);
            chart2.tooltip.style("display", null);
            chart3.tooltip.style("display", null);
          })
          .on("mouseout", function() {
            chart1.tooltip.style("display", "none");
            chart2.tooltip.style("display", "none");
            chart3.tooltip.style("display", "none");
            })
          .on("mousemove", tool.UI.mousemove1);

      //
      //  Chart3 Chart:
      //

      var chart3 = charts.append("g")
        //.attr("transform", "translate(510,80)")
        .attr("transform", "translate(510,320)")
        .attr("width", 240)
        .attr("height", 240);
        // .style({
        //   "fill" : "#111111",
        //   "stroke" :"#999999",
        //   "stroke-width":"1px"
        // })

        chart3.x = d3.scale.linear().range([0, 240]);
        chart3.y = d3.scale.linear().range([0, -240]);

        chart3.axisX = d3.svg.axis()
          .scale(chart3.x)
          .orient("bottom");//.tickSize(5,0,0);

        chart3.axisY = d3.svg.axis()
          .scale(chart3.y)
          .innerTickSize(2)
          .tickPadding(1)
          .orient("left");//.tickSize(0,0,0);

        chart3.axis_x = chart3.append("g")
          .attr("id", _target+"_chart3_axisX")
          .attr("class", "x axis chart3")
          //.attr("transform", "translate(0," + 240 + ")")
          .call(chart3.axisX);

        chart3.axis_y = chart3.append("g")
          .attr("id", _target+"_chart3_axisY")
          .attr("class", "y axis chart3")
          .call(chart3.axisY)

        chart3.append("path")
          .attr("class", "line")
          .attr("d", chart3.line)
          .style("fill","none")
          .style("stroke","#999999")
          .style("stroke-width","2px");

        chart3.line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return chart3.x(d[erddap_ref[config.var1].column]); })
          .y(function(d) { return chart3.y(d[erddap_ref[config.var2].column]); });


          chart3.tooltip = chart3.append("g")
            .attr("class", "tooltip3")
            .style("display", "none");

          chart3.tooltip.append("circle")
                .attr("r", 4.5);

          chart3.tooltip.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");

          chart3.append("rect")
            .attr("class", "overlay")
            .attr("fill","none")
            .attr("pointer-events", "all")

            .attr("width", 210)
            .attr("height", 320)
            .on("mouseover", function() {
              //chart1.tooltip.style("display", null);
              //chart2.tooltip.style("display", null);
            })
            .on("mouseout", function() {
              //chart1.tooltip.style("display", "none");
              //chart2.tooltip.style("display", "none");
              })
            .on("mousemove", tool.UI.mousemove1);

      //
      //  labels
      //

      var labels = svg.append("g");

      chart1.labelY = labels.append("text")
        .attr("id", _target + "chart1_labelY")
        .attr("transform", "translate(0,220) rotate(270)")
        .attr("x",0)
        .attr("y",40)
        .attr("text-anchor", "middle")
        .text("Depth (m)");

      // chart1.labelX = labels.append("text")
      //   .attr("id", _target + "chart1_labelX")
      //   .attr("transform", "translate(185,420)")
      //   .attr("x",0)
      //   .attr("y",0)
      //   .attr("text-anchor", "middle")
      //   .text("var1");
      //
      // chart2.labelX = labels.append("text")
      //   .attr("id", _target + "chart2_labelX")
      //   .attr("transform", "translate(405,420)")
      //   .attr("x",0)
      //   .attr("y",0)
      //   .attr("text-anchor", "middle")
      //   .text("var2");

      chart3.labelX = labels.append("text")
        .attr("id", _target + "chart3_labelX")
        .attr("transform", "translate(690,420)")
        .attr("x",0)
        .attr("y",0)
        .attr("text-anchor", "middle")
        .text(column_selected_title1);

      chart3.labelY = labels.append("text")
        .attr("id", _target + "chart1_labelY")
        .attr("transform", "translate(532,260) rotate(270)")
        .attr("x",0)
        .attr("y",0)
        .attr("text-anchor", "middle")
        .text(column_selected_title2);

      chart3.labelName = labels.append("text")
        .attr("id", _target + "chart3_labelName")
        .attr("transform", "translate(692,90)")
        .attr("x","0")
        .attr("y",0)
        .attr("text-anchor", "middle")
        .attr("font-size","14px")
        .attr("font-weight","bold")
        .text("");

      chart3.labelTitle = labels.append("text")
        .attr("id", _target + "chart3_labelTitle")
        .attr("transform", "translate(570,110)")
        .attr("x",10)
        .attr("y",0)
        .attr("text-anchor", "start")
        .text("");

      chart3.labelTitleRight = labels.append("text")
        .attr("id", _target + "chart3_labelTitleRight")
        .attr("transform", "translate(810,110)")
        .attr("x",-20)
        .attr("y",0)
        .attr("text-anchor", "end")
        .text("");

      chart3.labelSubTitle = labels.append("text")
        .attr("id", _target + "chart3_labelSubTitle")
        .attr("transform", "translate(570,130)")
        .attr("x",10)
        .attr("y",0)
        .attr("text-anchor", "start")
        .text("");

      chart3.labelSubTitleRight = labels.append("text")
        .attr("id", _target + "chart3_labelSubTitleRight")
        .attr("transform", "translate(810,130)")
        .attr("x",0)
        .attr("y",0)
        .attr("text-anchor", "end")
        .text("");

    // chart1 title
    // chart2 title
    // chart3 title

    //
    //  Selectors
    //

      var x=0,len = erddap_ref.parameters.length;

      var select_vars = [];
      for(x;x<len;x++){

        select_vars.push(
          {
            "key": erddap_ref.parameters[x],
            "value": erddap_ref[erddap_ref.parameters[x]].title
          }
        );

      };

      // svg select box for chart 1

      svg_select(
        select_vars,
            erddap_ref[config.var1].title, {
            "key": "key",
            "value": "value"
        },
        "svg_container",
        function(id,variable){

          tool.UI.select_update(1, id,variable);

        },
        120,410,
        "select_var1"
      );

      // svg select box for chart 2
      svg_select(

        select_vars,
        erddap_ref[config.var2].title,
        {
            "key": "key",
            "value": "value"
        },
        "svg_container",

        function(id,variable){

          tool.UI.select_update(2, id,variable);

        },

        320,410,
        "select_var2"
      );

      // set UI references for later data updates

      tool.UI.chart1 = chart1;
      tool.UI.chart2 = chart2;
      tool.UI.chart3 = chart3;

    };

    tool.init_tool = function() {

      this.Glider_Profile_Comparer_OOI(this.dom_target);

    };

    tool.init_controls = function(target_div){

      tool.controls = {};
      tool.controls.Glider_Dataset_Browser_Control = EduVis.controls.Glider_Dataset_Browser_Control;
      tool.controls.Glider_Dataset_Browser_Control.init(tool);

    }

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

    /* SVG Dropdown */

    var svg_select = function (options_obj, option_selected, key_value_obj, dom_element, on_change_callback, x, y, id) {

        // todo.. add sorting
        // set data-attr-text and data-attr-value for select_box g element

        // known issues
        // svg parent element hight will cut off svg.. is there overflow outside the parent svg element?
        //

        var ui_settings = {
            "select_box": {
                "height": 24,
                    "width": 160
            }
        };

        var kv_key = key_value_obj.key,
            kv_val = key_value_obj.value;

        var dd_height = 24,
            dd_width = 160;

        var selected_var = option_selected,
            options_count = options_obj.length;

        var svg = d3.select("#"+dom_element).append("g")
            //.attr("id", "svg_svg")
            .attr("width", dd_width)
            .attr("height", dd_height * (options_count + 1))
            .attr("transform", "translate("+ x + "," + y +")")
            .style("font-size", "11px")
            .style("font-family", "Tahoma, Geneva, sans-serif");

        var select_selected = svg.append("g")
            .attr("transform", "translate(" + 0 + "," + 0 + ")");

        select_selected.append("path")
            .attr("stroke", "red")
            .attr("stroke-width", "1")
            .attr("fill","none")
            .attr("transform", "translate(140,2)")
            .attr("d","M2 8L8 2 14 8z M2 12L8 18 14 12z");

        var svg_select = select_selected.append("rect")
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("rx", "10")
            .attr("ry", "10")
            .attr("width", dd_width)
            .attr("height", dd_height)

            .style("pointer-events", "all")

            .on("click", function () {
            //svg_options.transition().style("height", );

              svg_options.style("display", "block");

              //console.log(dd_height, options_count);

          });

        var select_text = select_selected.append("text")
            .attr("id", "select_text")
            .attr("class", "dd_option_selected")
            .attr("pointer-events", "none")
            .attr("text-anchor", "left")
            .style("font-size", "12px")
            .attr("y", 8)
            .attr("x", 10)
            .attr("dy", ".75em")
            .attr("data-attr-val", selected_var)
            .text(selected_var);

        var svg_options = svg.append("g")
            .attr("id", id)
            .style("display", "none")
            .on("mouseover",function(){
                //console.log("mouse over");
            })
            .on("mouseout",function(){
                //console.log("mouse out");
            })

        var count = 1

        for (; count <= options_count; count++) {

            var select_key = options_obj[count - 1][kv_key],
                select_val = options_obj[count - 1][kv_val];

            // pop up or pop down
            var select_option = svg_options.append("g")
                .attr("data-attr-key", select_key)
                .attr("data-attr-val", select_val)
                .attr("class", "gdd_option")
                .attr("transform", "translate(" + 0 + ",-" + count * dd_height + ")");

            var textContainer = select_option.append("rect")
                .attr("class", "dd_option")
                .style("fill", "#6699CC")
                .style("pointer-events", "all")
                .attr("width", dd_width)
                .attr("height", dd_height)
                .on("mouseover", function () {
                d3.select(this).style("fill", "#666666");

            })
                .on("mouseout", function (a, b, c) {
                  d3.select(this).style("fill", "#6699CC");

            })
                .on("click", function () {

                  var parentNode = d3.select(this.parentNode),
                      tKey = parentNode.attr("data-attr-key"),
                      tVal = parentNode.attr("data-attr-val");

                  select_text
                      .text(tVal);

                  svg_options.style("display", "none");

                  on_change_callback(id,tKey);

            });

            var option = select_option.append("text")
                .attr("class", "dd_option")
                .style("pointer-events", "none")
                .style("font-size", "12px")
                .attr("y", 8)
                .attr("x", 10)
                .attr("dy", ".75em")
                .text(options_obj[count - 1][kv_val]);
        }
    };

}(EduVis));
