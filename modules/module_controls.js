
/*  *  *  *  *  *  *  
*
* EduVis.controls
*
*/

/**
* The controls module helps create standardized html elements and UI components.
*
* @class Controls
* @constructor
*/

(function (eduVis) {

    "use strict";

    var _control_load = function () {
    },

/** Copy all properties of an object to another object
* 
* @method _control_create
* @param {Object} tool The parent tool object
* @param {String} id The id to give the control
* @return {Object} obj_control The control json containing all details for the control.
*/

    _control_create = function (tool, id, obj_control) {

        // tool type - ie. textbox, colorpicker, etc - must exist in switch

        // standarization of tool controls, including advanced tools ie. datepicker
        // todo: editor,viewer should both reference this function

        console.log("...CONTROLS...");
        console.log( tool, id, obj_control);

        var control = obj_control,
            lbl,
            input, 
            ctrl;

        switch (control.type) {

            case "textbox":

                lbl = $("<label />")
                    .attr({
                        'for': id
                    })
                    .html(control.label);

                input = $("<input />")
                    .attr({
                        'id': id,
                        'type': 'textbox',
                        'value': control.default_value,
                        'title': control.tooltip,
                        'maxlength': typeof (control.maxlength) === "undefined" ? "" : control.maxlength
                    })
                    //.addClass("span2")
                    .on("change", function (a) {
                        control.update_event(a);
                        //tool.customization_update();
                    });

                input.css(typeof control.cssInput === "object" ? control.cssInput : {})
                
                ctrl = $("<div/>")
                    .addClass("control")
                    .append(lbl)
                    .append(input);

                break;

            case "textarea":
                lbl = $("<label />")
                    .attr({'for':id})
                    .html(control.label);

                var textarea = $("<textarea></textarea>")
                    .attr({
                        'id':id,
                        'type':'textarea',
                        'title':control.tooltip,
                        'rows':5
                    })
                    .html(control.default_value)
                    .change(function(){
                        //self.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control")
                    .append(lbl)
                    .append(textarea);

                break;

            case "dropdown":

                // test control object for appropriate parts
                // control.options
                // control.tooltip
                // control.description
                // control.default_value
                // control.nolabel

                lbl = $("<label />")
                    .attr({
                        'for': id,
                        'title': control.tooltip
                    })
                    .html(control.description);

                // create select element and populate it
                var select = $("<select></select>")
                    //.addClass("span3")
                    .attr({
                        "id": id
                    }).change(function () {
                        //tool.customization_update();
                    });

                console.log("control dropdown: options:", control.options);
                // add drop down names and value pair options from contols "options" object
                $.each(control.options, function (option) {

                    var opt = control.options[option];

                    $(select)
                        .append($('<option></option>')
                        .val(opt.value)
                        .html(opt.name));
                });

                // set the default value based on the controls default value element
                // todo: override with custom config value
                select.val( control.default_value );

                ctrl = $('<div></div>');
                //.addClass("control");

                if (control.nolabel !== "true" ){
                    ctrl.append( lbl );
                }

                ctrl.append( select );

                break;

            case "checkbox":

                lbl = $("<label />").attr({
                    'for': id,
                    'title': control.tooltip
                }).html(control.description);

                input = $("<input />")
                    .attr({
                        'id': id,
                        'type': 'checkbox',
                        //'value':control.default_value,
                        'title': control.tooltip,
                        'maxlength': typeof (control.maxlength) === "undefined" ? "" : control.maxlength
                        //'onclick':function(){alert("test");}
                    });

                if ( control.selected ) {
                    $(input).attr({
                        'checked': 'checked'
                    });
                }

                ctrl = $("<div></div>")
                    .addClass("control")
                    .append(lbl)
                    .append(input);

                break;

            case "svg":

                ctrl = $("<svg></svg>");

                break;

            case "datepicker":

                lbl = $("<label />")
                    .attr({
                      //  'for': id + "_dp",
                        'title': control.tooltip,
                    })
                    //.addClass("add-on")
                    .html(control.description);

                // input or div
                if(typeof control.inline === "undefined"){

                    input = $("<input />")
                        .attr({
                            "type": "text"
                        })
                  
                }
                else{
                    input = $("<div/>");
                }

                // input 
                //     .addClass("datepicker")
                //     //.val(control.default_value)
                //     // .on("change", function () {
                //     //     //tool.customization_update();
                //     //     console.log("datepicker changed")
                //     // });

                console.log("default value", control.default_value);

                // set jquery datepicker settings
                $( input )
                    .attr({
                        "id": id 
                    })
                    .datepicker({
                        "dateFormat": "yy-mm-dd",
                        "showOn": "button",
                        "changeMonth": true,
                        "changeYear": true,
                        //"showButtonPanel": true,
                        "onSelect" : function(d,i){
                            console.log("datepicker changed!",d,i);
                            //tool.configuration.date_start = d;
                        },
                        "defaultDate": control.default_value

                    })
                    .val(control.default_value);
                   
                ctrl = $("<div/>")
                    .addClass("control ctlhandle")
                    .append(lbl)
                    .append(input)
                    .append(
                        $("<label/>")
                            .attr({
                                "for" : id
                            })
                            .addClass("add-on")
                            .css({
                                "display":"inline"
                            })
                            .html(' <i class="icon-calendar"></i>')
                            .on("click", function(){

                                //    /input.datepicker("show")
                                input.datepicker("show");
                            })
                    )

                 break;

            case "colorpicker":

                // test for dependency of colorpicker? this really should be controlled by the tool.
                // but with test, we could fall back to less desireable color picker

                // find the textbox in the control and init colorpicker
                lbl = $("<label />")
                    .attr({
                        'for': id + "_cp",
                        'title': control.tooltip
                    })
                    .html(control.description);

                input = $("<input />")
                    .attr({
                        "id": id,
                        "type": "text"
                    })
                    .addClass("readonly")
                    .val(control.default_value)
                   // .css({"float":"left !important"});

                var el_i = $("<i></i>")
                    .css({
                        "background-color": control.default_value,
                    });

                var el_span = $("<span></span>")
                    .addClass("add-on")
                    .append(el_i);

                var el_div = $("<div></div>")
                    //.addClass("input-append color")
                    .attr({
                        "id": id + "_cp",
                      //  "data-color": control.default_value,
                      //  "data-color-format": "hex"
                    })
                    .append(input)
                        .append(el_span);

                $(el_div) //.colorpicker()
                    .on("changeColor", function (cp) {
                        $("#" + id).val(cp.color.toHex());
                        //$("#" + id).val(tool.current_config[id] = cp.color.toHex())
                        //self.updateJSON();
                        //tool.customization_update();
                    });
 
                ctrl = $("<div></div>")
                    .addClass("control ctlhandle")
                    .append(lbl)
                    .append(el_div);


                break;


            case "selection": 
                
                console.log("tool control.. SELECTION");

                lbl = $("<label />")
                    .attr({
                        'for': id + "-dropdown",
                        'title': control.tooltip
                    })
                    .html( control.description );

                // add dropdown..

                var el_selectionDropdown = self.toolControl(tool, id+"-dropdown", control );

                var el_button = $("<a></a>")
                    .addClass("btn next")
                    .html("Add")
                    .on("click",function(){ alert("clicked");} );

                var el_selections = $("<ul></ul>")
                    .attr("id", id + "observations-selected");

                $.each( control.selectedItems, function(  item, itemObj ){

                        el_selections.append(
                            $("<li></li>").html( itemObj.name )
                        );
                    }
                );
                // add button next to dropdown..
                // event handler for click of button.. remove option from dropdown

                $(el_selectionDropdown).val( control.default_value );

                var template = self.uiBootstrap( id, "fluidContainer",
                    {
                        rows:[
                            {
                                cols:[12],
                                colControls:[ el_lbl ]
                            },
                            {   cols:[ 10, 2 ],
                                colControls:[ el_selectionDropdown , el_button]

                            },
                            {
                                cols:[12],
                                colControls:[ el_selections ]
                            }
                        ]

                    }
                );

                console.log(template);

                ctrl = $(template)
                    .addClass("control");
        //                .append(lbl)
        //                .append(el_selectionDropdown)
        //                .append(el_button)
        //                .append(
        //                    $("<div></div>").append( el_selections )
        //                )


                break;


            case "slider":

                //todo: slider control should be moved here from EV3/4

                break;

            case "dataBrowser":

                var dataBrowserContainer = $("<div/>")
                    .attr({
                        "id" : "data-browser-container"
                    }),

                dataBrowserButton = $("<a/>")
                    .attr({
                        "class": "btn",
                        //"value" : "btn-data-browser"
                    })
                    .html("Load Data Browser")
                    .on("click", function(){
                        
                        EduVis.tool.load({
                            "name" : "Data_Browser",
                            "target_div" : "data-browser-container",
                            "tool_container_div": "data-browser-container",
                            "parent_tool" : control.parent_tool,
                            "data_cart" : control.data_cart
                        });

                        $(this).hide();

                    }),

                ctrl = $("<div/>")
                    .append(dataBrowserButton)
                    .append(dataBrowserContainer)

                break;

            case  "dateRange":

                var radio_btn_click = function(a){

                    var start_input = $("#config-dateRange_date_start"),
                        start_lbl = $("#config-dateRange_date_start").parent().find("label:first"),
                        start_button = $("#config-dateRange_date_start").parent().find("label:last"),

                        end_input = $("#config-dateRange_date_end"),
                        end_lbl = $("#config-dateRange_date_end").parent().find("label:first"),
                        end_button = $("#config-dateRange_date_end").parent().find("label:last");
                       

                    if(this.value == "real_time"){

                        start_lbl.html("<b>Days Prior</b>");
                        //start_input.val(tool.configuration.date_start);

                        end_lbl.html("<b>Current Date</b>");
                        end_input.val("now");

                        start_button.hide();
                        end_button.hide();

                    }
                    else{

                        start_button.show();
                        end_button.show();
                        start_lbl.html("<b>Start Date</b>");
                        //start_input.val("1");
                        start_input
                            .val(tool.configuration.date_start)

                        if(tool.configuration.date_end == "now"){

                            end_input
                                .datepicker("setDate", new Date() );
                        }else{
                            
                            end_input
                                .datepicker("setDate", tool.configuration.date_end);

                        }
                    }

                };

                var dr_container = $("<div/>"),
                    dr_options = $("<div/>")
                        .addClass("row-fluid")
                        // two radios
                        .append(
                            
                            $("<div/>")
                                .addClass("span3")
                                .append(
                                    $("<input/>")
                                        .attr({
                                            "id": id + "_drOptionsRealTime",
                                            "type":"radio",
                                            "name":"dr_options",
                                            "value":"real_time"
                                        })
                                        .on("change",radio_btn_click)
                                ).append(
                                 $("<label/>")
                                        .attr({
                                            "for":id + "_drOptionsRealTime"
                                        })
                                        .css({"display":"inline"})
                                        .html("&nbsp;<b>Real Time</b>")
                                )
                        )
                        .append(
                            
                            $("<div/>")
                                .addClass("span3")
                                .append(
                                    $("<input/>")
                                        .attr({
                                            "id": id + "_drOptionsArchive",
                                            "type":"radio",
                                            "name":"dr_options",
                                            "value":"archive"
                                        })
                                        .on("change",radio_btn_click)
                                )
                                .append(
                                    $("<label/>")
                                        .attr({
                                            "for":id + "_drOptionsArchive"
                                        })
                                        .css({"display":"inline"})
                                        .html("&nbsp<b>Archived</b>")
                                )


                        ),
                    dr_inputs = $("<div/>")
                        .addClass("row-fluid"),
                    
                    dr_date_start = EduVis.controls.create(this, id + "_date_start", {

                            "type" : "datepicker",
                            "label" : "Start Date",
                            "tooltip": "The start date.",
                            "default_value" : obj_control.default_value.date_start,
                            "description" : "<b>Start Date<b>",
                            //"inline" : "inline",
                            "update_event": function(){
                                alert("start date changed: " + $(this).val());
                            }
                        })
                        .val(obj_control.default_value.date_end)
                        .addClass("span3")
                        .css({
                           
                        }),

                    dr_date_end = EduVis.controls.create(this, id + "_date_end", {

                            "type" : "datepicker",
                            "label" : "Start Date",
                            "tooltip": "The start date.",
                            "default_value" : obj_control.default_value.date_end,
                            "description" : "<b>End Date<b>",
                            // "inline" : "inline",
                            "update_event": function(){
                                alert("start date changed: " + $(this).val());
                            }
                        })
                        .val(obj_control.default_value.date_end)
                        .addClass("span3")
                        .css({
                            
                        });

                dr_inputs
                    .append(dr_date_start)
                    .append(dr_date_end);

                ctrl = dr_container
                    .append(dr_options)
                    .append(dr_inputs);


                break;


            case "olddateRange" :

                // $( "#from" ).datepicker({
                //   defaultDate: "+1w",
                //   changeMonth: true,
                //   numberOfMonths: 3,
                //   onClose: function( selectedDate ) {
                //     $( "#to" ).datepicker( "option", "minDate", selectedDate );
                //   }
                // });
                // $( "#to" ).datepicker({
                //   defaultDate: "+1w",
                //   changeMonth: true,
                //   numberOfMonths: 3,
                //   onClose: function( selectedDate ) {
                //     $( "#from" ).datepicker( "option", "maxDate", selectedDate );
                //   }
                // });

                var drContainer = $("<div/>")
                    .attr({
                        "id" : "dr-container"
                    }),

                drRange = $("<div/>")
                    .attr({
                        "id" : "dr-range"
                    })
                    .css({
                        "height":"300px"
                    })
                    .hide()
                    .append(
                        $("<h2>Selected Date Range</h2>")
                    )
                    .append(

                        EduVis.controls.create(this, "date_start", {

                            "type" : "datepicker",
                            "label" : "dateRange",
                            "tooltip": "The start date.",
                            "default_value" : obj_control.default_value.date_start,
                            "description" : "<b>Start Date<b>",
                            "inline" : "inline",
                            "update_event": function(){
                                alert("start date changed: " + $(this).val());
                            }
                        })
                        .css({
                            "width":"300px",
                            "height":"300px",
                            "float":"left"
                        })
                    )
                    .append(

                        EduVis.controls.create(this, "date_end", {

                            "type" : "datepicker",
                            "label" : "dateRange",
                            "tooltip": "The end date.",
                            "default_value" : obj_control.default_value.date_end,
                            "description" : "<b>End Date</b>",
                            "inline" : "inline",
                            "update_event": function(){
                                alert("end date changed: " + $(this).val());
                            }
                        })
                        .css({
                            "width":"300px",
                            "height":"300px",
                            "float":"left"
                        })
                    ),

                
                drRealtime = $("<div/>")
                    .attr({
                        "id" : "dr-realtime"
                    })
                    .css({
                        "height":"300px"
                    })
                    .append(
                        $("<h2>Real Time Date Range</h2>")
                    )
                    .append(
                        $("<div/>")
                            .append(
                                $("<h5># Days Prior</h5>")
                            )
                            .append(
                                $("<input />")
                                    .attr({
                                        "id":"dr-realtime-dateStart",
                                        "type":"text",
                                        "width":"250px"
                                    })
                            )
                    )
                    .append(
                        $("<div/>")
                            .append(
                                $("<h5>Current Date</h5>")
                            )
                            // .append(
                            //     $("<input />")
                            //         .attr({
                            //             "id":"dr-realtime-dateEnd",
                            //             "type":"text",
                            //             "width":"250px",
                            //             "enabled": "false",
                            //             "value" : "now"
                            //         })
                            // )
                    )

                    
                    // for now, just use textbox.. additional functionality will come later
                    // now append radio button with pre built options
                    // not considering month length or leap years
                    // 1 day 1
                    // 1 week 7
                    // 1 month 31
                    // 1 year 365

                    // end date = now

                    .hide(),

                drOptions = $("<div/>")
                    .attr({
                        "id" : "dr-selections"
                    })
                    .css({
                        "height": "40px"
                    })
                    .append(
                        $("<div/>")
                            .addClass("btn")
                            .css({
                                "width":"40%",
                                "float":"left",
                                "padding-left": "20px"
                            })
                            .html("Date Range")
                            .on("click",function(){
                                drRealtime.hide()
                                drRange.show();
                                // when changing to date range option, set date_end input to match 
                                // the tool configuration
                                $("#date_end").val(tool.configuration.date_end);

                            })
                    )
                    .append(
                        $("<div/>")
                            .addClass("btn")
                            .css({
                                "width":"40%",
                                "float":"right",
                                "padding-right": "20px"
                            })
                            .html("Real Time")
                            .on("click",function(){
                                drRange.hide();
                                drRealtime.show();
                                $("#date_end").val("now");
                            })
                    ),

                drOptionSelected = $("<div/>")
                    .attr({
                        "id" : "dr-selector"
                    });


                if(typeof control.defaultPicker === "undefined"){
                    drRange.hide();
                    drRealtime.show();
                }
                else{
                    drRange.show();
                    drRealtime.hide();
                }


                ctrl = drContainer
                    
                    .append(drOptions)

                    .append(

                        drOptionSelected
                            
                            .append(drRange)

                            .append(drRealtime)
                    )

                break;


            default:
                // empty div if nothing is passed
                ctrl = $("<div></div>");
                break;
        }

        if ( control.popover ) {
            // now attach the popover to the div container for the control if set
            $(ctrl).attr({
                'rel': 'popover',
                'title': control.label,
                'data-content': control.tooltip
            }).popover();

        }

        return ctrl;


    },

    _control_preview = function() {

        // Preview a control

    },

    _control_load_tool_control_values = function(tool_config){

        var control_obj = {};

        $.each(tool_config,function(config_item,config_value){

            control_obj[config_item] = $("#config-" + config_item).val();

        });

        return control_obj;        

    },

    _control_drupal_edit_controls = function(divToolControls, evTool){

        if(typeof evTool.controls !== "object"){
                    
            // if there are no controls, tell the user
            divToolControls.append(
                
                $("<p/>",{"class":"notify"})
                    .html("This tool does not have any configurable properties.")
            );
        }
        else{

                var control_count = 1;
            // Add each control to the specified div
            $.each(evTool.controls, function (control_id, control) {
                
                console.log("control_count:", control_count++, control_id);
                // override default value with form based value, if exists
                
                if(typeof control.default_value === "object"){

                    // rebuild multiple items object
                    var tmp_obj = {};
                    $.each(control.default_value, function(index, val) {

                        //if(index == control_id){
                            tmp_obj[index] = evTool.configuration[index];   
                        //}

                        console.log("index", index);
                        console.log("value", val);
                     
                    });
                    console.log("tmp_obj", tmp_obj);

                    $.extend(true, control.default_value, tmp_obj);

                }
                else{
                    control.default_value = evTool.configuration[control_id];
                }
                                        
                console.log("DEFAULT VALUE", control.default_value);

                // add the tool to the controls area
                var tmpCtrl = EduVis.controls.create( evTool, "config-" + control_id, control),
                    control_buttons;

                if(typeof control.showApplyButton !== "undefined"){
                    
                    control_buttons = $("<div/>")
                        .append(

                            $("<button/>")
                                .addClass("btn btn-small config-apply-button")
                                .html("Apply")
                                .on("click", function(a){

                                    a.preventDefault();

                                    if(typeof control.applyClick !== "undefined"){
                                        control.applyClick();
                                    }
                                    
                                    console.log("control", control, "control_id:", control_id, "typeof: " + typeof control.default_value);

                                    // 
                                    // does this have multiple 
                                    if(typeof control.default_value === "object"){

                                        $.each(control.default_value,function(k,v){

                                            console.log("k,v",k,v);

                                            // todo: include control name in config item id.. 
                                            // config_range_date_start, for example.. currently using config key

                                            //evTool.configuration[k] = $("#" + k).val();

                                        });

                                    }
                                    else{
                                        console.log("else", control_id, control);   
                                        evTool.configuration[control_id] = $("#config-" + control_id).val();
                                    }
                                })
                        )
                                
                        .append(
                            $("<button/>")
                                .addClass("btn btn-small config-apply-button")
                                .html("Reset")
                                .on("click", function(a){
                                    a.preventDefault();
                                    //console.log("this:", this);
                                    console.log("----control configuration----", a);

                                    evTool.configuration[control] = control.default_value;

                                })
                        )   

                }

                divToolControls.append(
                   
                    $("<div/>")
                        .append(tmpCtrl)
                        .append(control_buttons)
                )

            });
        }

        return divToolControls;

    };

    eduVis.controls = {
        load : _control_load,
        preview : _control_preview,
        create : _control_create,
        load_tool_config_values : _control_load_tool_control_values,
        drupal_edit_controls : _control_drupal_edit_controls
    };


}(EduVis));
