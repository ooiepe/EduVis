/*

 * Glider Profile Comparer OOI (GPC OOI)
 * Revised 10/14/2014
 * Written by Michael Mills, Rutgers University

*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Glider_Profile_Comparer_OOI",
        "description" : "Glider Profile Comparer",
        "url" : "",

        "version" : "0.0.1",
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
                  "name" : "Glider_Profile_Comparer_OOI",
                  "src" : "Glider_Profile_Comparer_OOI.css"
                },
              ]
          },

          "datasets" : []

        },

        "configuration" : {
          "dataset_id" : "CE05MOAS-ce_312-20140420T2200",
          "profile_id" : "105",
          "var1" : "salinity",
          "var2" : "temperature",
          "date_start": "2014-05-02",
          "date_end": "2014-06-10"

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

    tool.Glider_Profile_Comparer_OOI = function( _target ){

      tool.DATA.init();

      tool.UI.init();

      tool.UI.setup();

      tool.update_chart(this.configuration.dataset_id, this.configuration.profile_id);


//http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2200.csvp?profile_id,temperature,salinity,conductivity&profile_id=207&temperature!=NaN&salinity!=NaN&conductivity!=NaN&orderBy(%22depth%22)
      // check all data sources and download
      // 1. track data.. profile ID / time
      // 2. initial profile

      // set up UI
      // event UI

      EduVis.tool.load_complete(this);

    };

    tool.update_chart = function(dataset_id, profile_id){

      d3.csv( tool.DATA.erddap_endpoints.profile(dataset_id, profile_id), function(error,data){

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
            profile_date;

        console.log("Data downloaded", data);

        data.forEach(function(d) {
          //d[column_date] = g.parseDate(d[column_date]);
          d[column_depth] = +d[column_depth];
          d[column_selected1] = +d[column_selected1];
          d[column_selected2] = +d[column_selected2];
        });


        chart1.x.domain(d3.extent(data, (function(d) { return d[column_selected1]; })));

        // update the y domain to use the range of the returned data.
        chart1.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

        chart1.select(".x.axis").call(chart1.axisX);
        chart1.select(".y.axis").call(chart1.axisY);

        // update chart line
        chart1.select("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", chart1.line);

        // chart1.call(chart1.axisX);

        chart2.x.domain(d3.extent(data, (function(d) { return d[column_selected2]; })));

        // update the y domain to use the range of the returned data.
        chart2.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

        chart2.select(".x.axis").call(chart2.axisX);

        // update chart line
        chart2.select("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", chart2.line);

        chart3.x.domain(d3.extent(data, (function(d) { return d[column_selected1]; })));

        // update the y domain to use the range of the returned data.
        chart3.y.domain(d3.extent(data, (function(d) { return d[column_selected2]; })));

        chart3.select(".x.axis").call(chart3.axisX);
        chart3.select(".y.axis").call(chart3.axisY);

        // update chart line
        chart3.select("path.line")
          .data([data])
          .transition()
          .duration(1000)
          .ease("linear")
          .attr("d", chart3.line);

        tool.DATA.dataset = data;

      });


      //
      //   // clean depth and selected column values
      //   data.forEach(function(d) {
      //     //d[column_date] = g.parseDate(d[column_date]);
      //     d[column_depth] = +d[column_depth];
      //     d[column_selected] = +d[column_selected];
      //   });
      //
      //   // update x and y domains depth and the selected
      //   g.x.domain(d3.extent(data, (function(d) { return d[column_selected]; })));
      //
      //   // update the y domain to use the range of the returned data.
      //   g.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));
      //
      //   // update chart line
      //   g.svg.selectAll("path.line")
      //     .data([data])
      //     .transition()
      //     .duration(1000)
      //     .ease("linear")
      //     .attr("d", g.line);
      //
      //   // update chart title with profile id and date
      //   profile_date = data[0]["time (UTC)"];

    };


    tool.select_update = function(chart_id, id, variable){

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

      data.forEach(function(d) {
        //d[column_date] = g.parseDate(d[column_date]);
        d[column_depth] = +d[column_depth];
        d[column_selected] = +d[column_selected];
      //  console.log("SELECTED", d[column_selected]);
      });

      console.log("SELECTED", column_selected);

      chart.x.domain(d3.extent(data, (function(d) { return d[column_selected]; })));

      // update the y domain to use the range of the returned data.
      chart.y.domain(d3.extent(data, (function(d) { return d[column_depth]; })));

      //chart.select(".x.axis").call(chart.axisX);
      //chart.select(".y.axis").call(chart.axisY);

      // update chart line
      chart.select("path.line")
        .data([data])
        .transition()
        .duration(1000)
        .ease("linear")
        .attr("d", chart.line);

      chart.axis_x.call(chart.axisX);

      if(chart_id == 1){
        chart3.x.domain(d3.extent(data, (function(d) { return d[column_selected]; })));
        chart3.axis_x.call(chart3.axisX);
        chart3.labelX.text(column_selected_title);
      }
      else{
        chart3.y.domain(d3.extent(data, (function(d) { return d[column_selected]; })));
        chart3.axis_y.call(chart3.axisY)
        chart3.labelY.text(column_selected_title);
      }

      chart3.select("path.line")
        .data([data])
        .transition()
        .duration(1000)
        .ease("linear")
        .attr("d", chart3.line);


    };

    tool.UI.setup = function(){

      var ui = tool.UI.attrs,
          c = ui.chart,
          w = c.width,
          h = c.height,
          m = ui.margin,
          sh = c.height,
          sw = 2*w + m.left,
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

    /*

    Chart 1:

    */

      // Chart1: container
      var chart1 = charts.append("g")
        .attr("transform", "translate(20,0)")
        .attr("width", 210)
        .attr("height", 320);

      // Chart1: scales
      chart1.x = d3.scale.linear().range([0, 210]);
      chart1.y = d3.scale.linear().range([0, 320]);

      // Chart1: axis defs x and y
      chart1.axisX = d3.svg.axis().scale(chart1.x).orient("bottom");//.tickSize(5,0,0);
      chart1.axisY = d3.svg.axis().scale(chart1.y).orient("left");//.tickSize(0,0,0);

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
        .interpolate("monotone")
        .x(function(d) { return chart1.x(d[erddap_ref[config.var1].column]); })
        //.x(function(d) { return chart1.x(d[column_selected1]); })
        .y(function(d) { return chart1.y(d[column_depth]); });

      console.log("ERDDAPPPP", column_selected1);


  /*

  Chart 2:

  */

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
      //chart2.axisY = d3.svg.axis().scale(chart2.y).orient("left");//.tickSize(0,0,0);

      // Chart2: x axis placement and call
      chart2.axis_x = chart2.append("g")
        .attr("id", _target+"_chart2_axisX")
        .attr("class", "x axis x2")
        .attr("transform", "translate(0," + 320 + ")")
        .call(chart2.axisX);

      chart2.append("path")
        .attr("class", "line")
        .attr("d", chart2.line)
        .style("fill","none")
        .style("stroke","#999999")
        .style("stroke-width","2px");

      chart2.line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return chart2.x(d[erddap_ref[config.var2].column]); })
        .y(function(d) { return chart2.y(d[column_depth]); });

