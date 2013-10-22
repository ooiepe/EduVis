
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
                        self.customization_update();
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
                        tool.customization_update();
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
                        'for': id + "_dp",
                        'title': control.tooltip
                    })
                    .html(control.description);

                input = $("<input />")
                    .addClass("input-small")
                    .attr({
                        "id": id,
                        "type": "text"
                    })
                    .addClass("datepicker")
                    .val(control.default_value)
                    .on("change", function () {
                        tool.customization_update();
                    });

                // set jquery datepicker settings
                $( input ).datepicker({
                    "dateFormat": "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: true
                })
                    .on("changeDate", function () {
                        tool.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control ctlhandle")
                    .append(lbl)
                    .append(input);

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
                    });

                ctrl = $("<div/>")
                    .append(dataBrowserButton)
                    .append(dataBrowserContainer)

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

    };

    eduVis.controls = {
        load : _control_load,
        preview : _control_preview,
        create : _control_create,
        load_tool_config_values : _control_load_tool_control_values
    };


}(EduVis));
