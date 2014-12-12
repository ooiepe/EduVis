/*

 * Glider Profile Comparer (GPC)
 * Revised 7/10/2014
 * Written by Mike Mills

*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Glider_Profile_Comparer",
        "description" : "Glider Profile Comparer",
        "url" : "",

        "version" : "0.1.1",
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
                "name" : "jquery_ui_js", 
                "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
              }
            ],

            "stylesheets" : [
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
                  "name" : "Glider_Profile_Comparer",
                  "src" : "Glider_Profile_Comparer.css"
                },
              ]
          }
            
        },

        "configuration" : {
          "dataset_id" : "OOI-GP05MOAS-GL001",
          "dataset_name" : "GP05MOAS", 
          "profile_id" : "44",
          "parameter1" : "temperature",
          "parameter2" : "chlorophyll_a",
          "date_start": "2013-09-17",
          "date_end": "2014-03-03"
        },

        "data" : {},
        "target_div" : "",
        "tools" : {},
        "settings" : {},
        
        "controls" : {
          "slider" : {
            "date_start" : null,
            "date_end" : null,
            "date_range_start" : null,
            "date_range_end" : null
          }
        }

    };

    tool.Glider_Profile_Comparer = function( _target ){

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

        "parameters" : ["temperature", "salinity", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter"]
      };

      // setup UI
      $("<div />")
        .css({
          "width":"820px",
          "margin":"0",
          "height":"500px",
          "border":"1px solid red"
        })
        .append(

          $("<div />")
            .attr("id", _target + "-charts")
            .css({
              "height":"800px",
              "width":"420px"              
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
                      .attr("id", _target + "-control-parameter1-dropdown")
                )
                .append(
                    $("<select />")
                      .attr("id", _target + "-control-parameter2-dropdown")
                )
            )
        )
        .appendTo("#"+_target);

      // initialize the visualization
      tool.visualization_setup();

      EduVis.tool.load_complete(this);

    };

    tool.visualization_setup = function(){

      var g = tool.graph = {},
        _target = tool.dom_target;

      var erddap_ref = tool.settings.erddap_parameter_metadata,
          column_depth = erddap_ref.depth.column,
          config = tool.configuration,
          param1 = erddap_ref[config.parameter1],
          param2 = erddap_ref[config.parameter2],
          column_selected1 = param1.column,
          column_selected2 = param2.column,
          column_selected_title1 = param1.title,
          column_selected_title2 = param2.title,
          column_selected_title3 = "THIS TITLE";

      g.margin = {top: 40, right: 10, bottom: 40, left: 46};
      g.width_viz = 800;// - g.margin.left - g.margin.right; 
      g.width = g.width_viz / 3 - g.margin.left - g.margin.right;
      g.height = 450 - g.margin.top - g.margin.bottom;
      
      //g.parseDate = d3.time.format.iso.parse;
      
      g.x1 = d3.scale.linear().range([0, g.width]);
      g.y1 = d3.scale.linear().range([0, g.height]);
      
      g.xAxis1 = d3.svg.axis().scale(g.x1).orient("bottom").ticks(10);//.tickSize(5,0,0);
      g.yAxis1 = d3.svg.axis().scale(g.y1).orient("left");//.tickSize(0,0,0);

      g.x2 = d3.scale.linear().range([0, g.width]);
      g.y2 = d3.scale.linear().range([0, g.height]);
      
      g.xAxis2 = d3.svg.axis().scale(g.x2).orient("bottom").ticks(10);//.tickSize(5,0,0);
      g.yAxis2 = d3.svg.axis().scale(g.y2).orient("left");//.tickSize(0,0,0);
      
      g.x3 = d3.scale.linear().range([0, g.width]);
      g.y3 = d3.scale.linear().range([g.height,0]);

      g.xAxis3 = d3.svg.axis().scale(g.x3).orient("bottom").ticks(10);//.tickSize(5,0,0);
      g.yAxis3 = d3.svg.axis().scale(g.y3).orient("left");//.tickSize(0,0,0);
      
      g.svg = d3.select("#"+_target + "-viz-container").append("svg")
        .attr("id",_target+"_svggraph")
        .attr("width", g.width_viz)
        .attr("height", g.height + g.margin.top + g.margin.bottom)
        .style("font-size","11px")
        .style("font-family","Tahoma, Geneva, sans-serif");

      g.svg.append("defs").append("clipPath")
          .attr("id", _target+"_clip")
        .append("rect")
          .attr("width", g.width_viz)
          .attr("height", g.height);

      g.chart1 = g.svg.append("g")
        .attr("id", _target+"_chart1")
        .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");

      g.chart2 = g.svg.append("g")
        .attr("id", _target+"_chart2")
        .attr("transform", "translate(" + (g.width + g.margin.left*2) + "," + g.margin.top + ")");

      g.chart3 = g.svg.append("g")
        .attr("id", _target+"_chart3")
        .attr("transform", "translate(" + (g.width*2 + g.margin.left*3) + "," + g.margin.top + ")");
      
      // chart 1.. chart on left

      g.chart1.append("g")
        .attr("id", _target+"_xAxis1")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .style({
          "fill" : "none",
          "stroke" :"#666666"
          //,"stroke-width":"1px"
        })
        .call(g.xAxis1);
        
      g.chart1.append("g")
        .attr("id", _target+"_yAxis1")
        .attr("class", "y axis")
        .style({
          "fill" : "none",
          "stroke" :"#666666",
          "stroke-width":"1px"
        })
        .call(g.yAxis1);
      
      g.chart1.append("path")
        .attr("class", "line")
        .attr("d", g.line1)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      g.mouse_focus1 = g.chart1.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus1.append("circle")
          .attr("r", 4.5);

      g.mouse_focus1.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      g.mousemover1 = g.chart1.append("rect")
        .attr("class", "overlay")
        .attr("width", g.width)
        .attr("height", g.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { g.mouse_focus1.style("display", null); })
        .on("mouseout", function() { g.mouse_focus1.style("display", "none"); });

     // alert(column_selected1 + " - " + column_depth);

      g.line1 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x1(d[tool.settings.erddap_parameter_metadata[config.parameter1].column]); })
        .y(function(d) { return g.y1(d[column_depth]); });

      g.title1 = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 20) + "," + (0) + ") ")
        .text(tool.configuration.dataset_name);
        //.attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")

      g.subtitle1 = g.svg.append("text")
        .attr("class", "gsubtitle")
        .attr("text-anchor", "left")
        .style("font-size", "11px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.margin.left + 20) + "," + (18) + ") ")
        .text(
          "Profile " + config.profile_id + ": " + column_selected_title1 + " and  "+ column_selected_title2 
        );

      g.ylabel1 = g.svg.append("text")
        .attr("id", _target+"_ylabel1")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text("Depth (m)");

      g.xlabel1 = g.svg.append("text")
        .attr("id", _target+"_xlabel1")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( column_selected1);

      //chart 2 

      g.chart2.append("g")
        .attr("id", _target+"_xAxis2")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .style({
          "fill" : "none",
          "stroke" :"#666666"
          //,"stroke-width":"1px"
        })
        .call(g.xAxis2);
        
      g.chart2.append("g")
        .attr("id", _target+"_yAxis2")
        .attr("class", "y axis")
        .style({
          "fill" : "none",
          "stroke" :"#666666",
          "stroke-width":"1px"
        })
        .call(g.yAxis2);
      
      g.chart2.append("path")
        .attr("class", "line")
        .attr("d", g.line2)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      g.mouse_focus2 = g.chart2.append("g")
        .attr("class", "focus")
        .style("display", "none");

      g.mouse_focus2.append("circle")
          .attr("r", 4.5);

      g.mouse_focus2.append("text")
          .attr("x", 9)
          .attr("dy", ".35em");

      g.mousemover2 = g.chart2.append("rect")
        .attr("class", "overlay")
        .attr("width", g.width)
        .attr("height", g.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { g.mouse_focus2.style("display", null); })
        .on("mouseout", function() { g.mouse_focus2.style("display", "none"); });

      g.line2 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x2(d[tool.settings.erddap_parameter_metadata[config.parameter2].column]); })
        .y(function(d) { return g.y2(d[column_depth]); });

      // g.title2 = g.svg.append("text")
      //   .attr("class", "gtitle")
      //   .attr("text-anchor", "left")
      //   .style("font-size", "16px")
      //   .attr("y", 0)
      //   .attr("dy", ".75em")
      //   .attr("transform", "translate(" + (g.width + g.margin.left*2 + 20) + "," + (0) + ") ")
      //   .text(tool.configuration.dataset_name);
      //   //.attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")

      // g.subtitle2 = g.svg.append("text")
      //   .attr("class", "gsubtitle")
      //   .attr("text-anchor", "left")
      //   .style("font-size", "11px")
      //   .attr("y", 0)
      //   .attr("dy", ".75em")
      //   .attr("transform", "translate(" + (g.width + g.margin.left*2 + 20) + "," + (18) + ") ")
      //   .text(
      //     column_selected_title2 + " Profile: "+ config.profile_id 
      //   );

      g.ylabel2 = g.svg.append("text")
        .attr("id", _target+"_ylabel2")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (g.width + g.margin.left) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text("Depth (m)");

      g.xlabel2 = g.svg.append("text")
        .attr("id", _target+"_xlabel2")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width + g.width/2+g.margin.left*2) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( column_selected2);

      //chart 3

      g.chart3.append("g")
        .attr("id", _target+"_xAxis3")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .style({
          "fill" : "none",
          "stroke" :"#666666"
          //,"stroke-width":"1px"
        })
        .call(g.xAxis3);
        
      g.chart3.append("g")
        .attr("id", _target+"_yAxis3")
        .attr("class", "y axis")
        .style({
          "fill" : "none",
          "stroke" :"#666666",
          "stroke-width":"1px"
        })
        .call(g.yAxis3);
      
      g.chart3.append("path")
        .attr("class", "line")
        .attr("d", g.line3)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      // g.mouse_focus3 = g.chart3.append("g")
      //   .attr("class", "focus")
      //   .style("display", "none");

      // g.mouse_focus3.append("circle")
      //     .attr("r", 4.5);

      // g.mouse_focus3.append("text")
      //     .attr("x", 9)
      //     .attr("dy", ".35em");

      // g.mousemover3 = g.chart3.append("rect")
      //   .attr("class", "overlay")
      //   .attr("width", g.width)
      //   .attr("height", g.height)
      //   .style("fill", "none")
      //   .style("pointer-events", "all")
      //   .on("mouseover", function() { g.mouse_focus3.style("display", null); })
      //   .on("mouseout", function() { g.mouse_focus3.style("display", "none"); });

      g.line3 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x3(d[tool.settings.erddap_parameter_metadata[config.parameter2].column]); })
        .y(function(d) { return g.y3(d[tool.settings.erddap_parameter_metadata[config.parameter1].column]); });

      g.title3 = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "left")
        .style("font-size", "16px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width*2 + g.margin.left*3 + 20) + "," + (0) + ") ")
        .text(tool.configuration.dataset_name);

      g.subtitle3 = g.svg.append("text")
        .attr("class", "gsubtitle")
        .attr("text-anchor", "left")
        .style("font-size", "11px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width*2 + g.margin.left*3 + 20) + "," + (18) + ") ")
        .text(
          column_selected_title3 + " Profile: "+ config.profile_id 
        );

      g.ylabel3 = g.svg.append("text")
        .attr("id", _target+"_ylabel3")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (g.width + g.margin.left)*2 + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text(" this Y label - graph3 X");

      g.xlabel3 = g.svg.append("text")
        .attr("id", _target+"_xlabel3")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width*2 + g.width/2+g.margin.left*3) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( "this X label - graph2 X");

      // initialize visualization controls

      // create reference to dropdown
      var parameter_dropdown1 = $("#"+ _target + "-control-parameter1-dropdown"),
          parameter_dropdown2 = $("#"+ _target + "-control-parameter2-dropdown");
      
      // add parameters to dropdowns
      $.each(erddap_ref.parameters, function (index, parameter_option) {

        parameter_dropdown1
          .append(
            $('<option></option>')
              .val(parameter_option)
              .html(
                erddap_ref[parameter_option].title
              )
          );

        parameter_dropdown2
          .append(
            $('<option></option>')
              .val(parameter_option)
              .html(
                erddap_ref[parameter_option].title
              )
          );
      });

      // set initial value of dropdown and set change event to update chart
      parameter_dropdown1
        .val( tool.configuration.parameter1 )
        .on("change", function(a){
          
          tool.configuration.parameter1 = $(this).val();
          tool.graph_update(tool.configuration.profile_id, "1");
        });

      parameter_dropdown2
        .val( tool.configuration.parameter2 )
        .on("change", function(a){
          
          tool.configuration.parameter2 = $(this).val();
          tool.graph_update(tool.configuration.profile_id, "2");
        });

      tool.graph_profile_update(config.profile_id);

    };

    tool.erddap_request_profile = function(dataset_id, profile_id, columns_selected){
      var tabledap_url = "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/",
      dataset_url = dataset_id + ".csvp?",
      columns_default = ["time","depth", "salinity", "temperature", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter_650nm"],
      columns = typeof columns_selected === "object" ? columns_selected : columns_default,
      query = "&profile_id=" + profile_id + "&" + columns.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";

      return tabledap_url + dataset_url + "profile_id," +columns.join(",") + query;
    };

    tool.erddap_dataset_query = function(params_obj){

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

    tool.init_graph = function(pid){

       //profile.setStyle(tool.mapping.styles.profile_click);
      var profile_id = pid,
          lat, lng;

      tool.graph_profile_update(profile_id);

      // tool.graph_update(profile_id, "1");//, lat, lng);
      // tool.graph_update(profile_id, "2");

      //tool.slider_update(profile_id);

    };

    // updates the profile data.. requests new csv
    tool.graph_profile_update = function(pid){

      var g = tool.graph,
          profile_id = typeof pid === "undefined" ? tool.configuration.profile_id : pid,
          dataset_id = tool.configuration.dataset_id;

      d3.csv( tool.erddap_request_profile(dataset_id, profile_id), function(error,data){

        console.log("error", error, data);     

        var erddap_ref = tool.settings.erddap_parameter_metadata,
            column_depth = erddap_ref.depth.column,
            config = tool.configuration,
            column_time = erddap_ref.time.column;            

          // clean all parameter data.. loop through all parameters for each data record
          data.forEach(function(d) {
            $.each(erddap_ref.parameters, function(index, param){
                d[erddap_ref[param].column] = + d[erddap_ref[param].column];
            });

            d[column_depth] = +d[column_depth];
            // todo: parse time column here

          });

      
          tool.data[pid] = data;

          tool.graph_update(tool.configuration.profile_id, "1");
          tool.graph_update(tool.configuration.profile_id, "2");

      });

    };

    // updates the graph to use the selected parameter
    tool.graph_update = function(pid, chart_num){

        var data = tool.data[pid],
            g = tool.graph,
            
            erddap_ref = tool.settings.erddap_parameter_metadata,
            column_depth = erddap_ref.depth.column,
            config = tool.configuration,
            
            param1 = erddap_ref[config.parameter1],
            param2 = erddap_ref[config.parameter2],

            param_selected = erddap_ref[config["parameter"+chart_num]],
            
            column_selected = param_selected.column,
            column_selected_title = param_selected.title,
            column_time = erddap_ref.time.column,
            
            bisectData = d3.bisector(function(d) { return d[column_depth]; }).left,
            bisectScatter = d3.bisector(function(d) { return d[param1.column]; }).left,
            profile_date;

        // update x and y domains depth and the selected
        g["x"+chart_num].domain(d3.extent(data, (function(d) { return d[column_selected]; })));
        
        // update the y domain to use the range of the returned data
        g["y"+chart_num].domain(d3.extent(data, (function(d) { return d[column_depth]; })));
        
        // update chart line
        g["chart" + chart_num].selectAll("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", g["line"+chart_num]);

        // update x and y domains for the scatter plot
        g.x3.domain(d3.extent(data, (function(d) { return d[param2.column]; })));
        g.y3.domain(d3.extent(data, (function(d) { return d[param1.column]; })));
          
        g.chart3.selectAll("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", g.line3);
   
        g.scatter = g.chart3.selectAll("circle")
          .data(data);

        g.scatter
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("cx", function (d) { return g.x3(d[param2.column]); })
          .attr("cy", function (d) { return g.y3(d[param1.column]); })
          .attr("r", "5")

        g.scatter.enter()
          .append("circle")
          .attr("class", "circle")
          .attr("cx", function (d) { return g.x3(d[param2.column]); })
          .attr("cy", function (d) { return g.y3(d[param1.column]); })
          .attr("r", "5")
          .style("fill", "red")
          .style("stroke", "blue")
          .style("stroke-width", "1px");

        g.scatter.exit().remove();

        // update chart title with profile id and date
        profile_date = data[0]["time (UTC)"].slice(0,10);
        
        // g["title"+chart_num].text(
        //   tool.configuration.dataset_name + " - " + profile_date
        // );

        // g["subtitle"+chart_num].text(
        //   " Profile: "+ pid 
        // );

        g["xlabel"+chart_num].text(
          column_selected_title + 
          (param_selected.units !== "" ? " (" + param_selected.units + ")" : "")
        );

        g["title3"].text(
         "" // tool.configuration.dataset_name + " - " + profile_date
        );

        g["subtitle3"].text(
          param1.title + " vs. " + param2.title
        );

        g["ylabel3"].text(
          param1.title + 
          (param1.units !== "" ? " (" + param1.units + ")" : "")
        );

        g["xlabel3"].text(
          param2.title + 
          (param2.units !== "" ? " (" + param2.units + ")" : "")
        );

        // // update x and y axis 
        d3.select("#"+tool.dom_target+"_yAxis" + chart_num).call(g["yAxis"+chart_num]);
        d3.select("#"+tool.dom_target+"_xAxis" + chart_num).call(g["xAxis"+chart_num]);

        // // update x and y axis 
        d3.select("#"+tool.dom_target+"_yAxis3").call(g["yAxis3"]);
        d3.select("#"+tool.dom_target+"_xAxis3").call(g["xAxis3"]);

        //mouse move
        g["mousemover"+chart_num].on("mousemove", function(){

          var chartMiddle = g.width / 2,
              mouseY = d3.mouse(this)[1],
              y0 = g["y"+chart_num].invert(mouseY),
              i = bisectData(data, y0, 1),
              d0 = data[i - 1],
              d1 = data[i],
              d = y0 - d0[column_depth] > d1[column_depth] - y0 ? d1 : d0,
              chartMidPoint = (g["x"+chart_num].domain()[1] + g["x"+chart_num].domain()[0])/2,
              xPosition = d[column_selected] > chartMidPoint ? -100 : 0;
          
          g["mouse_focus" + chart_num].attr("transform", "translate(" + g["x"+ chart_num](d[column_selected]) + "," + g["y"+ chart_num](d[column_depth]) + ")");

          g["mouse_focus" + chart_num].select("text").text(d3.round(d[column_depth], 1) + " m - " + d3.round(d[column_selected], 2))
            .attr("transform", "translate(" + xPosition + "," + 0 + ")");

        });

        // //mouse move
        // g["mousemover3"].on("mousemove", function(){

        //   var chartMiddle = g.width / 2,
        //       mouseY = d3.mouse(this)[1],
        //       column_depth = param1.column,
        //       y0 = g.y3.invert(mouseY),
        //       i = bisectData(data, y0, 1),
        //       d0 = data[i - 1],
        //       d1 = data[i],
        //       d = y0 - d0[column_depth] > d1[column_depth] - y0 ? d1 : d0,
        //       chartMidPoint = (g.x3.domain()[1] + g.x3.domain()[0])/2,
        //       xPosition = d[column_selected] > chartMidPoint ? -100 : 0;
          
        //   g["mouse_focus3"].attr("transform", "translate(" + g["x3"](d[column_selected]) + "," + g["y3"](d[column_depth]) + ")");

        //   g["mouse_focus3"].select("text").text(d3.round(d[column_depth], 1) + " m - " + d3.round(d[column_selected], 2))
        //     .attr("transform", "translate(" + xPosition + "," + 0 + ")");

        // });
       

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

      this.Glider_Profile_Comparer(this.dom_target);

    };

    tool.init_controls = function(target_div){

    };

    tool.init_controls_orig = function(target_div){
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
              .on("change", function(evt){

                  console.log("this config_dataset_id change event", this);

                  var val = evt.target.value;
                
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


                })
                .done(function (resp) {
                  console.log("done", resp);
                    
                })
                .fail(function (resp) {
                
                  console.log("fail", resp);
                })

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

                    $("<input />")
                      .attr("id","config-date_start-input")
                      .addClass('datepicker')
                      .datepicker({
                        "dateFormat": "yy-mm-dd",
                        "changeMonth": true,
                        "changeYear": true,
                        "onClose" : function(d,i){
                          var el_end_date = $("#config-date_end-input");
                          el_end_date.datepicker("option","minDate", d);

                          tool.config_dateRange_slider(slider.date_start, slider.date_end, d, el_end_date.val());
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
                        "changeMonth": true,
                        "changeYear": true,
                        "onClose" : function(d,i){
                          var el_start_date = $("#config-date_start-input");
                          el_start_date.datepicker("option", "maxDate", d);
                          tool.config_dateRange_slider(slider.date_start, slider.date_end, el_start_date.val(), d);
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

                    // update map
                    tool.control_map_update();

                  })
              )
          )
          .appendTo("#vistool-controls");


        //console.log("request advanced search for cdm data", this);  

        // only request datasets with institution of OOI
        $.getJSON('http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.json', 
          {
            "page":"1",
            "itemsPerPage":"1000",
            "searchFor":"",
            "cdm_data_type":"trajectoryprofile",
            "protocol":"tabledap",
            "institution": "ooi",

          }, function(json) {
            
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

            tool.control_map_update();

        })
        .done(function (resp) {
          console.log("done", resp);
        })
        .fail(function (resp) {
          console.log("request failed", resp);
        });
    
    };

    tool.control_map_update = function(){

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
        map.fitBounds(mapObj.layer_locations.getBounds());

        // initialize map with first profile
        tool.init_graph(mapObj.profile_ids.keys()[0]);

      }); // end get json
 
    };

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