/*

  chart3 Chart:

*/

      var chart3 = charts.append("g")
        .attr("transform", "translate(510,80)")
        .attr("width", 240)
        .attr("height", 240);
        // .style({
        //   "fill" : "#111111",
        //   "stroke" :"#999999",
        //   "stroke-width":"1px"
        // })

        chart3.x = d3.scale.linear().range([0, 240]);
        chart3.y = d3.scale.linear().range([0, 240]);

        chart3.axisX = d3.svg.axis().scale(chart3.x).orient("bottom");//.tickSize(5,0,0);
        chart3.axisY = d3.svg.axis().scale(chart3.y).orient("left");//.tickSize(0,0,0);

        chart3.axis_x = chart3.append("g")
          .attr("id", _target+"_chart3_axisX")
          .attr("class", "x axis chart3")
          .attr("transform", "translate(0," + 240 + ")")
          .call(chart3.axisX);

        chart3.axis_y = chart3.append("g")
          .attr("id", _target+"_chart3_axisY")
          .attr("class", "y axis chart3")
          .call(chart3.axisY);

        chart3.append("path")
          .attr("class", "line")
          .attr("d", chart3.line)
          .style("fill","none")
          .style("stroke","#999999")
          .style("stroke-width","2px");

        chart3.line = d3.svg.line()
          .interpolate("monotone")
          .x(function(d) { return chart3.x(d[erddap_ref[config.var1].column]); })
          .y(function(d) { return chart3.y(d[erddap_ref[config.var2].column]); });

