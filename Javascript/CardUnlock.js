$(document).ready(function() {
    $("body").click(function() {
        if($(".unlockedCard.hideCard").length == 0) {
            $(".unlockedCard").toggleClass("hideCard");
        }
    });
})

function showCard(unlockedCard){
    $(".unlockedCard").toggleClass("hideCard");
    findCard(unlockedCard);
}
    
    var _data;
       
function findCard(unlockedCard){
            
    var slqData = JSON.parse(localStorage.getItem("slqData"));

    if (slqData){
        populateCards(slqData, unlockedCard);
    }else{
        var data = {
            resource_id: "cf6e12d8-bd8d-4232-9843-7fa3195cee1c",
        }

        $.ajax({
            url: "https://data.gov.au/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22cf6e12d8-bd8d-4232-9843-7fa3195cee1c%22%20WHERE%20%22_id%22%20%3C62",
            data: data,
            dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise XSS).
            cache: true,
            success: function(data) {
                localStorage.setItem("slqData", JSON.stringify(data));	
                populateCards(data, unlockedCard);
            }
        });
    }
    
}
    
function populateCards(data, unlockedCard){
    var RandomCard;
    var dateTaken ="";
    var militaryDetails ="";
    var image = "";
    var highRes ="";
    var name = "";
    var title ="";
    var words;
        
    RandomCard = data.result.records.filter(x => x['_id'] == unlockedCard)[0];
    dateTaken = RandomCard["Temporal"];
    militaryDetails = RandomCard["Military Details"];
    image = RandomCard["Thumbnail image"];
    highRes = RandomCard["High resolution image"];
    title = RandomCard["Title of image"];
    words = title.split(" ");
    if(words != ""){
        name = words[1].slice(0,-1);  
    }
        
    while(image == ""){            
        RandomCard = data.result.records[Math.floor(Math.random() * (data.result.records.length))];
        image = RandomCard["Thumbnail image"];
        title = RandomCard["Title of image"];
        words = title.split(" ");
        if(words != ""){
            name = words[1].slice(0,-1);  
        }         
    }
        
    if($(".unlockedCard").children('').length>0){
        $(".unlockedCard .portrait").attr("src",image);
        $(".unlockedCard .soldierUnlock").html("You have unlocked: "+name);
    }else{
        $(".unlockedCard").append('<p class ="soldierUnlock whiteTextLarge"> You have unlocked: '+name);
        $(".unlockedCard").append('<img class ="portrait" src = "'+image+'"></img>');
    }
}