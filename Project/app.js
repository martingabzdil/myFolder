//APPLICATION

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
		this.maxNoOfItems=JSONfile.length;
		render(JSONfile,this.elementId,this.pageSize,p);
		Pagination.instances[0].renderButtons();
		Pagination.instances[0].maxNoOfItems=JSONfile.length;
	}.bind(this));

}