/*

  labels

*/
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
        .attr("transform", "translate(540,220) rotate(270)")
        .attr("x",0)
        .attr("y",0)
        .attr("text-anchor", "middle")
        .text(column_selected_title2);

/*

  Selectors

*/

      var x=0,len = erddap_ref.parameters.length;

      var select_vars = [];
      for(x;x<len;x++){

        select_vars.push(
          {
            "key": erddap_ref.parameters[x],
            "value": erddap_ref[erddap_ref.parameters[x]].title
          }
        );
      }

    // svg select box for chart 1

      svg_select(
        select_vars,
            erddap_ref[config.var1].title, {
            "key": "key",
            "value": "value"
        },
        "svg_container",
        function(id,variable){

          tool.select_update(1, id,variable);

        },
        120,400,
        "select_var1");

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

          tool.select_update(2, id,variable);

        },

        320,400,
        "select_var2");

      // set UI references for later data updates

      tool.UI.chart1 = chart1;
      tool.UI.chart2 = chart2;
      tool.UI.chart3 = chart3;


    };

    tool.DATA.init = function(){

    /*
        ERDDAP Tabledap requests
    */

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

      function _glider_track(dataset_id, date_start, date_end, variables) {

          // use user-defined variables array or local array
          var vars_track = typeof (variables) === "undefined" ? errdap_track_vars : variables,
              query = "&time%3E=" + date_end +
                      "&time%3C=" + date_end;

          // build request url
          return errdap_tabledap + dataset_id + ".geoJson?" + vars_track.join(",") + query;

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


      /*
          ERDDAP init datasets
      */

      console.log("tool.Data INITIALIZED", tool.DATA);

    };

    tool.UI.init = function (){

      // add to #vistool div
      var v = {
        "width" : 820,
        "height" : 500
      };

      var m = {top: 20, right: 20, bottom: 20, left: 20};

      var c = {
        "width" : 280 - m.left - m.right,
        "height" : 450 - m.top - m.bottom
      };

      tool.UI.attrs = {

        visualization: v,
        chart : c,
        margin : m
      };

    };

    tool.ui_setup = function(){

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

      // setup UI
      $("<div />")
        .css({
          "width":"840px",
          "margin":"0",
          "height":"500px"
        })
        .append(
//
          $("<div />")
            .attr("id", "map-container")
            .css({


              "float":"left",
              "height":"450px",
              "width":"320px"


            })
            .append(

              $("<div />")
                .attr("id", "gpe-map-title")
                .html(tool.configuration.dataset_id + " Profile Locations")
            )
            .append(

              $("<div />")
                .attr("id", "gpe-map")
                .height(320)
                .width(320)
            )
            .append(
              $("<div />")
                .attr("id", "gpe-map-tools")
                .append(
                  $("<div />")
                    .css({"margin-top":"12px","width":"320px"})
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
                .append(
                    $("<select />")
                      .attr("id", _target + "-control-parameter-dropdown2")
                )
            )
            //.html("visualization")
        )
        .appendTo("#"+_target);

      // initialize the visualization
      tool.visualization_setup();

      tool.init_graph(1);

      // initialize the map
      // tool.map_setup();

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
      g.width = 320 - g.margin.left - g.margin.right;
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

      g.chart2 = g.svg.append("g")
        .attr("transform", "translate(" + "0" + "," + g.margin.top + ")");

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

      g.chart2.append("path")
        .attr("class", "line")
        .attr("d", g.line2)
        .style("fill","none")
        .style("stroke","#6699CC")
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
        .x(function(d) { return g.x(d[erddap_ref[config.var1].column]); })
        .y(function(d) { return g.y(d[column_depth]); });

      g.line2 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x(d[erddap_ref[config.var2].column]); })
        .y(function(d) { return g.y(d[column_depth]); });

      g.title = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "left")
        .style("font-size", "16px")
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
      var parameter_dropdown = $("#"+ _target + "-control-parameter-dropdown"),
          parameter_dropdown2 = $("#"+ _target + "-control-parameter-dropdown2");

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
      parameter_dropdown
        .val( tool.configuration.parameter )
        .on("change", function(a){

          tool.configuration.parameter = $(this).val();
          tool.graph_update(tool.configuration.profile_id);

        });

      parameter_dropdown2
        .val( tool.configuration.parameter2 )
        .on("change", function(a){

          tool.configuration.parameter2 = $(this).val();
          tool.graph_update(tool.configuration.profile_id2);

        });

    };

    tool.erddap_request_profile = function(dataset_id, profile_id, columns_selected){
      var tabledap_url = "http://erddap.marine.rutgers.edu/erddap/tabledap/",
      dataset_url = dataset_id + ".csvp?",
      //columns_default = ["time","depth", "salinity", "temperature", "conductivity", "chlorophyll_a", "oxygen_concentration", "oxygen_saturation", "volumetric_backscatter_650nm"],
      columns_default = ["time","depth", "salinity", "temperature", "conductivity"],
      columns = typeof columns_selected === "object" ? columns_selected : columns_default,
      query = "&profile_id=" + profile_id + "&" + columns.join("!=NaN&") + "!=NaN&orderBy(%22depth%22)";

//http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2100.csv?profile_id,time,latitude,longitude
      console.log("QUERY FOR CSV: ", query)
// SALINITY: http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_312-20140420T2100.htmlTable?time,latitude,longitude,profile_id,salinity&salinity!=NaN
//http://erddap.marine.rutgers.edu/erddap/tabledap/CE05MOAS-ce_319-20140420T2100.csvp?profile_id,time,depth,salinity,temperature,conductivity
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
            column = erddap_ref[config.var1],
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

}(EduVis));







