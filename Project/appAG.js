var app=angular.module("app",[]);

app.controller("pagination",Pagination);
app.controller("app",App);

function Pagination (idButtons, pageSize){
	this.idButtons=idButtons;
	this.pageSize=parseInt(pageSize,10);
	this.currentPage=parseInt("0",10);
	this.maxNoOfItems=0;
	this.goNext = this.goNext.bind(this);
	this.goBack = this.goBack.bind(this);
	this.loadMore = this.loadMore.bind(this);
	this.renderButtons=this.renderButtons.bind(this);
	Pagination.instances.push(this);

}

Pagination.prototype.destroy = function () {
    var i = 0;
    while (Pagination.instances[i] !== this) { i++; }
    Pagination.instances.splice(i, 1);
};

Pagination.instances = [];

Pagination.prototype.renderButtons=function (){
	
	var prevBtn = document.createElement("div");
	prevBtn.id="prevbtn";
	var prevBtnTxt=document.createTextNode("◄ PREVIOUS");
	prevBtn.appendChild(prevBtnTxt);
	var pageBtns = document.createElement("div");
	pageBtns.id="pgbtn";
	
	var evenVsOddPages=parseInt("0",10);
	
	if(this.maxNoOfItems%this.pageSize===0){
		evenVsOddPages=0;
	} else 
	{
		evenVsOddPages=1;
	}

	var maxPg=Math.floor(this.maxNoOfItems/this.pageSize)+evenVsOddPages;
	
	if(this.currentPage<2){
		for(var j=0;j<3;j++){
			createPageButton(j,this.currentPage);
		}
		createThreeDots();
		createPageButton(maxPg-1,this.currentPage);
	}
	if(this.currentPage===2){
		for(var j=0;j<4;j++){
			createPageButton(j,this.currentPage);
		}
		createThreeDots();
		createPageButton(maxPg-1,this.currentPage);
	}
	if((this.currentPage+1)<maxPg-1 && (this.currentPage-1)>=2){
		createPageButton(0,this.currentPage);
		createThreeDots();
		for (var k =this.currentPage-1;k<this.currentPage+2;k++){
			createPageButton(k,this.currentPage);
		}
		createThreeDots();
		createPageButton(maxPg-1,this.currentPage);	
	}
	if (this.currentPage===maxPg-2){
		createPageButton(0,this.currentPage);
		createThreeDots();
		for (var k =this.currentPage-1;k<this.currentPage+2;k++){
			createPageButton(k,this.currentPage);
		}
	}
	if(this.currentPage===maxPg-1 || this.currentPage===maxPg){
		createPageButton(0,this.currentPage);
		createThreeDots();
		createPageButton(maxPg-2,this.currentPage);
		createPageButton(maxPg-1,this.currentPage);
	}

	function createPageButton(i,curPg){

		var buttonBlock=document.createElement("div");
		
		var buttonNum=document.createTextNode(i+1);
		buttonBlock.appendChild(buttonNum);
		buttonBlock.setAttribute('data-id', i);

		if (i===curPg){
			buttonBlock.className="navitems";

		} else{
			buttonBlock.className="navitemsInactive";
		}

		pageBtns.appendChild(buttonBlock);

	};

	function createThreeDots(){
		var textBlock=document.createTextNode("...");
		pageBtns.appendChild(textBlock);
	}

	pageBtns.addEventListener("click", function(e){
		var target = e.target;
		var btnId=target.getAttribute("data-id");
		document.getElementById("main-content").innerHTML="";
		this.currentPage=parseInt(btnId,10);
		
		App.instances[0].renderArticles(btnId);
	}.bind(this));

	var nextBtn = document.createElement("div");
	nextBtn.id="nextbtn";
	var nextBtnTxt=document.createTextNode("NEXT ►");
	nextBtn.appendChild(nextBtnTxt);

	var loadMoreBtn = document.createElement("div");
	loadMoreBtn.id="loadMoreBtn";
	var lmBtnTxt=document.createTextNode("LOAD MORE");
	loadMoreBtn.appendChild(lmBtnTxt);
	
	loadMoreBtn.addEventListener("click",this.loadMore); //event listeners
	nextBtn.addEventListener("click",this.goNext);
	prevBtn.addEventListener("click",this.goBack);

	var navigationBar=document.getElementsByTagName(this.idButtons)[0];
	navigationBar.innerHTML="";
	navigationBar.appendChild(prevBtn);
	navigationBar.appendChild(pageBtns);
	navigationBar.appendChild(nextBtn);
	navigationBar.appendChild(loadMoreBtn);



}

Pagination.prototype.goNext=function(){

	if(this.maxNoOfItems%this.pageSize===0){

		if (this.currentPage<(Math.floor(this.maxNoOfItems/this.pageSize))-1){
			document.getElementById("main-content").innerHTML="";
			App.instances[0].renderArticles(this.currentPage+=1);
		}
	}else {
		if (this.currentPage<(Math.floor(this.maxNoOfItems/this.pageSize))){
			document.getElementById("main-content").innerHTML="";
			App.instances[0].renderArticles(this.currentPage+=1);
		}
	}

}

Pagination.prototype.goBack=function(){
	
	if (this.currentPage!==0){
		document.getElementById("main-content").innerHTML="";
		App.instances[0].renderArticles(this.currentPage-=1);
	}
}	

Pagination.prototype.loadMore=function(){
	App.instances[0].renderArticles(this.currentPage+=1);
}



function App (url, elementId, pageSize){
	this.url=url;
	this.elementId=elementId;
	this.pageSize=parseInt(pageSize,10);
	App.instances.push(this);
}

App.prototype.destroy = function () {
	var i = 0;
	while (App.instances[i] !== this) { i++; }
	App.instances.splice(i, 1);
};

App.instances = [];

App.prototype.loadJSON = function(url,callback){ //load json file
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
		}
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

App.prototype.renderArticles=function (p){ //render pageSize of articles on page p

	function convertTime(JSONtimestamp){
		var d = new Date(parseInt(JSONtimestamp,10));
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

		var noOfItems=0;

		if (p*pageS+(parseInt(pageS,10))>JSONf.length){
			noOfItems=JSONf.length;
		} else {
			noOfItems=(p*pageS)+(parseInt(pageS,10));
		}

		for (var i=(pageS*p);i<noOfItems;i++){

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

			var content = document.getElementById(idR);
			content.appendChild(article);

		};

	}

	this.loadJSON(this.url,function (xhr){
		var JSONfile=JSON.parse(xhr.responseText);
		render(JSONfile,this.elementId,this.pageSize,p);
		Pagination.instances[0].maxNoOfItems=JSONfile.length;
		Pagination.instances[0].renderButtons();
	}.bind(this));

}