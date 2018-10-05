var markers = [];
var map;
var root;
var current;
var styleNo = 0;
$(document).ready(function() {
  $("#back_button").click(function() {
    current.hideChildren();
    current.hideChildrenPopups();
    current.hidePopup();
    current = current.getParent();
    current.showChildren();
    current.changeZoom();
    if(current.isRoot()) {
      $("#back").addClass("hidden"); 
    }
    else {
      updateMap(current.getPosition().lat(), current.getPosition().lng());
    }
  })
    
})
    
function Node(zoom) {
  this.zoom = zoom;
  this.children = [];
}

Node.prototype.addChild = function(marker) {
  this.children.push(marker);
  marker.setParent(this);
}

Node.prototype.hideChildren = function() {
  this.children.forEach(function(child) {
    child.hide();
  });
}

Node.prototype.showChildren = function() {
  this.children.forEach(function(child) {
    child.show();
  })
}

Node.prototype.hideChildrenPopups = function() {
  this.children.forEach(function(child) {
    child.hidePopup();
  })
}

Node.prototype.changeZoom = function() {
  if(this.zoom == null) {
    return false;
  }
  map.setZoom(this.zoom);
  return true;
}

Node.prototype.isRoot = function() {
  return false;
}

Node.prototype.isBottom = function() {
  return this.children.length == 0;
}

function Root(zoom) {
  Node.call(this, zoom);
}

Root.prototype = Object.create(Node.prototype);

Root.prototype.isRoot = function() {
  return true;
}

function Marker(latt, long, zoom=null, icon=null, popup=null) {
  Node.call(this, zoom);

  this.marker = new google.maps.Marker({
    position: {lat: latt, lng: long},
    map: map,
    icon: icon
  });
  this.parent = null;
  this.popup = popup;

  this.marker.addListener('click', this.click.bind(this));
}

Marker.prototype = Object.create(Node.prototype);

Marker.prototype.click = function(event) {
  if(this.changeZoom()) {
    current = this;
    updateMap(this.marker.getPosition().lat(), this.marker.getPosition().lng());
    showBack();
  }
  this.showPopup();
  if(!this.isBottom()) {
    if(this.parent != null) {
      this.parent.hideChildren();
      this.parent.hideChildrenPopups();
    }
    else {
      this.hide();
    }
    this.showChildren();
  }
}

Marker.prototype.setParent = function(marker) {
  this.parent = marker;
}

Marker.prototype.getParent = function(marker) {
  return this.parent;
}

Marker.prototype.hide = function() {
  this.marker.setMap(null);
}

Marker.prototype.show = function() {
  this.marker.setMap(map);
}

Marker.prototype.getPosition = function() {
  return this.marker.getPosition();
}

Marker.prototype.showPopup = function() {
  if(this.popup != null) {
    this.popup.show();
  }
}

Marker.prototype.hidePopup = function() {
  if(this.popup != null) {
    this.popup.hide();
  }
}

Popup = function(content, hidden=true) {
  this.content = content;
  this.content.classList.add("popup");
  document.getElementById("popups").appendChild(this.content);
  if(hidden) {
    this.content.classList.add("hidden");
  }
}

Popup.prototype.show = function() {
  this.content.classList.remove("hidden");
}

Popup.prototype.hide = function() {
  this.content.classList.add("hidden");
}

Question = function(question, answer, getNextQuestion, correct) {
  this.question = question;
  this.answer = answer;
  this.correct = correct;
  this.getNextQuestion = getNextQuestion;
  
  this.content = createQuestionContent(question, this.answerQuestion.bind(this));
  this.content.classList.add("question");
 // this.content.getElementsByTagName("form")[0].setAttribute("action", )
  document.getElementById("questions").appendChild(this.content);
}

Question.prototype.answerQuestion = function() {
  var ans = this.content.getElementsByTagName("input")[0].value;
  if(ans == this.answer) {
    var nextQuestion = this.getNextQuestion();
    if(nextQuestion != null) {
      this.changeQuestion(nextQuestion[0], nextQuestion[1]);
      this.content.getElementsByTagName("input")[0].value = "";
    }
    else {
      this.content.classList.add("hidden");
    }
    this.correct();
  }
  else {
    alert("Incorrect");
  }
}

Question.prototype.changeQuestion = function(question, answer) {
  this.question = question;
  this.answer = answer;
  this.content.getElementsByTagName("label")[0].innerHTML = question;
}

