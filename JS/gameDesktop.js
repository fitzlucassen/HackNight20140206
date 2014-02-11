var View = {};
var ErrorGame = {};
var Client = {};

$(document).ready(function () {
    // Initialisation des controllers
    View = new MainView();
    ErrorGame = new ErrorView();
    Client = new ClientController();
    
    Client.initialize();
});