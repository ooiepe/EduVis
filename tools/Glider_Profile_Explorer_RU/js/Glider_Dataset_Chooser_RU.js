/**
 * Glider Dataset Chooser - Rutgers Version
 *   for use with the Glider Profile Explorer (GPE) - Rutgers Version
 * Revised 2/10/2015
 * Written by Michael Mills and Sage Lichtenwalner
*/
(function (eduVis) {
  "use strict";
  var parent_tool,
  control = {
    "name":"Glider_Dataset_Chooser_RU",
    "version" : "0.1",
    "description" : "This tool allows users to browse and select Glider Datasets from the Rutgers Erddap server.",
    "config_controls" : {
      'institution':'Rutgers University', 
      'glider':'ru01', 
      'dataset_id':'ru01-20140104T1621',
      'date_start':'2014-01-04',
      'date_end':'2014-01-16',
      'title':'RU01 January 2014'
    },
    "datasets":{}
  };


  /**
   * Initialize tool
   * Called automatically by EduVis
   */
  control.init = function (_parent_tool) {
    control.parent_tool = _parent_tool;
     
    $.get(EduVis.Environment.getPathTools() + control.parent_tool.name + "/templates/" + 'Glider_Dataset_Chooser_RU.mst', function(template) {
      var rendered = Mustache.render(template);
      $('#vistool-controls').html(rendered);
  
      // Merge in default configuration from parent tool (or instance)
      $.extend(true,control.config_controls,control.parent_tool.configuration);
  
      control.setup_datepickers();
      control.load_datasets();
    });
  }

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
        "defaultDate": control.config_controls.date_start
      })
      .val(control.config_controls.date_start)
    $("#config-date_end")
      .addClass('datepicker')
      .datepicker({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        "defaultDate": control.config_controls.date_end
      })
      .val(control.config_controls.date_end)

    $("#config-apply")
      .on('click', control.apply_button);

  }


  /**
   * load_datasets
   * Called by init
   */
  control.load_datasets = function () {
    // list of erddap variables that we are interested in
    var erddap_variables = ["datasetID","institution","minLongitude","maxLongitude","minLatitude","maxLatitude","minTime","maxTime"];
    
    var url = 'http://erddap.marine.rutgers.edu/erddap/tabledap/allDatasets.json?' + 
              erddap_variables.join(',') + 
              '&cdm_data_type="TrajectoryProfile"'; //+'&institution="OOI"';

    $.getJSON(url, function (json) {

      var ds = json, datasets = [],
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

      // build the datasets object
      $.each(ds.table.rows, function (i, row) {
        var dset = {};
        $.each(erddap_variables, function (x, v) {
          dset[v] = getRowValue(i, v);
        });
        datasets.push(dset);
      });

      var datasets = d3.nest()
        .key(function(d) { return d.institution; })
        .sortKeys(d3.ascending)
        .key(function(d) { return d.datasetID.substring(0,d.datasetID.lastIndexOf('-')); })
        .sortKeys(d3.ascending)
        .entries(datasets);
      // save datasets object for later reference
      control.datasets = datasets;
      
      control.populate_arrays();
    });
  }

  /**
   * populate_arrays
   * Called by load_datasets
   */
  control.populate_arrays = function () {
    $("#config-institution").children().remove();
    var datasets = control.datasets;
    $.each(datasets, function (i,dset) {
      $("#config-institution")
        .append(
          $("<option>")
            .attr("value",dset.key)
            .html(dset.key)
          );
    });
    // Set the default seleted options for each dropdown
    $("#config-institution")
      .val(control.config_controls.institution)
      .on('change', control.update_gliders);

    control.update_gliders();
    $("#config-glider")
      .val(control.config_controls.glider)
      .on('change', control.update_deployments);

    control.update_deployments();
    $("#config-deployment")
      .val(control.config_controls.dataset_id);

    control.update_mapetc();
    $("#config-mapbutton")
      .on('click', control.update_mapetc);
  }

  /**
   * update_deployments
   * Called by populate_arrays and when config-institution is changed
   */
  control.update_gliders = function () {
    $("#config-glider").children().remove();
    $("#config-glider").append($("<option>").attr("value",'').html('(choose one)'));   
    var datasets = control.datasets;
    var gliders = datasets.find(function(d) {return d.key==$("#config-institution").val()});
    $.each(gliders.values, function (i,dset) {
      $("#config-glider")
        .append(
          $("<option>")
            .attr("value",dset.key)
            .html(dset.key)
          );
    });
    $("#config-deployment").children().remove();
    $("#config-deployment").append($("<option>").attr("value",'').html('Choose a Glider'));   
    //control.update_deployments();
  }

  /**
   * update_deployments
   * Called by populate_arrays and when config-glider is changed
   */
  control.update_deployments = function () {
    $("#config-deployment").children().remove();
    $("#config-deployment").append($("<option>").attr("value",'').html('(choose one)'));   
    var datasets = control.datasets;
    var institution = $("#config-institution").val();
    var glider = $("#config-glider").val();
    if (institution.length>0 && glider.length>0) {
      var gliders = datasets.find(function(d) {return d.key==institution});
      var deployments = gliders.values.find(function(d) {return d.key==glider});
      $.each(deployments.values, function (i,dset) {
        $("#config-deployment")
          .append(
            $("<option>")
              .attr("value",dset.datasetID)
              .html(dset.datasetID.substring(dset.datasetID.lastIndexOf('-')+1))
            );
      });
    }
  }

  /**
   * update_mapetc
   * Called by populate_arrays and when config-mapbutton is clicked
   */
  control.update_mapetc = function () {
    var iso_format = d3.time.format.iso.parse,
    date_format_ymd = d3.time.format("%Y-%m-%d");

    var datasets = control.datasets;
    var institution = $("#config-institution").val();
    var glider = $("#config-glider").val();
    var deployment_id = $("#config-deployment").val();
    if (institution.length>0 && glider.length>0 && deployment_id.length>0) {
      var gliders = datasets.find(function(d) {return d.key==institution});
      var deployments = gliders.values.find(function(d) {return d.key==glider});
      var deployment = deployments.values.find(function(d) {return d.datasetID==deployment_id});
    }
    if (typeof deployment != 'undefined') {
      $("#config-title").val('Deployment: '+deployment.datasetID)

      var date_start_ds = iso_format(deployment.minTime),
      date_end_ds = iso_format(deployment.maxTime);
      
      // set the date picker start and end range restrictions
      $("#config-date_start")
        .datepicker("option", {"minDate":date_format_ymd(date_start_ds),"maxDate":date_format_ymd(date_end_ds)})
        .val(date_format_ymd(date_start_ds));  
      $("#config-date_end")
        .datepicker("option", {"minDate":date_format_ymd(date_start_ds),"maxDate":date_format_ymd(date_end_ds)})
        .val(date_format_ymd(date_end_ds));  
    }
    
  }


  /**
   * apply_button
   * Called by Apply button
   */
  control.apply_button = function () {
    // Update the configurations value
    control.parent_tool.configuration.institution = $("#config-institution").val();
    control.parent_tool.configuration.glider = $("#config-glider").val();
    control.parent_tool.configuration.dataset_id = $("#config-deployment").val();
    control.parent_tool.configuration.date_start = $("#config-date_start").val();
    control.parent_tool.configuration.date_end = $("#config-date_end").val();
    control.parent_tool.configuration.graph_title = $("#config-title").val();
    
    // call the Tool's Apply callback
    control.parent_tool.config_callback();
  }


  // Ending code
  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }
  EduVis.controls[control.name] = control;

}(EduVis));
