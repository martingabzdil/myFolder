var subor="";
var globPage=0;

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

function hideBtns(page){
	


	if (page===0){
		var link = document.getElementById('prevbtn');
		link.style.visibility = 'hidden'; 
		
	}
	else {
		var link = document.getElementById('prevbtn');
		link.style.visibility = 'visible';
		
	}

	if (page===(Math.floor(subor.length/10))){
		var link = document.getElementById('nextbtn');
		link.style.visibility = 'hidden'; 
		}
		else {
		var link = document.getElementById('nextbtn');
		link.style.visibility = 'visible';
		}
}		

function fillInfo(subor,page){
	page=page||0;
	globPage=page;
	var content="";
	var noOfItems = 0*1;
	hideBtns(page);

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
	globPage=btnId;
	fillInfo(subor,btnId);
	hideBtns(btnId);
}

function next(){
	loadItems(globPage+1);
}
function back(){
	loadItems(globPage-1);
}

var convertTime = function(JSONtimestamp){
	var d = new Date(JSONtimestamp*1);
	var m = d.getMonth();
	var mth="";
	var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
	mth = months[m];
	var formattedDate = d.getDate() + "-" + mth + "-" + d.getFullYear();
	var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
	var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
	var formattedTime = hours + ":" + minutes;
	// formattedDate = formattedDate + " " + formattedTime;
	return formattedDate;
}