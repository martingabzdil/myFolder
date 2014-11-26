var maxNoOfItems;
function Pagination (url, idRender, pageSize,idButtons){
	this.url=url;
	this.idRender=idRender;
	this.idButtons=idButtons;
	this.pageSize=pageSize;
	this.currentPage=0;
	this.noOfItems=0;
	this.maxNoOfItems=0;
	this.goNext = this.goNext.bind(this);
	this.goBack = this.goBack.bind(this);
	// this.renderArticles = this.renderArticles.bind(this);
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
	idRender=this.idRender;
	pageSize=this.pageSize;
	var page=p;
	
	function setMax(file){
		return file.length;
	}

	function render(JSONf,idR,pageS,p){
		maxNoOfItems=JSONf.length;
		if (p*pageS+(pageSize*1)>JSONf.length){
        this.noOfItems=JSONf.length;
   		} else {
        this.noOfItems=(p*pageS)+(pageS*1);
    	}


    	for (var i=(pageSize*p);i<this.noOfItems;i++){

		var extImageNo=0|JSONf[i].image;
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
    	var titleText=document.createTextNode(JSONf[i].title);
    	title.className="videoTitle truncate";
    	title.appendChild(titleText);
    	textBlock.appendChild(title);
    	var timestamp = document.createElement("time");
    	timestamp.className="date";
    	timestamp.id="timestamp";
    	var timestampData=document.createTextNode(JSONf[i].timestamp);
    	timestamp.appendChild(timestampData);
    	textBlock.appendChild(timestamp);
   
    	var content = document.getElementById(idRender);
    	content.appendChild(article);
			
		}

	}
	// console.log(this);
	// console.log(this.maxNoOfItems);
	

	this.loadJSON(this.url,function (xhr){
		var JSONfile=JSON.parse(xhr.responseText);
		// console.log(this);
		maxNoOfItems=JSONfile.length;
		// console.log(this.maxNoOfItems);
		render(JSONfile,idRender,pageSize,page);
		

	});
	
	// console.log(this.maxNoOfItems);
	console.log(maxNoOfItems);

}

Pagination.prototype.renderButtons=function (){
	// console.log(maxNoOfItems);

	var prevBtn = document.createElement("div");
	prevBtn.id="prevbtn";
	var prevBtnTxt=document.createTextNode("PREVIOUS");
	prevBtn.appendChild(prevBtnTxt);
	var pageBtns = document.createElement("div");
	pageBtns.id="pgbtn";
	for (var i=0;i<8;i++){
		// for (var i=0;i<Math.floor(this.maxNoOfItems/pageSize);i++){
		// console.log("tried to create somee buttons");
		//add inbound buttons
		var buttonBlock=document.createElement("div");
		buttonBlock.className="navitems";
		var buttonNum=document.createTextNode(i+1);
		buttonBlock.appendChild(buttonNum);
		pageBtns.appendChild(buttonBlock);
	}

	var nextBtn = document.createElement("div");
	nextBtn.id="nextbtn";
	var nextBtnTxt=document.createTextNode("NEXT");
	nextBtn.appendChild(nextBtnTxt);
	
	nextBtn.addEventListener("click",this.goNext);
	prevBtn.addEventListener("click",this.goBack);

	var navigationBar=document.getElementsByTagName(this.idButtons)[0];
	navigationBar.appendChild(prevBtn);
	navigationBar.appendChild(pageBtns);
	navigationBar.appendChild(nextBtn);

}

Pagination.prototype.goNext=function(){

	if(maxNoOfItems%pageSize===0){

		if (this.currentPage<(Math.floor(maxNoOfItems/pageSize))-1){
			document.getElementById("main-content").innerHTML="";
			this.renderArticles(this.currentPage+=1);
		}
	}else {
		if (this.currentPage<(Math.floor(maxNoOfItems/pageSize))){
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


var MyPag = new Pagination('http://academy.tutoky.com/api/json.php','main-content','15','nav');
MyPag.renderArticles(0);
MyPag.renderButtons();

// document.getElementById("nextbtn").addEventListener("click",this.goNext);
// document.getElementById("prevbtn").addEventListener("click",MyPag.goBack);