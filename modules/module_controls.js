
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

                var radio_btn_click = function(){

                    var start_input = $("#"+id+"_date_start"),
                        start_lbl = start_input.parent().find("label:first"),
                        start_button = start_input.parent().find("label:last"),

                        end_input = $("#"+id+"_date_end");

                    if($("#" + id + "_drOptionsRealTime").prop("checked")){

                        start_lbl.html("<b>Days Prior</b>");
                        start_button.hide();

                        end_input.val("now");

                        dr_date_end.hide();

                    }
                    else{

                        start_lbl.html("<b>Start Date</b>");
                        start_button.show();

                        start_input.val(tool.configuration.date_start);

                        dr_date_end.show();

                        if(tool.configuration.date_end == "now"){
                            end_input
                                .datepicker("setDate", new Date() );
                        }else{
                            end_input
                                .datepicker("setDate", tool.configuration.date_end);
                        }
                    }
                };

                var radioArchive,
                    radioRealTime,
                    spanArchive,
                    spanRealTime,
                    dr_container = $("<div/>").attr("id","drContainer"),
                    dr_options = $("<div/>")
                        .addClass("row-fluid")
                        // two radios
                        .append(
                            
                            $("<div/>")
                                .addClass("span3")
                                .append(
                                    radioRealTime = $("<input/>")
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
                                    radioArchive = $("<input/>")
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
                            "description" : obj_control.default_value.date_end === "now" ? "<b>Days Prior<b>" : "<b>Start Date<b>",
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
                            "update_event": function(){
                                alert("start date changed: " + $(this).val());
                            }
                        })
                        .val(obj_control.default_value.date_end)
                        .addClass("span3")
                        .css({
                            
                        });

                // default radio checked
                if(obj_control.default_value.date_end == "now"){
                    dr_date_end.hide();
                    radioRealTime.click();
                }
                else{
                    dr_date_end.show();
                    radioArchive.click();
                }

                dr_inputs
                    .append(dr_date_start)
                    .append(dr_date_end);

                ctrl = dr_container
                    .append(dr_options)
                    .append(dr_inputs);

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
                    control_buttons,
                    showApplyButtons;

                if(typeof control.showApplyButton === "undefined"){
                    showApplyButtons = true;
                }
                else{
                    showApplyButtons = control.showApplyButton;
                }
                    
                if(showApplyButtons){

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
