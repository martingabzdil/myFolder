var MyApp = new App('http://academy.tutoky.com/api/json.php','main-content','15');
var MyPag = new Pagination('nav','15');

MyApp.renderArticles(0);
MyPag.renderButtons();