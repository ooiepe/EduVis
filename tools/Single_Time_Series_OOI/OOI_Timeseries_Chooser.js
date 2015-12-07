/**
 * OOI Timeseries Choose
 *   for use with the Simple Time Series OOI Version
 * Written by Sage Lichtenwalner
 * Revised 10/29/15
 */
(function (eduVis) {
  "use strict";
  var parent_tool,
  control = {
    "name":"OOI_Timeseries_Chooser",
    "version" : "0.2",
    "description" : "This tool allows users to browse and select OOI timeseries datasets from the OOI uframe server.",
    "config_controls" : {
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
    "datasets":{},
  };


  /**
   * Initialize tool
   * Called automatically by EduVis
   */
  control.init = function (_parent_tool) {
    control.parent_tool = _parent_tool;
     
    $.get(EduVis.Environment.getPathTools() + control.parent_tool.name + '/OOI_Timeseries_Chooser.mst', function(template) {
      var rendered = Mustache.render(template);
      $('#vistool-controls').html(rendered);
  
      // Merge in default configuration from parent tool (or instance)
      $.extend(true,control.config_controls,control.parent_tool.configuration);
      $.extend(true,control.initial_config,control.parent_tool.configuration);

      control.iso_parse = d3.time.format.iso.parse;
      control.date_format_ymd = d3.time.format.utc("%Y-%m-%d");
      control.date_range_format = d3.time.format.utc("%Y-%m-%d-%H-%M-%S");

      control.setup_apply();
      control.setup_datepickers();
      control.load_catalog();
    });
  };


  /**
   * setup_apply
   * Called by init
   */
  control.setup_apply = function () {
    // Add action to apply button
    $("#apply-btn")
      .on('click', control.apply_button_press);
    
    // Add hidden checkmark  
    $("#ui-config-apply")
      .append(
        $('<img src="'+ EduVis.Environment.getPathTools() + control.parent_tool.name + '/check_green.png"' + ' id="apply-check" style="display:none" />')
      );

    // Add action to revert button
    $("#revert-btn")
      .on('click', control.revert_button_press);
  };
  
  
  /**
   * setup_datepickers
   * Called by init
   */
  control.setup_datepickers = function () {
    $("#config-date_start")
      .addClass('datepicker')
      .datepicker({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        "defaultDate": control.config_controls.date_start,
        "onClose" : function (d,i) {
          var sdate = $("#config-date_start").datepicker('getDate'),
          edate = $("#config-date_end").datepicker('getDate');
          if ( sdate >= edate ){
            sdate.setDate(sdate.getDate()+1);
            $("#config-date_end").datepicker('setDate',sdate);
          }
          //control.update_slider();
          control.apply_button_status('modified');
        }
      })
      .val(control.config_controls.date_start);
    $("#config-date_end")
      .addClass('datepicker')
      .datepicker({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        "defaultDate": control.config_controls.date_end,
        "onClose" : function (d,i) {
          var sdate = $("#config-date_start").datepicker('getDate'),
          edate = $("#config-date_end").datepicker('getDate');
          if ( sdate >= edate ){
            edate.setDate(edate.getDate()-1);
            $("#config-date_start").datepicker('setDate',edate);
          }
          //control.update_slider();
          control.apply_button_status('modified');
        }
      })
      .val(control.config_controls.date_end);
  };


  /**
   * load_catalog
   * Called by init
   */
  control.load_catalog = function () {
    var url = EduVis.Environment.getPathTools() + control.parent_tool.name + '/epe_catalog.json';
    $.getJSON(url, function (response) {
      control.datasets = response;  
      control.populate_arrays();
    });
  };


  /**
   * populate_arrays
   * Called by load_datasets
   */
  control.populate_arrays = function () {
    var refdef = control.config_controls.reference_designator;
    control.config_controls.array = refdef.substring(0,2);
    control.config_controls.site = refdef.substring(0,8);
    control.config_controls.subsite = refdef.substring(9,14);
    control.config_controls.instrument = refdef.substring(15);    
    
    $("#config-array").children().remove();
    var datasets = control.datasets;
    $.each(datasets, function (i,dset) {
      $("#config-array")
        .append(
          $("<option>")
            .attr("value",i)
            .html(dset.name)
          );
    });
    // Set the default seleted options for each dropdown
    $("#config-array")
      .val(control.config_controls.array)
      .on('change', control.select_array);
    control.select_array();
    
    $("#config-site")
      .val(control.config_controls.site)
      .on('change', control.select_site);
    control.select_site();
    
    $("#config-subsite")
      .val(control.config_controls.subsite)
      .on('change', control.select_subsite);
    control.select_subsite();
    
    $("#config-instrument")
      .val(control.config_controls.instrument)
      .on('change', control.select_instrument);
    control.select_instrument();

    $("#config-stream")
      .val(control.config_controls.stream)
      .on('change', control.select_stream);

    $("#config-title").val(control.config_controls.title)
      .on("change keyup",function () { control.apply_button_status('modified'); });
      
    $("#config-color").val(control.config_controls.color)
      .on("change keyup",function () { control.apply_button_status('modified'); });
      //.colorpicker()
      //.on('changeColor.colorpicker', function () { control.apply_button_status('modified'); });
   };


  /**
   * update_array
   * Called by populate_arrays and when config-array is changed
   */
  control.select_array = function () {
    var selected_array = $("#config-array").val();
    var datasets = control.datasets;
    var sites = datasets[selected_array].children;
    
    $("#config-site").children().remove();
    $("#config-site").append($("<option>").attr("value",'').html('(choose one)'));   
    $.each(sites, function (i,dset) {
      $("#config-site")
        .append(
          $("<option>")
            .attr("value",dset.id)
            .html(dset.name)
          );
    });
    //$("#config-instrument").children().remove();
    //$("#config-instrument").append($("<option>").attr("value",'').html('Choose a Glider'));   
    //control.update_instruments(); // This causes a logic error, call from populate_arrays directly
  };


  /**
   * select_site
   * Called by populate_arrays and when config-site is changed
   */
  control.select_site = function () {
    var selected_array = $("#config-array").val();
    var selected_site = $("#config-site").val();
    var datasets = control.datasets;
    var subsites = datasets[selected_array].children[selected_site].children;

    $("#config-subsite").children().remove();
    $("#config-subsite").append($("<option>").attr("value",'').html('(choose one)'));
    $.each(subsites, function (i,dset) {
      $("#config-subsite")
        .append(
          $("<option>")
            .attr("value",dset.id)
            .html(dset.name)
          );
    });
  };


  /**
   * select_subsite
   * Called by populate_arrays and when config-subsite is changed
   */
  control.select_subsite = function () {
    var selected_array = $("#config-array").val();
    var selected_site = $("#config-site").val();
    var selected_subsite = $("#config-subsite").val();
    var datasets = control.datasets;
    var instruments = datasets[selected_array].children[selected_site].children[selected_subsite].children;

    $("#config-instrument").children().remove();
    $("#config-instrument").append($("<option>").attr("value",'').html('(choose one)'));
    $.each(instruments, function (i,dset) {
      $("#config-instrument")
        .append(
          $("<option>")
            .attr("value",dset.id)
            .html(dset.name)
          );
    });
  };


  /**
   * select_instrument
   * Called by populate_arrays and when config-site is changed
   */
  control.select_instrument = function () {
    var selected_array = $("#config-array").val();
    var selected_site = $("#config-site").val();
    var selected_subsite = $("#config-subsite").val();
    var selected_instrument = $("#config-instrument").val();
    var datasets = control.datasets;
    var streams = datasets[selected_array].children[selected_site].children[selected_subsite].children[selected_instrument].children;

    $("#config-stream").children().remove();
    $("#config-stream").append($("<option>").attr("value",'').html('(choose one)'));
    $.each(streams, function (i,dset) {
      $("#config-stream")
        .append(
          $("<option>")
            .attr("value",dset.id)
            .html(dset.stream)
          );
    });
  };

  /**
   * select_stream
   * Called when config-stream is changed
   */
  control.select_stream = function () {
    var selected_array = $("#config-array").val();
    var selected_site = $("#config-site").val();
    var selected_subsite = $("#config-subsite").val();
    var selected_instrument = $("#config-instrument").val();
    var selected_stream = $("#config-stream").val();

    var datasets = control.datasets,
    stream = datasets[selected_array].children[selected_site].children[selected_subsite].children[selected_instrument].children[selected_stream];
    
    control.config_controls.reference_designator = stream.reference_designator;
    control.config_controls.method = stream.method;
    control.config_controls.stream = stream.stream;
    
    var start_date =  control.date_format_ymd(control.iso_parse(stream.beginTime)),
    end_date = control.date_format_ymd(control.iso_parse(stream.endTime));
    $("#config-date_start")
      .datepicker('setDate',start_date)
      .val(start_date);
    $("#config-date_end")
      .datepicker('setDate',end_date)
      .val(end_date);

    $("#config-title")
      //.val(control.config_controls['reference_designator'] )
      .val( datasets[selected_array].name + ' ' + 
        datasets[selected_array].children[selected_site].name + ' ' + 
        datasets[selected_array].children[selected_site].children[selected_subsite].name + ' ' + 
        datasets[selected_array].children[selected_site].children[selected_subsite].children[selected_instrument].name )
      .on('change keyup',control.apply_button_status('modified'));
      
    control.apply_button_status("modified");
  };


  /**
   * apply_button_press
   * Called by Apply button
   */
  control.apply_button_press = function (evt) {
    var btn_apply = $(evt.target);
    
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
    
      // Update the configurations value
      control.parent_tool.configuration.reference_designator = control.config_controls.reference_designator;
      control.parent_tool.configuration.method = control.config_controls.method;
      control.parent_tool.configuration.stream = control.config_controls.stream;
      
      control.parent_tool.configuration.date_start = $("#config-date_start").val();
      control.parent_tool.configuration.date_end = $("#config-date_end").val();
      control.parent_tool.configuration.title = $("#config-title").val();
      control.parent_tool.configuration.color = $("#config-color").val();
      
      // Call the parent tool's Apply callback
      control.parent_tool.config_callback();

      // Disable the apply button
      control.apply_button_status("updated");
    }
  };


  /**
   * apply_button_status
   * Update the Apply button by enabling or disabling the class
   */
  control.apply_button_status = function(status){
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
  control.revert_button_press = function (evt) {
    var btn_apply = $(evt.target);
    
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
    
      // Merge in default configuration from parent tool (or instance)
      $.extend(true, control.config_controls, control.initial_config);
            
      // Update the dataset browser
      control.populate_arrays();
      $("#config-date_start")
        .datepicker('setDate',control.config_controls.date_start)
        .val(control.config_controls.date_start);
      $("#config-date_end")
        .datepicker('setDate',control.config_controls.date_end)
        .val(control.config_controls.date_end);

      // Enable the apply button to save changes
      control.apply_button_status("modified");
    }
  };
  
  
  // Ending code
  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }
  EduVis.controls[control.name] = control;

}(EduVis));
