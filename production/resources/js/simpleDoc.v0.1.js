//simpleDoc

sD = function(){

	var sD = {version : "0.0.1"},
	sD_document = document,
	sD_window = window;
	
	// sD.dependencies = {
	// 	scripts:{
	// 		"name":"jquery",
	// 		"src":"",
	// 		loaded : jQuery ? true : false;
	// 	}
	// };

	sD.setup = function() {

		//console.log(this.version);
		return "setup";

	};

	sD.test = function(){

		return "test";
	};

	sD.version = function(){

		return sD.version;

	};

	sD.createLayout = function(){

		return layout;
	};

	sD.loadDependencies = function(){

		if(!jQuery){
			// call query
			var script = document.createElement("script")
			script.type = "text/javascript";

			if (script.readyState){  //internet explorer
			    script.onreadystatechange = function(){
			        if (script.readyState == "loaded" || script.readyState == "complete"){
			            script.onreadystatechange = null;

			            sD.loadDependencies();
			        }
			    };
			} else {  // other browsers
			    script.onload = function(){
					
					sD.loadDependencies();
			    };
			}
			return false;
		}
		else{

			loadContinue();
		}
	};
  
	return sD;
}();