var JSONf= {};

load('http://academy.tutoky.com/api/json.php', function(xhr)
	// {}); 
{
    // document.getElementById('main-content').innerHTML = xhr.responseText;
    JSONf=JSON.parse(xhr.responseText);
    console.log(JSONf);
    CreatePage();
});

function load(url, callback) {


	if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0",
		"MSXML2.XmlHttp.4.0",
		"MSXML2.XmlHttp.3.0",
		"MSXML2.XmlHttp.2.0",
		"Microsoft.XmlHttp"]

		for(var i = 0, len = versions.length; i < len; i++) {
			try {
				xhr = new ActiveXObject(versions[i]);
				break;
			}
			catch(e){}
             } // end for
         }
         
         xhr.onreadystatechange = ensureReadiness;
         
         function ensureReadiness() {
         	if(xhr.readyState < 4) {
         		return;
         	}

         	if(xhr.status !== 200) {
         		return;
         	}

            // all is well 
            if(xhr.readyState === 4) {
            	callback(xhr);
            }          
        }

        xhr.open('GET', url, true);
        xhr.send('');
    }

    function CreateContent (extTitle,extTimestamp,extImageNo){
    	var extImageNo=0|extImageNo;
    	var article = document.createElement("article");
    	article.className="video";
    	var newDiv = document.createElement("div");
    	newDiv.className="overlay";
    	article.appendChild(newDiv);
    	var mainTitle=document.createElement("h2");
    	var mainTitleText=document.createTextNode("Check out this cool video!");
    	mainTitle.appendChild(mainTitleText);
    	newDiv.appendChild(mainTitle);
    	var videoStillPck = document.createElement("div");
    	videoStillPck.className="video-still-package";
    	article.appendChild(videoStillPck);
    	var image=document.createElement("img");
    	image.className="still";
    	image.alt="";
    	image.src="_img/"+extImageNo+".jpg";
    	videoStillPck.appendChild(image);
    	var playBtn=document.createElement("div");
    	playBtn.className="play-button";
    	videoStillPck.appendChild(playBtn);
    	var textBlock=document.createElement("section");
    	textBlock.className="textblock";
    	article.appendChild(textBlock);
    	var title=document.createElement("h2");
    	var titleText=document.createTextNode(extTitle);
    	title.className="titulok truncate";
    	title.id="nadpis";
    	title.appendChild(titleText);
    	textBlock.appendChild(title);
    	var timestamp = document.createElement("time");
    	timestamp.className="date";
    	timestamp.id="timestamp";
    	var timestampData=document.createTextNode(extTimestamp);
    	timestamp.appendChild(timestampData);
    	textBlock.appendChild(timestamp);
    	// console.log(article);
    	var content = document.getElementById("main-content");
    	content.appendChild(article);
    };



function CreatePage(page){
	var currPage=document.getElementById("main-content").innerHTML="";
    var page = page||0;
	var noOfItems = 0*1;
    
    if (page*10+10>JSONf.length){
        noOfItems=JSONf.length;
    } else {
        noOfItems=(page*10)+10;
    }

    for (var i=(page*10);i<noOfItems;i++){
		CreateContent(JSONf[i].title,convertTime(JSONf[i].timestamp),JSONf[i].image);
        
	}
    if (page===0){
        var link = document.getElementById('prevbtn');
        link.style.visibility = 'hidden'; 
        
    }
    else {
        var link = document.getElementById('prevbtn');
        link.style.visibility = 'visible';
        
    }

    if (page===Math.floor(noOfItems/10)){
        var link = document.getElementById('nextbtn');
        link.style.visibility = 'hidden'; 
        }
        else {
        var link = document.getElementById('nextbtn');
        link.style.visibility = 'visible';
        }
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
    return formattedDate +" "+formattedTime;
}
