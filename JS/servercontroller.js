var http = require('http');
var httpServer = http.createServer(function(req,res){
    console.log('un utilisateur a affiche la page');
});
httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = [];
var nbJoueur = 0;
var gameObject = {
    herbe: {
	start: 485,
	end: 735
    },
    run: 10,
    fusionPossible: 50,
    endGameLeft: 1550
};
var fusionPossible = [];
 
io.sockets.on('connection', function(socket){
    console.log('Nouvel utilisateur');
    var me = false;

    socket.on('mobileConnection', function(){
	me = {
	    id: (++nbJoueur),
	    left: 120,
	    top: (nbJoueur * 45),
	    inFusion: false
	};
	users[me.id] = me;

	io.sockets.emit('broadcastNewUser', me);
	   
	console.log('Le visiteur ' + me.id + ' s\'est connecté via mobile');
    });
    
    socket.on('mobileRun', function(){
	me.left += calculRun(me);
		
	io.sockets.emit('clientRun', {id: me.id, left: me.left});
	isGameFinished(me);
	isFusionPossible(me);
    });
    socket.on('mobileJump', function(){
	me.left += calculJump(me);
	
	io.sockets.emit('clientJump', {id: me.id, left: me.left, jumpLeft: (me.left >= gameObject.herbe.start && me.left <= gameObject.herbe.end) ? gameObject * 3 : gameObject * 6});
	isGameFinished(me);
	isFusionPossible(me);
    });
    socket.on('mobileAssemble', function(){
	me.inFusion = true;
	
	var ids = {
	    id1: -1,
	    id2: -1
	}
	ids.id1 = me.id;
	if(users[fusionPossible[me.id]]){
	    users[fusionPossible[me.id]].inFusion = true;
	    ids.id2 = users[fusionPossible[me.id]].id;
	}
	else{
	    users[getKey(me.id)].inFusion = true;
	    ids.id2 = users[getKey(me.id)].id;
	}
		
	io.sockets.emit('clientAssemble', ids);
	
	var cpt = 10;
	
	setTimeout(function(){
	    clearInterval(interval);
	    io.sockets.emit('clientFusionTimeoutEnd', ids);
	    endFusion(ids);
	    delete fusionPossible[ids.id1];
	    delete fusionPossible[ids.id2];
	    fusionPossible.splice(me.id, 1);
	},10500);
	var interval = setInterval(function(){
	    io.sockets.emit('clientFusionTimeout', {id1: ids.id1, id2: ids.id2, compteur: (--cpt)});
	}, 1000);
    });

    socket.on('disconnect', function(){
	if(!me)
	    return false;
	
	delete users[me.id];
	users.splice(me.id, 1);
	io.sockets.emit('disconnectUser', me);
    });
});

function calculRun(me){
    var retour = false;
    if(me.left >= gameObject.herbe.start && me.left <= gameObject.herbe.end){
	retour = (gameObject.run / 2);
    }
    else {
	retour = gameObject.run;
    }
    return retour;
}
function calculJump(me){
    var retour = false;
    if(me.left >= gameObject.herbe.start && me.left <= gameObject.herbe.end){
	retour = gameObject.run * 3;
    }
    else {
	retour = gameObject.run * 6;
    }
    return retour;
}
function isFusionPossible(me){
    for(var u in users){
	if(me.id == users[u].id){
	    continue;
	}
	else {
	    var d = Math.abs(users[u].left - me.left);
	    debugArray(fusionPossible);

	    if(d >= 0 && d <= gameObject.fusionPossible && !me.inFusion && !idInArray(fusionPossible, me.id) && !idInArray(fusionPossible, users[u].id)){
		fusionPossible[me.id] = users[u].id;
		io.sockets.emit('clientFusionPossible', {id1: me.id, id2: users[u].id});
	    }
	    else if((d < 0 || d > gameObject.fusionPossible) && !me.inFusion && idInArray(fusionPossible, me.id) && idInArray(fusionPossible, users[u].id)){
		io.sockets.emit('clientFusionNotPossible', {id1: me.id, id2: users[u].id});
		delete fusionPossible[me.id];
		delete fusionPossible[fusionPossible[me.id]];
		fusionPossible.splice(me.id, 1);
	    }
	}
    }
}
function endFusion(ids){
    if(users[ids.id1].inFusion)
	users[ids.id1].inFusion = false;
    else
	users[getKey(ids.id1)].inFusion = false;
    
    if(users[ids.id2].inFusion)
	users[ids.id2].inFusion = false;
    else
	users[getKey(ids.id2)].inFusion = false;
}
function isGameFinished(user){
    if(user.left >= gameObject.endGameLeft){
	io.sockets.emit('broadcastEndOfGame', user.id);
    }
}
function idInArray(array, id){
    for(var a in array){
	if(array[a] == id || a == id)
	    return true;
    }
    return false;
}
function debugArray(array){
    for(var a in array){
	console.log(a + ' -> ' + array[a]);
    }
}
function getKey(id){
    for(var a in fusionPossible){
	if(fusionPossible[a] == id || a == id)
	    return a;
    }
}