function Pagination (url, idRender, pageSize,idButtons){
	this.url=url;
	this.idRender=idRender;
	this.idButtons=idButtons;
	this.pageSize=pageSize*1;
	this.currentPage=0*1;
	this.noOfItems=0;
	this.maxNoOfItems=0;
	this.goNext = this.goNext.bind(this);
	this.goBack = this.goBack.bind(this);
}

Pagination.prototype.loadJSON = function(url,callback){ //load json file
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

Pagination.prototype.renderArticles=function (p){ //render pageSize of articles on page p
	var idRender=this.idRender;
	var pageSize=this.pageSize;
	var page=p;
	var noOfItems=0;
	
	convertTime = function(JSONtimestamp){
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

	function render(JSONf,idR,pageS,p){
	
		if (p*pageS+(pageSize*1)>JSONf.length){
        noOfItems=JSONf.length;
   		} else {
        noOfItems=(p*pageS)+(pageS*1);
    	}

    	for (var i=(pageSize*p);i<noOfItems;i++){

		var extImageNo=0|JSONf[i].image;
    	var article = document.createElement("article");
    	article.className="video";
    	var newDiv = document.createElement("div");
    	newDiv.className="overlay";
    	article.appendChild(newDiv);

    	if(JSONf[i].categories.length!==0){

    		for(var k=0;k<JSONf[i].categories.length;k++){
    			var tagContainer = document.createElement("div");
    			tagContainer.className="tags";
    			var mainTitle=document.createElement("p");
    			var mainTitleText=document.createTextNode(JSONf[i].categories[k]);
    			mainTitle.appendChild(mainTitleText);
    			tagContainer.appendChild(mainTitle);
    			newDiv.appendChild(tagContainer);
    		}

    	}

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
    	var titleText=document.createTextNode(JSONf[i].title);
    	title.className="videoTitle truncate";
    	title.appendChild(titleText);
    	textBlock.appendChild(title);
    	var timestamp = document.createElement("time");
    	timestamp.className="date";
    	timestamp.id="timestamp";
    	var timestampData=document.createTextNode(convertTime(JSONf[i].timestamp));
    	timestamp.appendChild(timestampData);
    	textBlock.appendChild(timestamp);
   
    	var content = document.getElementById(idRender);
    	content.appendChild(article);
			
		};

	}

	this.loadJSON(this.url,function (xhr){
		var JSONfile=JSON.parse(xhr.responseText);
		this.maxNoOfItems=JSONfile.length;
 		render(JSONfile,this.idRender,this.pageSize,page);
		this.renderButtons();
	}.bind(this));

}

Pagination.prototype.renderButtons=function (){
	
	var prevBtn = document.createElement("div");
	prevBtn.id="prevbtn";
	var prevBtnTxt=document.createTextNode("PREVIOUS");
	prevBtn.appendChild(prevBtnTxt);
	var pageBtns = document.createElement("div");
	pageBtns.id="pgbtn";
	
	console.log(this.maxNoOfItems%this.pageSize);
	
	var evenVsOddPages=0*1;
	
	if(this.maxNoOfItems%this.pageSize===0){
		evenVsOddPages=0;
		console.log(evenVsOddPages);
	} else 
		{
		evenVsOddPages=1;
		console.log(evenVsOddPages);
		}

	for (var i=0;i<Math.floor(this.maxNoOfItems/this.pageSize)+evenVsOddPages;i++){
		var buttonBlock=document.createElement("div");
		
		var buttonNum=document.createTextNode(i+1);
		buttonBlock.appendChild(buttonNum);
		buttonBlock.setAttribute('data-id', i);
		if (this.currentPage===i){
			buttonBlock.className="navitems";

		} else{
			buttonBlock.className="navitemsInactive";
		}

		pageBtns.appendChild(buttonBlock);
	}
	pageBtns.addEventListener("click", function(e){
		var target = e.target;
		var btnId=target.getAttribute("data-id");
		document.getElementById("main-content").innerHTML="";
		this.currentPage=btnId*1;
		this.renderArticles(btnId);
	}.bind(this));

	var nextBtn = document.createElement("div");
	nextBtn.id="nextbtn";
	var nextBtnTxt=document.createTextNode("NEXT");
	nextBtn.appendChild(nextBtnTxt);
	
	nextBtn.addEventListener("click",this.goNext);
	prevBtn.addEventListener("click",this.goBack);

	var navigationBar=document.getElementsByTagName(this.idButtons)[0];
	navigationBar.innerHTML="";
	navigationBar.appendChild(prevBtn);
	navigationBar.appendChild(pageBtns);
	navigationBar.appendChild(nextBtn);

}

Pagination.prototype.goNext=function(){

	if(this.maxNoOfItems%this.pageSize===0){

		if (this.currentPage<(Math.floor(this.maxNoOfItems/this.pageSize))-1){
			document.getElementById("main-content").innerHTML="";
			this.renderArticles(this.currentPage+=1);
		}
	}else {
		if (this.currentPage<(Math.floor(this.maxNoOfItems/this.pageSize))){
			document.getElementById("main-content").innerHTML="";
			this.renderArticles(this.currentPage+=1);
		}
	}
		
}

Pagination.prototype.goBack=function(){
	
	if (this.currentPage!==0){
		document.getElementById("main-content").innerHTML="";
		this.renderArticles(this.currentPage-=1);
	}
	
}	




var MyPag = new Pagination('http://academy.tutoky.com/api/json.php','main-content','10','nav');

MyPag.renderArticles(0);
