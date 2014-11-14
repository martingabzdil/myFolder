var subor="";

function loadJSON(){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			subor = JSON.parse(xmlhttp.responseText);
			fillInfo(subor);
			createNavBtns(subor);
		}
	}
	xmlhttp.open("GET","http://academy.tutoky.com/api/json.php",true);
	xmlhttp.send();
}

function fillInfo(subor,page){
	page=page||0;
	var content="";
	var noOfItems = 0*1;
	
	if (page*10+10>subor.length){
		noOfItems=subor.length;
	} else {
		noOfItems=(page*10)+10;
	}
		for(var i=(page*10);i<noOfItems;i++){
			content+='<article class="video">';
			content+='<div class="overlay">';
			content+='<h2>Check out this cool video!</h2>';
			content+='</div><div class="video-still-package">';
			content+='<img class="still" src="_img/'
			content+=subor[i].image;
			content+='.jpg"alt=""/>';
			content+='<div class="play-button">';
			content+='</div></div><section class="textblock">';
			content+='<h2 class="titulok truncate" id="nadpis">';
			content+=subor[i].title;
			content+='</h2><time class="date" id="timestamp">';
			content+=convertTime(subor[i].timestamp);
			content+='</time></section></article>';
	}
	


	document.getElementById("main-content").innerHTML=content;
	
}

function createNavBtns(subor){
	var buttonBlock="";
	for (var i =0;i<(subor.length)/10;i++){
		buttonBlock+='<div class="navitems" id="btn'+i+'" onclick="loadItems('+i+');">'+(i+1)+'</div>';
	}
	document.getElementById("pgbtn").innerHTML=buttonBlock; 
}

function loadItems(btnId){
	fillInfo(subor,btnId);
}

var convertTime = function(JSONtimestamp){
	var d = new Date(JSONtimestamp*1);
	var m = d.getMonth()+1;
	var mth="";
	switch (m){
		case 1:
			mth="January"	
			break;
		case 2:
			mth="February"	
			break;
		case 3:
			mth="March"	
			break;
		case 4:
			mth="April"	
			break;
		case 5:
			mth="May"	
			break;
		case 6:
			mth="June"	
			break;
		case 7:
			mth="July"	
			break;
		case 8:
			mth="August"	
			break;
		case 9:
			mth="September"	
			break;
		case 10:
			mth="October"	
			break;
		case 11:
			mth="November"	
			break;
		case 12:
			mth="December"	
			break;
	}
	 

	var formattedDate = d.getDate() + "-" + mth + "-" + d.getFullYear();
	var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	var formattedTime = hours + ":" + minutes;
	// formattedDate = formattedDate + " " + formattedTime;
	return formattedDate;
}