var View = {};
var ErrorGame = {};
var Client = {};

$(document).ready(function () {
    // Initialisation des controllers
    View = new MainView();
    ErrorGame = new ErrorView();
    Client = new ClientController();
    
    Client.initialize();
    Client.mobileNewUser();
    
    $('#run').click(function(){
	if($(this).css('background-color') !== 'rgb(187, 187, 187)'){
	    Client.mobileRun($(this).attr('data-val'));
	}
    });
    $('#jump').click(function(){
	if($(this).css('background-color') !== 'rgb(187, 187, 187)'){
	    Client.mobileJump($(this).attr('data-val'));
	}
    });
    $('#assemble').click(function(){
	if($(this).css('background-color') !== 'rgb(187, 187, 187)'){
	    Client.mobileAssemble($(this).attr('data-val'));
	}
    });
});