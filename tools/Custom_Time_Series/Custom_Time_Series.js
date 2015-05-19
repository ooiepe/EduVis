/**
 * Custom Time Series (CTS)
 * Revised 4/2/2015
 * Written by Sage Lichtenwalner
*/
(function (eduVis) {
  "use strict";
  var tool = {
    "name" : "Custom_Time_Series",
    "version" : "0.1",
    "description" : "This tool allows you to create an interactive time series graph of your own CSV data.",
    "resources" : {
      "tool":{
        "scripts" : [
          {
            "name" : "d3",
            "url" : "http://d3js.org/d3.v3.js",
            "global_reference" : "d3",
            "attributes" : {"charset" : "utf-8"}
          }
        ],
        "stylesheets" : []
      },
      "controls":{
        "scripts" : [
          {
            "name" : "mustache",
            "url" : "mustache.js",
          },
          {
             "name" : "bootstrap-colorpicker/js/bootstrap-colorpicker.js",
             "url" : "bootstrap-colorpicker/js/bootstrap-colorpicker.js"
          }
        ],
        "stylesheets" : [
          {
             "name" : "bootstrap-colorpicker/css/bootstrap-colorpicker.css",
             "src" : "bootstrap-colorpicker/css/bootstrap-colorpicker.css"
          }
        ]
      }
    },
    // Default tool configuration
    "configuration" : {
      "title" : "Example Data",
      "url" : "",
      "dataset" : "date\tair temperature\twater temperature\n2013-01-01T00:00:00Z\t27.4\t16.4\n2013-01-10T00:06:00Z\t27.3\t16.6\n2013-01-20T00:12:00Z\t27.2\t16.8\n2013-02-01T00:18:00Z\t27.2\t16.9\n2013-02-10T00:24:00Z\t27.1\t17.0\n2013-02-20T00:30:00Z\t27.1\t17.1\n2013-03-01T00:36:00Z\t27.0\t17.1\n2013-03-10T00:42:00Z\t26.9\t17.2\n2013-03-20T00:48:00Z\t26.8\t17.2\n2013-04-01T00:54:00Z\t26.6\t17.3\n2013-04-10T01:00:00Z\t26.4\t17.4\n",
      "parameter" : "water temperature",
      "color" : "#00457c",
      "delimiter":"tab"
    },
    "initial_config" : {},
    "graph" : {},
    "data" : {}
  };

/* Old JSON dataset array
[
  {"date":"2013-01-01T00:00:00Z","air temperature":"27.4","water temperature":"16.4"},
  {"date":"2013-01-10T00:06:00Z","air temperature":"27.3","water temperature":"16.6"},
  {"date":"2013-01-20T00:12:00Z","air temperature":"27.2","water temperature":"16.8"},
  {"date":"2013-02-01T00:18:00Z","air temperature":"27.2","water temperature":"16.9"},
  {"date":"2013-02-10T00:24:00Z","air temperature":"27.1","water temperature":"17.0"},
  {"date":"2013-02-20T00:30:00Z","air temperature":"27.1","water temperature":"17.1"},
  {"date":"2013-03-01T00:36:00Z","air temperature":"27.0","water temperature":"17.1"},
  {"date":"2013-03-10T00:42:00Z","air temperature":"26.9","water temperature":"17.2"},
  {"date":"2013-03-20T00:48:00Z","air temperature":"26.8","water temperature":"17.2"},
  {"date":"2013-04-01T00:54:00Z","air temperature":"26.6","water temperature":"17.3"},
  {"date":"2013-04-10T01:00:00Z","air temperature":"26.4","water temperature":"17.4"}
]
*/


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
   * Initial setup of visualization tool
   * Called by init_tool
   */
  tool.setup = function( _target ){
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

    tool.create_dropdown(_target);
  };


  /**
   * Draw first dataset following initial tool setup
   * Called by init_tool and graph_update_parameter
   */
  tool.draw = function() {
    var url = tool.configuration.url,
    tab = tool.configuration.delimiter,
    dataset = tool.configuration.dataset;

    if (url) {
      d3.csv(url).get(function(error, rows) { 
        if (rows !== undefined) {
          tool.data = rows; 
          tool.update_dropdown();
          tool.updategraph();
        } else {
          $("#config-url-error")
            .show()
            .html('The specified CSV file was not found.  Please check the URL and try again.');          
        }
      });      
    } else if (tab === "tab") {
      tool.data = d3.tsv.parse(dataset);
      tool.update_dropdown();
      tool.updategraph();
    } else if (tab === "comma") {
      tool.data = d3.csv.parse(dataset);
      tool.update_dropdown();
      tool.updategraph();
    }
  };

  /**
   * Update visualization with new data
   * Called by draw
   */
  tool.updategraph = function() {
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
      var cols = d3.entries(dataset[0]);
      dataset.forEach(function(d,k) {
        data[k] = { "date" : g.parseDate(d[cols[0].key]), "data" : +d[tool.configuration.parameter] };
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
  tool.create_dropdown = function(_target){

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

  };

  /**
   * Update pulldown to match config
   * Called by setup
   */
  tool.update_dropdown = function(){

    var config = tool.configuration,
        options = [],
        cols = d3.entries(tool.data[0]);

    // Clear the current list
    $("#"+tool.dom_target+"_select-parameters").empty();

    // Build a new list of parameters
    $.each(cols, function(k,d){
      var option = $("<option/>")
        .attr({
          "value": d.key
        })
        .html(
          d.key
        );
      if(k>0) {
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
      tool.updategraph();
  };


  /**
   * Calculates general statistics on data
   * Called by updategraph
   * This should be replaced by d3.deviation and other related functions when (if?) implemented.
   */
  tool.average = function(data) {
    var a = [];
    data.forEach(function(d) {
      if(!isNaN(d.data)) {a.push(d.data);};
    });
    var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
    for(var m, s = 0, l = t; l--; s += a[l]);
    for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
    return r.deviation = Math.sqrt(r.variance = s / (t-1)), r;
  };


  /**
   * Initial setup of tool configuration panel
   * Called automatically by EduVis when edit is enabled
   */
  tool.init_controls = function(){     
    $.get(EduVis.Environment.getPathTools() + tool.name + '/Custom_Time_Series_config.mst', function(template) {
      var rendered = Mustache.render(template);
      $('#vistool-controls').html(rendered);
  
      // Save the config for reversion
      $.extend(true,tool.initial_config,tool.configuration);
    
      tool.populate_fields();
      tool.setup_buttons();
    });
  };


/**
 * populate_fields
 * Called by init_controls
 */
  tool.populate_fields = function () {
    //$("#config-deployment").children().remove();
    $("#config-url").val(tool.configuration.url)
      .on("change keyup",function () { tool.apply_button_status('modified'); });
    if(!tool.configuration.url) {
      $('#dataOptionOne').collapse('hide');
      $('#dataOptionTwo').collapse('show');
    } 
    $("#clear-url")
      .on("click", function() { $("#config-url").val(''); tool.apply_button_status('modified'); });
    //$("#config-dataset").val(this.json2csv(tool.configuration.dataset))
    $("#config-dataset").val(tool.configuration.dataset)
      .on("change keyup",function () { tool.apply_button_status('modified'); });
    $("#config-delimiter").val(tool.configuration.delimiter)
      .on("change",function () { tool.apply_button_status('modified'); });
    $("#config-title").val(tool.configuration.title)
      .on("change keyup",function () { tool.apply_button_status('modified'); });
    $("#config-color").val(tool.configuration.color)
      .colorpicker()
      .on('changeColor.colorpicker', function () { tool.apply_button_status('modified'); });
  };

/**
 * json2csv
 * Called by populate_fields
 *
 * CSV to JSON Converters
 * http://jsfiddle.net/sturtevant/AZFvQ/
 * http://www.jqueryscript.net/other/Creating-A-CSV-To-JSON-Data-Converter-with-jQuery-Parse-Plugin.html
 * https://github.com/adamschoenemann/CSV-to-JSON-convert/blob/master/csv_to_json.js
 */
  tool.json2csv = function (objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';
    var head = array[0];
    var delim = (tool.configuration.delimiter==="tab") ? "\t" : ", ";
    for (var index in array[0]) {
      line += index + delim;
    }
    line = line.slice(0, -delim.length);      
    str += line + '\r\n';
    for (var i = 0; i < array.length; i++) {
      line = '';
      for (index in array[i]) {
        line += array[i][index] + delim;
      }
      line = line.slice(0, -delim.length);
      str += line + '\r\n';
    }
    return str;
  };


  /**
   * setup_buttons
   * Called by init_controls
   */
  tool.setup_buttons = function () {
    // Add action to apply button
    $("#apply-btn")
      .on('click', tool.apply_button_press);
    
    // Add hidden checkmark  
    $("#ui-config-apply")
      .append(
        $('<img src="'+ EduVis.Environment.getPathTools() + tool.name + '/check_green.png"' + ' id="apply-check" style="display:none" />')
      );
  
    // Add action to revert button
    $("#revert-btn")
      .on('click', tool.revert_button_press);
  };


  /**
   * apply_button_press
   * Called by Apply button
   */
  tool.apply_button_press = function (evt) {
    var btn_apply = $(evt.target);
    
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
      var url = $("#config-url").val(),
      status = false;

      if (url) {
        status = tool.validate_url(url);
      } else {
        status = tool.validate_dataset();      
      }

      if  (status) {
        // Update the configuration values
        var config = tool.configuration;
        config.title = $("#config-title").val();
        config.url = $("#config-url").val();
        config.dataset = $("#config-dataset").val();
        config.delimiter = $("#config-delimiter").val();
        config.color = $("#config-color").val();

        // Update the tool frontend
        tool.draw();
        
        // Disable the apply button
        tool.apply_button_status("updated"); 
      }
    }
  };

  /**
   * validate_url
   * Validate url field
   */
  tool.validate_url = function(url){
    //http://stackoverflow.com/questions/2723140/validating-url-with-jquery-without-the-validate-plugin
    if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(url)){
    // Use the following line to support localhost
    //if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.?[a-z]{2,5}?(:[0-9]{1,5})?(\/.*)?$/i.test(url)){ 
      $("#config-url-error")
        .hide();
      return true;
    } else {
      $("#config-url-error")
        .show()
        .html('This is an invalid URL.  Please try again.');
    }
    // Default return false
    return false;
  };


  /**
   * validate_dataset
   * Validate dataset field
   */
  tool.validate_dataset = function(){
    var data=[];
    var tab = $("#config-delimiter").val();
    if (tab === "tab") {
      data = d3.tsv.parse($("#config-dataset").val());
    } else if (tab === "comma") {
      data = d3.csv.parse($("#config-dataset").val());
    }
    var data_field = $('#config-dataset').val().trim();
    data_field = data_field.split(/\r|\r\n|\n/);
    
    if (data.length<2) {
      $("#config-dataset-error")
        .show()
        .html('There is a problem with this dataset.  Please include a header row and at least 2 rows of data.');
    } else if (data.length>250) {
      $("#config-dataset-error")
        .show()
        .html('Your data array must contain less than 250 rows.');
    } else if ((data.length>1) && (data.length==data_field.length-1)) {
      $("#config-dataset-error")
        .hide();
      return true;
    } else {
      $("#config-dataset-error")
        .show()
        .html('There was an problem processing your data. Please make sure to include a header row and at least 2 rows of data.  If you have a larger dataset, please use the CSV file option.');
    }
    // Default return false
    return false;
  };


  /**
   * apply_button_status
   * Update the Apply button by enabling or disabling the class
   */
  tool.apply_button_status = function(status){
    if(status == "modified"){
      $("#apply-btn")
        .attr('class', 'btn btn-medium');
      $("#revert-btn")
        .attr('class', 'btn btn-medium');
    } else if (status == "updated") {
      $("#apply-btn")
        .attr('class', 'btn btn-medium disabled');
      $("#apply-check").show().fadeOut(3000);
    }
  };
  
  
  /**
   * revert_button_press
   * Called by Revert button
   */
  tool.revert_button_press = function (evt) {
    var btn_apply = $(evt.target);
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
      // Merge in default configuration from parent tool (or instance)
      $.extend(true, tool.configuration, tool.initial_config);
      // Update the configuration fields
      tool.populate_fields();
      // Enable the apply button to save changes
      tool.apply_button_status("modified");
    }
  };


  // Extend the base EduVis object with this tool
  EduVis.tool.tools[tool.name] = tool;

}(EduVis));