/* SVG Dropdown */

var svg_select = function (options_obj, option_selected, key_value_obj, dom_element, on_change_callback, x, y, id) {

    // todo.. add sorting
    // set data-attr-text and data-attr-value for select_box g element

    // known issues
    // svg parent element hight will cut off svg.. is there overflow outside the parent svg element?
    //

    var ui_settings = {
        "select_box": {
            "height": 28,
                "width": 200
        }
    };

    var kv_key = key_value_obj.key,
        kv_val = key_value_obj.value;

    var dd_height = 28,
        dd_width = 150;

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

    var svg_select = select_selected.append("rect")
        .style("fill", "#CCCCCC")
        .style("pointer-events", "all")
        .attr("width", dd_width)
        .attr("height", dd_height)

        .on("click", function () {
        //svg_options.transition().style("height", );

          svg_options.style("display", "block");

          console.log(dd_height, options_count);

      });


    var select_text = select_selected.append("text")
        .attr("id", "select_text")
        .attr("class", "dd_option_selected")
        .attr("pointer-events", "none")
        .attr("text-anchor", "left")
        .style("font-size", "12px")
        .attr("y", 10)
        .attr("x", 10)
        .attr("dy", ".75em")
        .attr("data-attr-val", selected_var)
        .text(selected_var);

    var svg_options = svg.append("g")
        .attr("id", id)
        .attr("display", "none")
        .on("mouseover",function(){
            console.log("mouse over");
        })
        .on("mouseout",function(){
            console.log("mouse out");
        })

    for (var x = 1; x <= options_count; x++) {

        var select_key = options_obj[x - 1][kv_key],
            select_val = options_obj[x - 1][kv_val];

        // pop up or pop down
        var select_option = svg_options.append("g")
            .attr("data-attr-key", select_key)
            .attr("data-attr-val", select_val)
            .attr("class", "gdd_option")
            .attr("transform", "translate(" + 0 + ",-" + x * dd_height + ")");

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
            .text(options_obj[x - 1][kv_val]);
    }
};

var click_callback = function (a, b, c) {
    console.log(a, b, c)
};