function createQuestionContent(question, callback) {
  var content = document.getElementById("questionTemplate").cloneNode(true);
  content.removeAttribute("id");
  content.classList.remove("template");
  content.getElementsByTagName("label")[0].innerHTML = question;
  content.getElementsByTagName("form")[0].addEventListener('submit', function(event) {event.preventDefault(); callback();});
  
  return content;
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), { center: {lat: 31, lng: 68},
          zoom: 8, disableDefaultUI: true, mapTypeId: 'terrain',zoomControl: false,
          scaleControl: false,scrollwheel: false,disableDoubleClickZoom: true,});

  var originalStyle = [{
    featureType: 'all',
    elementType: 'labels',
    stylers: [
      {visibility: 'off'}
    ]
  }, {
    featureType: 'administrative.country',
    elementType: 'labels',
    stylers: [
      {visibility: 'on'}
    ]
  }, {
    featureType: 'road',
    styles: [
      {visibility: 'off'}
    ]
  }, {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {visibility: 'off'}
  ]}] 
  
  var vintageStyle =[
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [{"color": "#ff7000"},{"lightness": "69"},{"saturation": "100"},
                    {"weight": "1.17"},{"gamma": "2.04"}
        ]
    },  
    {
        featureType: 'all',
        elementType: 'labels',
        stylers: [{visibility: 'off'}
    ]
    }, 
    {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [{visibility: 'on'}
    ]
    },
    {
        featureType: 'road',
        styles: [{visibility: 'off'}
    ]
    },  
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{"color": "#cb8536"}
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{"color": "#ffb471"},{"lightness": "66"},{"saturation": "100"}
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{"gamma": 0.01},{"lightness": 20}
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{"saturation": -31},{"lightness": -33},{"weight": 2},{"gamma": 0.8}
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"lightness": "-8"},{"gamma": "0.98"},{"weight": "2.45"},{"saturation": "26"}
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{"lightness": 30},{"saturation": 30}
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{"saturation": 20}
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"lightness": 20},{"saturation": -20}
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {"lightness": 10},{"saturation": -30}
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{"saturation": 25},{"lightness": 25}
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"lightness": -20},{"color": "#ecc080"}
        ]
    }]

  var retroStyle =[
    {
        "featureType": "administrative",
        "stylers": [{"visibility": "off"}
        ]
    },  
    {
        featureType: 'all',
        elementType: 'labels',
        stylers: [
          {visibility: 'off'}
        ]
    }, 
    {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [
          {visibility: 'on'}
        ]
    }, 
    {
        featureType: 'road',
        styles: [
          {visibility: 'off'}
        ]
    }, 
    {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {visibility: 'off'}
        ]
    },      
    {
        "featureType": "poi",
        "stylers": [{"visibility": "simplified"}
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {"visibility": "simplified"}
        ]
    },
    {
        "featureType": "water",
        "stylers": [{"visibility": "simplified"}
        ]
    },
    {
        "featureType": "transit",
        "stylers": [{"visibility": "simplified"}
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [{"visibility": "simplified"}
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [{"visibility": "off"}
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [{"visibility": "on"}
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{"visibility": "on"}
        ]
    },
    {
        "featureType": "water",
        "stylers": [{"color": "#84afa3"},{"lightness": 52}
        ]
    },
    {
        "stylers": [{"saturation": -17},{"gamma": 0.36}
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{"color": "#3f518c"}
        ]
    }]
  
  var s = [originalStyle, vintageStyle, retroStyle]
      
  map.set('styles', s[styleNo])
 
  root = new Root(2.5);
  var turkey = new Marker(39, 35, 6);
  var france = new Marker(48, 0.8, 6);
  root.addChild(turkey);
  root.addChild(france);
  var stats = {"casualties" : "115000", "involved" : "Australia, Britain, New Zealand, Turkey"};
  var popupContent = createPopupContent("Gallipoli", ["Lorem Ipsum"], stats);
  var popup = new Popup(popupContent);
  var gallipoli = new Marker(40.3, 26.5, 7, null, popup);
  var marker1 = new Marker(50, 50, 6);
  var marker2 = new Marker(51, 49.5);
  marker2.hide();
  marker1.addChild(marker2);
  var marker3 = new Marker(49, 49.2);
  marker3.hide()
  marker1.addChild(marker3);
  root.addChild(marker1);
  var marker4 = new Marker(65, 45, 6);
  root.addChild(marker4);
  var marker5 = new Marker(63, 49.6);
  marker5.hide();
  marker4.addChild(marker5);
  var marker6 = new Marker(67, 50);
  marker6.hide();
  marker4.addChild(marker6);
  turkey.addChild(gallipoli);
  gallipoli.hide();
  root.changeZoom();

  var questions = [["How many soldiers died at Gallipoli", "115000"], ["What countries were involved in Gallipoli", "Australia, Britain, New Zealand, Turkey"]];
  var getNextQuestion = function() {
    if(questions.length == 0) {
      return null;
    }
    else {
      return questions.shift();
    }
  }

  var q = getNextQuestion();
  var question = new Question(q[0], q[1], getNextQuestion, correct);
  // and other stuff...
  /*
  $("#search #submit").click(function(event) {
    event.preventDefault();
    var longitude = $("#longitude_text").val();
    var latitude = $("#latitude_text").val();
    updateMap(latitude, longitude);
    console.log("Longitude: " + $("#longitude_text").val() + "\nLatitude: " + $("#latitude_text").val());
  });*/

  
  map.addListener('click', function(event) {
    var longitude = event.latLng.lng();
    var latitude = event.latLng.lat();
    console.log("Longitude: " + longitude + "\nLatitude" + latitude);
  });
}

function showBack() {
  $("#back").removeClass("hidden");
}

function hideBack() {
  $("back").addClass("hidden");
}

function updateMap(latt, long){
  map.panTo(new google.maps.LatLng(latt, long));
}

//Adds marker to map and returns it
//A custom icon can be used, if no argument is given, the default icon is used
function addMarker(latt, long, icon = null){
  marker = new google.maps.Marker({
    position: {lat: latt, lng: long},
    map: map,
    icon: icon
  });
  markers.push(marker);
  return marker;
}

function setMarkerFocus(marker, zoom) {
  marker.addListener('click', function(event) {
    var latt = marker.getPosition().lat();
    var long = marker.getPosition().lng();
    updateMap(latt, long);
    map.setZoom(zoom);
  })
}

function createPopupContent(title, text, statistics) {
  var content = document.getElementById("popupTemplate").cloneNode(true);
  content.removeAttribute("id");
  content.classList.remove("template");
  var h = content.getElementsByTagName("h2")[0];
  h.innerHTML = title;
  var mainText = content.getElementsByClassName("popupText")[0];
  text.forEach(function(p) {
    var paragraph = document.createElement("p")
    paragraph.innerHTML = p;
    mainText.appendChild(paragraph);
  });
  var stats = content.getElementsByClassName("stats")[0];
  for(var key in statistics) {
    var stat = document.createElement("h4");
    stat.innerHTML = key;
    stats.appendChild(stat);
    var value = document.createElement("p");
    value.innerHTML = statistics[key];
    stats.appendChild(value);
  }
  return content;
}

function correct() {
  var unlockedCards = JSON.parse(localStorage.getItem("unlockedCards"));
  if(!unlockedCards) {
    unlockedCards = [44, 30, 24, 14, 43];
  }

  
  if(!localStorage.getItem("lockedCards")){
    var data = {
        resource_id: "cf6e12d8-bd8d-4232-9843-7fa3195cee1c"
    }

    $.ajax({
			url: "http://data.gov.au/api/action/datastore_search",
			data: data,
			dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
			cache: true,
			success: function(data) {
				//localStorage.setItem("slqData", JSON.stringify(data));	
        var lockedCards = [];
        $.each(data.result.records, function(key, value) {
          if(unlockedCards.indexOf(value["_id"]) == -1 && value["Thumbnail image"] != "") {
            lockedCards.push(value["_id"]);
          }
        })
        localStorage.setItem("lockedCards", JSON.stringify(lockedCards));
        unlockCard();
			}
		});
  }
  else 
  unlockCard()
  /*
  var unlocked;
  do{
    unlocked = Math.floor(Math.random() * 54);
  } while(unlockedCards.indexOf(unlocked) != -1)
  unlockedCards.push(unlocked);
  console.log(unlocked);
  localStorage.setItem("unlockedCards", JSON.stringify(unlockedCards));*/
  showCard();
}

function unlockCard() {
  lockedCards = JSON.parse(localStorage.getItem("lockedCards"));
  unlockedCards = JSON.parse(localStorage.getItem("unlockedCards"));
  index = Math.floor(Math.random() * lockedCards.length)
  var unlocked = lockedCards[index];
  unlockedCards.push(unlocked);
  lockedCards.splice(index, 1);
  localStorage.setItem("unlockedCards", JSON.stringify(unlockedCards));
  localStorage.setItem("lockedCards", JSON.stringify(lockedCards));  
}

$(document).keypress(function(event) {
    if(event.which == 49){
        styleNo = 0;
        initMap();
    }else if(event.which == 50){
        styleNo = 1;
        initMap();
    }else if(event.which == 51){
        styleNo = 2;
        initMap();
        
    }
  
});