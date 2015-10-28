/**
 * Custom Time Series (CTS)
 * Revised 4/2/2015
 * Written by Sage Lichtenwalner
*/
(function (eduVis) {
  "use strict";
  var tool = {
    "name" : "Single_Time_Series_OOI",
    "version" : "0.1",
    "description" : "Create a single time series of OOI datasets.",
    "resources" : {
      "tool":{
        "scripts" : [
          {
            "name" : "d3",
            "url" : "http://d3js.org/d3.v3.js",
            "global_reference" : "d3",
            "attributes" : {"charset" : "utf-8"}
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
      "controls":{
        "scripts" : [
          {
            "resource_type" : "tool",
            "name" : "OOI_Timeseries_Chooser",
            "url" : "OOI_Timeseries_Chooser.js",
          },
          {
            "name" : "mustache",
            "url" : "mustache.js",
          },
          {
             "name" : "bootstrap-colorpicker-js",
             "url" : "bootstrap-colorpicker/js/bootstrap-colorpicker.js"
          }
        ],
        "stylesheets" : [
          {
             "name" : "OOI_Timeseries_Chooser.css",
             "src" : "OOI_Timeseries_Chooser.css"
          },
          {
             "name" : "bootstrap-colorpicker-css",
             "src" : "bootstrap-colorpicker/css/bootstrap-colorpicker.css"
          }
        ]
      }
    },
    // Default tool configuration
    "configuration" : {
      'reference_designator': 'GP03FLMA-RIM01-02-CTDMOG047',
      'method': 'telemetered',
      'stream': 'ctdmo_ghqr_sio_mule_instrument',
      'date_start':'2014-10-06',
      'date_end':'2015-01-04',
      'title': 'Station Papa CTD 47',
      "color" : "#00457c",
      "parameter": "ctdmo_seawater_conductivity"
    },
    "initial_config" : {},
    "graph" : {},
    "data" : {},
  };
  

  /**
   * Initialize tool
   * Called automatically by EduVis
   */
  tool.init_tool = function(_target) {
    this.setup(this.dom_target);
    this.update_dataset();
    EduVis.tool.load_complete(this);
  };

  /**
   * Initial setup of visualization tool
   * Called by init_tool
   */
  tool.setup = function( _target ){
    tool.setup_graph(_target);
    tool.setup_ui(_target);
  };

  /**
   * Setup the tool graph
   * Called by setup
   */
  tool.setup_graph = function( _target ){
    var g = this.graph;

    g.margin = {top: 26, right: 25, bottom: 40, left: 60};
    g.width = 840 - g.margin.left - g.margin.right;
    g.height = 400 - g.margin.top - g.margin.bottom;

    g.parseDate = d3.time.format.iso.parse;
    g.date_format = d3.time.format.utc("%Y-%m-%d");

    g.x = d3.time.scale.utc().range([0, g.width]);
    g.y = d3.scale.linear().range([g.height, 0]);

    g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
    g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);

    g.svg = d3.select("#"+_target).append("svg")
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

    g.focus = g.svg.append("g")
        .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");

    g.focus.append("g")
      .attr("id", _target+"_xAxis")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + g.height + ")")
      .call(g.xAxis);

    g.focus.append("g")
      .attr("id", _target+"_yAxis")
      .attr("class", "y axis")
      .call(g.yAxis);

    g.focus.append("path")
      //.datum(data)
      .attr("class", "line")
      .attr("d", g.line1)
      .style("fill","none")
      .style("stroke",tool.configuration.color)
      .style("stroke-width","2px");

    //mouse move
    g.mouse_focus = g.focus.append("g")
      .attr("class", "focus")
      .style("display", "none");

    g.mouse_focus.append("circle")
      .attr("r", 4.5);

    g.mouse_focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    g.mousemover = g.focus.append("rect")
      .attr("class", "overlay")
      .attr("width", g.width)
      .attr("height", g.height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { g.mouse_focus.style("display", null); })
      .on("mouseout", function() { g.mouse_focus.style("display", "none"); });

    g.line1 = d3.svg.line()
      //.interpolate("linear")
      .x(function(d) { return g.x(d.date); })
      .y(function(d) { return g.y(d.data); })
      .defined(function(d) { return !isNaN(d.data); });

    g.title = g.svg.append("text")
      .attr("class", "gtitle")
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .attr("y", 0)
      .attr("dy", ".75em")
      .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
      .text( tool.configuration.title );

    g.ylabel = g.svg.append("text")
      .attr("id", _target+"_ylabel")
      .attr("class", "glabel")
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      //.style("fill", "#999")
      .attr("y", 0)
      .attr("dy", "1em")
      .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
      .text( tool.configuration.parameter);

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
  };


  /**
   * Draw first dataset following initial tool setup
   * Called by init_tool and graph_update_parameter
   */
  tool.update_dataset = function() {
    var url = tool.uframe_data_url()
    // "http://ooiufs1.ooi.rutgers.edu:12576/sensor/inv/GP03FLMA/RIM01/02-CTDMOG047/telemetered/ctdmo_ghqr_sio_mule_instrument?beginDT=2014-10-06T23:58:44.162Z&endDT=2015-01-04T18:35:36.420Z&execDPA=true&limit=1000";
    
    d3.json(url).get(function(error, rows) { 
      if (rows !== undefined) {
        tool.data = rows; 
        tool.update_graph();
      } else {
        $("#config-url-error")
          .show()
          .html('The specified CSV file was not found.  Please check the URL and try again.');          
      }
    });      
  };

  /**
   * Update visualization with new data
   * Called by update_dataset and graph_update_parameter
   */
  tool.update_graph = function() {
    var g = this.graph;
    var dataset = tool.data;
    var data = [];
    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    
    if(dataset.length === 0){
      $("#config-url-error")
        .show()
        .html('This is an invalid datafile.  Please try again.');
    } else {

      // Parse data
      dataset.forEach(function(d,k) {
        data[k] = { 
          "date" : new Date( +d.internal_timestamp*1000 + new Date("1/1/1900").getTime() ), 
          "data" : +d[tool.configuration.parameter] 
        };
      });

      // Update x and y domains
      g.x.domain(d3.extent(data, (function(d) { return d.date; })));
      g.y.domain(d3.extent(data, (function(d) { return d.data; }))).nice();

      // Update the graph
      g.svg.selectAll("path.line")
        .data([data])
        //.transition()
        //.duration(500)
        //.ease("linear")
        .attr("d", g.line1)
        .style("stroke",tool.configuration.color);

      g.title.text( this.configuration.title );
      g.ylabel.text( this.configuration.parameter );
      var datelimits = g.x.domain();
      g.xlabel.text(d3.time.format.utc("%B %e, %Y")(datelimits[0]) + " to " + d3.time.format.utc("%B %e, %Y")(datelimits[1]));
      var stats = tool.average(data);
      g.stats.text("Mean: " + d3.round(stats.mean,2) + " / StDev: " + d3.round(stats.deviation,2) );

      // Update x and y axis
      d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
      d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);

      d3.selectAll('.axis line, .axis path')
        //.style("shape-rendering","crispEdges")
        .style("fill","none")
        .style("stroke","#999")
        .style("stroke-width","1px");
      d3.selectAll('.y.axis line')
        .style("stroke-opacity",".4");

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
        g.mouse_focus.select("text").text(g.date_format(d.date) + " - " + d3.round(d.data,4))
          .attr("transform", "translate(" + xPosition + "," + 0 + ")");

      });
    }
  };

  /**
   * Generate parameter pulldown
   * Called by setup
   */
  tool.setup_ui = function(_target){

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
          .append("Select a Parameter: ")
          .append(
            $("<select></select>")
            .attr({
              "id" : _target + "_select-parameters"
            })
            .on("change", function(evt){
              tool.graph_update_parameter(evt.target.value);
            })
          )
      )
      .appendTo(
        $("#"+_target)
      );
    
    tool.update_parameter_list();

  };

  /**
   * update_parameter_list
   * Called by setup_ui
   */
  tool.update_parameter_list = function(){
    
    var url = tool.uframe_parameter_url();
    
    d3.json(url).get(function(error, response) {
      if (response !== undefined) {
        tool.update_parameter_pulldown(response.parameters);
      } else {
        $("#config-url-error")
          .show()
          .html('The parameter list failed to load.');          
      }
    });      
  };

  /**
   * update_parameter_pulldown
   * Called by get_parameter_list
   */
  tool.update_parameter_pulldown = function(parameters){
    var config = tool.configuration,
    options=[];
    
    // Clear the current list
    $("#"+tool.dom_target+"_select-parameters").empty();

    // Build a new list of parameters
    $.each(parameters, function(i,dset){
      var option = $("<option/>")
        .attr({ "value": dset.particleKey })
        .html(dset.particleKey);
      if (dset.stream == config.stream) {
        options.push(option);  
      }
    });

    // Add all the options from the options array to the select
    $("#"+tool.dom_target+"_select-parameters")
      .append(options);

    // Select choosen parameter, if value isn't in list, choose first one
    if($("#"+tool.dom_target+"_select-parameters option[value='" + config.parameter + "']").val() === undefined){
      $("#"+tool.dom_target+"_select-parameters option:first")
      .prop("selected", "selected");
      config.parameter = $("#"+tool.dom_target+"_select-parameters").val();
    } else {
      $("#"+tool.dom_target+"_select-parameters")
      .val(config.parameter);
    }

  };


  /**
   * Update graph and config when parameter pulldown is changed
   */
  tool.graph_update_parameter = function(parameter){
      tool.configuration.parameter = parameter;
      tool.update_graph();
  };


  /**
   * Calculates general statistics on data
   * Called by updategraph
   * This should be replaced by d3.deviation and other related functions when (if?) implemented.
   */
  tool.average = function(data) {
    var a = [];
    data.forEach(function(d) {
      if(!isNaN(d.data)) {a.push(d.data);}
    });
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / (t-1)), r;
  };

  tool.uframe_url = "http://ooiufs1.ooi.rutgers.edu:12576/sensor/inv";

  /**
   * Generate uFrame Parameter URL
   * Called by ???
   */
  tool.uframe_parameter_url = function() {
    var refdef = tool.configuration.reference_designator,
    site = refdef.substring(0,8),
    subsite = refdef.substring(9,14),
    instrument = refdef.substring(15);
    
    var url = tool.uframe_url + '/' + site + '/' + subsite + '/' + instrument + '/metadata';
    return url; 
  };

  /**
   * Generate uFrame Data URL
   * Called by ???
   */
  tool.uframe_data_url = function() {
    var refdef = tool.configuration.reference_designator,
    site = refdef.substring(0,8),
    subsite = refdef.substring(9,14),
    instrument = refdef.substring(15),
    method = tool.configuration.method,
    stream = tool.configuration.stream,
    start_date = d3.time.format.iso.parse(tool.configuration.date_start),
    end_date = d3.time.format.iso.parse(tool.configuration.date_end),
    datef = d3.time.format.iso;

    var url = tool.uframe_url + '/' + site + '/' + subsite + '/' + instrument + '/' + method + '/' + stream + '?beginDT=' + datef(start_date) + '&endDT=' + datef(end_date) + '&execDPA=true&limit=1000';
    return url; 
  };



  /**
   * Initial setup of tool configuration panel
   * Called automatically by EduVis when edit is enabled
   */
  tool.init_controls = function(){
    tool.controls = {};
    tool.controls.OOI_Timeseries_Chooser = EduVis.controls.OOI_Timeseries_Chooser;
    tool.controls.OOI_Timeseries_Chooser.init(tool);
  };
  
  /**
   * Configuration callback
   * Called by Apply button on configuration screen
   */
  tool.config_callback = function(){
    tool.update_parameter_list();
    tool.update_dataset();
  };
  
  
  // Extend the base EduVis object with this tool
  EduVis.tool.tools[tool.name] = tool;

}(EduVis));
