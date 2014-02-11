function ClientController() {
    this.socket = {};
}

ClientController.prototype.initialize = function(){
    this.socket = io.connect('http://192.168.0.12:1337');
    
    this.socket.on('broadcastNewUser', function(user){
	View.appendUser(user);
    });
    this.socket.on('broadcastEndOfGame', function(id){
	View.endOfGame(id);
    });
    this.socket.on('disconnectUser', function(user){
	View.deleteUser(user);
    });
    this.socket.on('clientRun', function(info){
	View.moveUser(info);
    });
    this.socket.on('clientJump', function(info){
	View.jumpUser(info);
    });
    this.socket.on('clientAssemble', function(ids){
	View.assembleUser(ids);
    });
    this.socket.on('clientFusionPossible', function(ids){
	View.fusionPossible(ids);
    });
    this.socket.on('clientFusionNotPossible', function(ids){
	View.fusionNotPossible(ids);
    });
    this.socket.on('clientFusionTimeout', function(info){
	View.clientTimeout(info);
    });
    this.socket.on('clientFusionTimeoutEnd', function(info){
	View.endFusion(info);
    });
};

ClientController.prototype.mobileNewUser = function(){
    this.socket.emit('mobileConnection');
};

ClientController.prototype.mobileRun = function(id){
    this.socket.emit('mobileRun', {id1: id});
};

ClientController.prototype.mobileJump = function(id){
    this.socket.emit('mobileJump', {id1: id});
};

ClientController.prototype.mobileAssemble = function(id){
    this.socket.emit('mobileAssemble', {id1: id});
};