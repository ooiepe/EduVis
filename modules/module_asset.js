/*  *  *  *  *  *  *  *
*
* EduVis.asset
*
*/

/**
* Asset loading.. scripts and stylesheets
*
* @class asset

* to do: inline documentation 
*/

(function (eduVis) {
  
  "use strict";

  var _asset_version = "0.0.1",

  _asset_getStatus = function(a){
    if(typeof a.status === "undefined"){
      a.status = "";
    }
    return a;
  },

  _asset_isQueued = function(a){
    return _asset_getStatus(a).status == "queued";
  },

  _asset_isLoading = function(a){
    return _asset_getStatus(a).status == "loading";
  },

  _asset_isLoaded = function(a){
    return _asset_getStatus(a).status == "loaded";
  },

  _asset_hasDependency = function(a){
    if(typeof a.dependsOn !== "undefined"){
      if(a.dependsOn.length > 0){ return true; }
    }
    else{ a.dependsOn = []; }
    return false;
  },

  _asset_isDependencyLoaded = function(a){
    return _asset_isLoaded(a);
  },

  _asset_areDependenciesLoaded_byName = function(a,scripts){
    return _asset_areDependenciesLoaded(_asset_findDependencyByName(a,scripts),scripts);
  },

  _asset_areDependenciesLoaded = function(a,scripts){
   
    var dependendencies_loaded = 0;

    if(typeof a.dependsOn !== undefined)
      if(a.dependsOn.length==0) return true;

    $.each(a.dependsOn,function(i,d){
      if(_asset_isLoaded(_asset_findDependencyByName(d,scripts))){
        dependendencies_loaded++;
      } 
    });
    
    return dependendencies_loaded == a.dependsOn.length ? true : false;
  },

  _asset_areAssetsLoaded = function(scripts){
    var assets_loaded = true;
    $.each(scripts, function(a, asset){
      if(!_asset_isLoaded(asset)){
        assets_loaded = false;
      }
    });
    return assets_loaded;
  },

  _asset_findDependencyByName = function(name,scripts){
    
    var asset_selected;
    $.each(scripts, function(z, asset){

      if(asset.name == name) asset_selected = asset;
      return ( asset.name !== name);

    });
    return asset_selected;
  },

  _asset_load_script = function(sao, scripts, _tool_name){

    // is script status loaded
    if(!_asset_isLoaded(sao)){

      // is script status loading
      if(!_asset_isLoading(sao)) {
      
        var asset_path = "";
        
        sao.status = "loading";

        if(typeof sao.resource_type !== "undefined"){

          switch(sao.resource_type){
            case "system":
              asset_path = EduVis.Environment.getPathResources() + "/" + sao.url;
              break;
            case "tool":
              // default to the tools path
              asset_path = EduVis.Environment.getPathTools() + _tool_name + "/" + sao.url;
              break;
            case "external":
              asset_path = sao.url;
            default: 
              asset_path = ""; //EduVis.Environment.getPathTools() + _tool_name + "/" + sao.url;
          }
        }
        else{
          // default to tools path if resource_type is set but incorrectly
          asset_path = sao.url.indexOf("http")==0 ? sao.url : EduVis.Environment.getPathTools()  + _tool_name + "/" + sao.url;

        }
        
        //ajax request for script
        $.getScript( asset_path )
          
          .done(function( script, textStatus ) {

            sao.status = "loaded";

            // test if all assets are loaded.. if not, call asset queue
            if( !_asset_areAssetsLoaded(scripts)){
              _asset_queue_scripts(scripts,_tool_name);
            }

          })
          
          .fail(function( jqxhr, settings, exception ) {
            console.error("ajaxError:", exception);
            sao.status = "failure";
            sao.error = exception;
          });
      }
    }
  },
  _asset_load_stylesheet = function( _obj_stylesheet, _tool){

      var sheet = document.createElement("link");

      // if http, we assume external.. set stylesheet src
      // if not http, build the resource path and append the src.. append the tool name for folder

      var sheet_href = _obj_stylesheet.src.indexOf("http")==0 ? _obj_stylesheet.src : EduVis.Environment.getPathTools() + "/" + _tool + "/" + _obj_stylesheet.src; 

      sheet.setAttribute('type', 'text/css');
      sheet.setAttribute('href',  sheet_href);
      sheet.setAttribute('rel','stylesheet')

      if (sheet.readyState){  //internet explorer
          sheet.onreadystatechange = function(){
              if (sheet.readyState == "loaded" || sheet.readyState == "complete"){
                  
                  sheet.onreadystatechange = null;

                  //_resource_queue_remove(_obj_stylesheet);

                  // remove resource from resource queue
                  // setTimeout("_resource_queue_remove(_obj_stylesheet)");
                  //     (function(){                            
                  //         console.log("remove STYLESHEET from queue....")
                  //         ;

                  //     })()
                  // );
                      
              }
          };
      } else {  // other browsers
          sheet.onload = function(){

              //console.log(".....sheet onload......")
              //_resource_queue_remove(_obj_stylesheet);

              // setTimeout( "_resource_queue_remove(_obj_stylesheet)");
                  // (function(){
                      
                  //     // remove resource from resource queue
                  //     console.log("remove STYLESHEET from queue....")
                  //     _resource_queue_remove(_obj_stylesheet);

                  // })()
              //);
          }
      }

      document.getElementsByTagName('head')[0].appendChild(sheet);
  },

  _asset_load_dependency = function(sao, scripts, _tool_name){

    // does this dependency have sub dependencies
    // if not, load it
    if(!_asset_hasDependency(sao)){
      _asset_load_script(sao, scripts, _tool_name);
    }
    else{
      // sub dependencies are present
      // are the sub dependencies loaded
      // if so, load them
      if(_asset_areDependenciesLoaded(sao,scripts)){
        _asset_load_script(sao, scripts, _tool_name);
      }
      else{
        // sub sub dependencies are presnet
        $.each(sao.dependsOn, function(doi, dependencyName){
            
            // do the sub sub dependencies have additional dependencies?

            if(_asset_hasDependency(_asset_findDependencyByName(dependencyName,scripts))){
              
              // are sub sub dependencies loaded
              if(!_asset_areDependenciesLoaded(_asset_findDependencyByName(dependencyName,scripts),scripts)){
                _asset_load_dependency(_asset_findDependencyByName(dependencyName,scripts), scripts, _tool_name);
              }
              else{
                // if sub sub dependencies loaded, load it
                _asset_load_script(_asset_findDependencyByName(dependencyName,scripts), scripts, _tool_name); 
              }
            }
            else{
              _asset_load_dependency(_asset_findDependencyByName(dependencyName,scripts),sao, scripts, _tool_name);
            }
        });
      }
   }
  },

  _asset_queue_scripts = function( scripts, _tool_name){

    //console.log("ASSET QUEUE RESOURCES -> resources", scripts);

    // script asset object
    $.each(scripts, function(si, sao){
      /// does this have dependency?
      // if not, load it
      if(!_asset_hasDependency(sao)){
        _asset_load_script(sao, scripts, _tool_name);
      }
      else{
        //_asset_load_dependency(_asset_findDependencyByName(name));
        _asset_load_dependency(sao, scripts, _tool_name);
      }
    });
  },

  _asset_queue_stylesheets = function(stylesheets, _tool_name){

    //console.log("ASSET QUEUE STYLESHEETS -> stylesheets", stylesheets);

    $.each(stylesheets, function(i,v){

      //console.log(".. load the stylesheet", i, v);
      _asset_load_stylesheet( v, _tool_name );

    });

  },

  _asset_queue_assets = function(resources, _tool_name){

    _asset_queue_stylesheets(resources.stylesheets, _tool_name);
    _asset_queue_scripts(resources.scripts, _tool_name);

  };

  eduVis.asset = {

    load_script : _asset_load_script,
    queue_assets : _asset_queue_assets,
    areAssetsLoaded : _asset_areAssetsLoaded

  };

}(EduVis));

//inject into a new style via ajax
// $.ajax({
//   url:"site/test/style.css",
//   success:function(data){
//        $("<style></style>").appendTo("head").html(data);
//   }
// })

//firefox implementation for testing if styles have loaded
// var _asset_load_stylesheet = function(){
  
//  // firefox
//   var style = document.createElement('style');
//   style.textContent = '@import "' + url + '"';

//   var fi = setInterval(function() {
//     try {
//       style.sheet.cssRules; // <--- MAGIC: only populated when file is loaded
//       CSSDone('listening to @import-ed cssRules');
//       clearInterval(fi);
//     } catch (e){}
//   }, 10);  

//   head.appendChild(style);

// };
