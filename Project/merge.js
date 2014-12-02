var MyApp = new App('http://academy.tutoky.com/api/json.php','main-content','10');
var MyPag = new Pagination('http://academy.tutoky.com/api/json.php','nav','10');

MyApp.renderArticles(0);
MyPag.renderButtons();