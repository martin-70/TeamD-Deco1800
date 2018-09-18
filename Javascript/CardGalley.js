$(document).ready(function() {
    /*
        function Node(zoom) {
      this.zoom = zoom;
      this.children = [];
    }
    
        function showBack() {
      $("#back").removeClass("hidden");
    }

    function hideBack() {
      $("back").addClass("hidden");
    }
  var stat = document.createElement("h4");
    stat.innerHTML = key;
    stats.appendChild(stat);
    var value = document.createElement("p");
    value.innerHTML = statistics[key];
    stats.appendChild(value);
*/
    var _data;

    function populateCards(data){
        
        $.each(data.result.records, function(recordKey, recordValue) {
            var image = recordValue["Thumbnail image"];
            var id = recordValue["_id"];
            var title = recordValue["Title of image"];
            //get name out of title
            var name = "";
            var words = title.split(" ");
            if(words != ""){
                 name = words[1].slice(0,-1);  
            }
                     
            
            if(image !=""){
                
                if(id == "44" || id == "30" || id == "24" || id == "14" || id == "43"){
                      $("#cardContainer").append('<div class = "card"><img class ="portrait" src = "'+image+'"></img><p class = "soldierName whiteTextLarge">'+ name+'</p></div>');
                }else{
                    $("#cardContainer").append('<div class = "card"><img class ="portrait lockedCard" src = "'+image+'"></img><p class = "soldierName whiteTextLarge">'+ name+'</p></div>');
                }
             
            }
         
        }
               
        
    )};

    
  var slqData = JSON.parse(localStorage.getItem("slqData"));

	if (slqData){
		populateCards(slqData);
	}else{
		var data = {
			resource_id: "cf6e12d8-bd8d-4232-9843-7fa3195cee1c",
		
		}

		$.ajax({
			url: "http://data.gov.au/api/action/datastore_search",
			data: data,
			dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
			cache: true,
			success: function(data) {
				localStorage.setItem("slqData", JSON.stringify(data));	
				populateCards(data);
			}
		});
	}
	
});