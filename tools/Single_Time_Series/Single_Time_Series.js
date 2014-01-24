/* Single Time Series Tool
 * Revised 10/22/2013
 */
(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Single_Time_Series",
        "description" : "The Hello World of EV.",
        "version" : "0.1",
        "authors" : [
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~sage"
            },
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            }
        ],
        "resources" : {


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
                "name" : "jquery_ui_js", 
                "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
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
            ],
            "datasets" : []            
        },

        "configuration" : {
          "station" : "2695540",
          "network" : "CO-OPS",
          "parameter" : "air_temperature",
          "rt_days" : "2",
          "start_date" : "",
          "end_date" : "",
          "date_type" : "realtime",
          "data_cart" : 
            {"NDBC":{"44025":{"parameters":{"air_pressure":{},"air_temperature":{}}}},"CO-OPS":{"2695540":{"parameters":{"air_pressure":{},"air_temperature":{},"measured_tide":{}}}}}
        },

        "data" : {},
        // "target_div" : "Hello_World",
        "tools" : {},
        "graph" : {}
    };

    tool.controls = {
        
        "range" : {

            "type" : "dateRange",
            "label" : "Date Range",
            "tooltip": "Select the Start Date and End Date",
            "default_value" : {
                "rt_days" : "2",
                "start_date" : "",
                "end_date" : "",
                "date_type" : "realtime"
            },
            "description" : "Date Range",
            "options": {
                "maxDate": "1"
            },
            "applyClick" : function(){
              tool.configuration.rt_days = $("#config-range_rt_days").val();
              tool.configuration.start_date = $("#config-range_start_date").val();
              tool.configuration.end_date = $("#config-range_end_date").val();

              tool.graph_update();
            }
            // ,
            // "update_event":function(evt){
            //     // var target = evt.target,
            //     //     val = target.value;
            //     // tool.configuration.message = val;
            //     alert("update date range")
            // }

        },
        "data_cart" : {
            "type":"dataBrowser",
            "label" : "Data Browser",
            "parent_tool" : "Single_Time_Series",
            "data_cart" : tool.configuration.data_cart,
            "update_event" : function(a){ 

              tool.select_updateStations();
              tool.select_updateParameters();
            },
            "showApplyButton":false
        },
        
    };

    tool.setup = function( _target ){
      var g = this.graph;

      g.margin = {top: 26, right: 25, bottom: 20, left: 60};
      g.width = 840 - g.margin.left - g.margin.right;
      g.height = 400 - g.margin.top - g.margin.bottom;
      
      g.parseDate = d3.time.format.iso.parse;
      
      g.x = d3.time.scale().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);
      
      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);
      
      g.svg = d3.select("#"+_target).append("svg")
          .attr("id",_target+"_svggraph")
          .attr("width", g.width + g.margin.left + g.margin.right)
          .attr("height", g.height + g.margin.top + g.margin.bottom);
      
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
        .call(g.xAxis).style({
          "stroke": "#000",
          "stroke-width": ".5",
          "shape-rendering": "crispEdges",
          "stroke-opacity": ".4"
        });
        
      g.focus.append("g")
        .attr("id", _target+"_yAxis")
        .attr("class", "y axis")
        .call(g.yAxis).style({
          "stroke": "#000",
          "stroke-width": ".5",
          "shape-rendering": "crispEdges",
          "stroke-opacity": ".4"
        });
      
      g.focus.append("path")
              //.datum(data)
              .attr("class", "line")
              .attr("d", g.line1)
              .attr("fill","none")
              .attr("stroke","#a33333")
              .attr("stroke-width","2px");

      g.line1 = d3.svg.line()
          .interpolate("monotone")
          .x(function(d) { return g.x(d.date); })
          .y(function(d) { return g.y(d.data); });
      
      g.title = g.svg.append("text")
          .attr("class", "gtitle")
          .attr("text-anchor", "middle")
          .attr("font-size", "18")
          .attr("y", 0)
          .attr("dy", ".75em")
          .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
          .text( this.configuration.network + " Station " + this.configuration.station);
      
      g.ylabel = g.svg.append("text")
          .attr("id", _target+"_ylabel")
          .attr("class", "glabel")
          .attr("text-anchor", "middle")
          .attr("font-size", "14")
          .attr("y", 0)
          .attr("dy", "1em")
          .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
          .text( this.configuration.parameter);

      
      tool.select_createDropdowns(_target);
      tool.select_updateStations();
      tool.select_updateParameters();

    };

    tool.draw = function() {
      var url = tool.createUrl();
      
      d3.csv(url, function(error, data) {

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
    
    tool.init = function(_target) {
        this.setup(this.dom_target);
        this.draw();
        EduVis.tool.load_complete(this);
    };

    tool.graph_update_sta = function(network_station){
        var net_sta = network_station.split(","),
            network = net_sta[0],
            station = net_sta[1];

        tool.configuration.network = network;
        tool.configuration.station = station;

        // are we sure we want to updated the graph here?
        tool.graph_update();
    };

    tool.graph_update_param = function(parameter){

        //tool.configuration.station = "";

        tool.configuration.parameter = parameter;
        tool.graph_update();
    };

    function graph_update_sd(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.start_date = val;
        tool.graph_update();
    }
    function graph_update_ed(evt){
        var target = evt.target,
            val = target.value;
        tool.configuration.end_date = val;
        tool.graph_update();
    }
    
    tool.graph_update = function() {
      
      var url = tool.createUrl();        
      
      d3.csv(url, function(error, data) {
      
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

    tool.createUrl = function(){

      var config = this.configuration,
          network = config.network,
          station = config.station,
          parameter = config.parameter,
          start,
          end;

          if(config.date_type == "realtime"){
            start = config.rt_days,
            end = "now";  
          }
          else{
            start = config.start_date,
            end = config.end_date;
          }

      return 'http://epedev.oceanobservatories.org/timeseries/timeseries?' + 
          'network=' + network + 
          '&station=' + station + 
          '&parameter=' + parameter + 
          '&start_time=' + start +
          '&end_time=' + end;
    }
    
    tool.updategraph = function(data) {

      if(typeof data === "undefined"){

        // insert an icon to let user know to select param

        $("#"+_tool.dom_target+"_tool-status").html(
          $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
        )

      }
      else{

        if(data.length == 0){

            // insert an icon to let user know to select param
          $("#"+_tool.dom_target+"_tool-status").html(
            $('<i class="icon-exclamation-sign param-icon"></i><i style="color:red" class="param-icon">Data is not available for this selection.</i>')
          );

        }
        else{

          // todo: parse out date for chart domain..

          var g = this.graph,
              cols = d3.entries(data[0]);

          data.forEach(function(d) {
            d.date = g.parseDate(d.date);
            d.data = +d[cols[1].key];
          }); 

          // update the timeseries path
          g.x.domain(d3.extent(data, (function(d) { return d.date; })));
          g.y.domain(d3.extent(data, (function(d) { return d.data; })));
          
          g.svg.selectAll("path.line")
              .data([data])
              .transition()
              .duration(1000)
              .ease("linear")
              .attr("d", g.line1);
          
          //d3.select('#ylabel').text(cols[1].key);
          g.ylabel.text(cols[1].key);
          g.title.text( this.configuration.network + " Station " + this.configuration.station);

          // update x and y axis 
          d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
          d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);
          
        }
      }
      
      // remove loading image
      $(".loading-icon").remove();

    };

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
                
                // clear loading icon
                $(".loading-icon").remove();

                $('<img class="loading-icon loading-'+ evt.target.value + '" src="' + EduVis.Environment.getPathResources() + '/img/loading_small.gif" />')
                  .appendTo($("#"+_target+"_tool-status"))

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

    tool.select_updateStations = function(){

      var config = tool.configuration,
        options = [];

      // clear the current stations
      $("#"+tool.dom_target+"_select-stations").empty();

      // build the stations
      $.each(tool.configuration.data_cart, function(network, network_obj){

        $.each(network_obj,function(station, station_obj){

          // create new option and add it to the options array
          var option = $("<option/>")
            .attr({
              "value": network + "," + station
            })
            .html(
              network + " - " + station
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

        $("#"+tool.dom_target+"_select-stations").val(config.network + "," + config.station);
        // remove loading image
        
        //alert("loading-icon here..")

      }

      console.log("*****" + config.network + "," + config.station);

    };

    tool.select_updateParameters = function(){

      console.log($("#"+tool.dom_target+"_select-stations").val());

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

        $.each(dc[network][station],function(station, parameters){

          $.each(parameters,function(parameter){

            // create new option and add it to the options array
            var option = $("<option></option>")
              .attr({
                "value": parameter
              })
              .html(parameter);

            options.push(option);

          });
        });

      // clear loading indicator and append options
      $("#"+tool.dom_target+"_select-parameters")
        .empty()
        .append(options);

      selected_param = $("#"+tool.dom_target+"_select-parameters option")
          .filter(function(){
            console.log("config param", config.parameter);
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

    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

