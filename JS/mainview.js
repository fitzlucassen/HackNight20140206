function MainView() {
    this.inJump = false
}


MainView.prototype.appendUser = function(user){
    if($('#game').length){
	if($('#user-' + user.id).length == 0){
	    $('#game').append('<div class="user" style="top:' + user.top + 'px;" id="user-' + user.id + '" data-val="' + user.id + '"></div>');
	}
    }
    else {
	if(!$('#run').attr('data-val')){
	    $('#run').attr('data-val', user.id);
	    $('#jump').attr('data-val', user.id);
	    $('#assemble').attr('data-val', user.id);
	    $('header h1').append('<span style="font-style:underline;">&nbsp;' + user.id + '</span>');
	}
    }
};
MainView.prototype.deleteUser = function(user){
    $('#user-' + user.id).remove();
};


MainView.prototype.moveUser = function(info){
    if($('#game').length){
	$('#user-' + info.id).css({left: info.left + 'px'});
    }
};
MainView.prototype.jumpUser = function(info){
    if($('#game').length){
	var $this = this;
	if(!$this.inJump){
	    $this.inJump = true;
	    $('#user-' + info.id).animate({
		top: ($('#user-' + info.id).position().top - 20) + 'px',
		left: (info.left - (info.jumpLeft / 2)) + 'px'
	    }, 200, function(){
		$('#user-' + info.id).animate({
		    top: ($('#user-' + info.id).position().top + 20) + 'px',
		    left: (info.left - (info.jumpLeft)) + 'px'
		},200, function(){
		    $this.inJump = false;
		});
	    });
	}
    }
};
MainView.prototype.assembleUser = function(ids){
    if($('#game').length){
	if($('#user-' + ids.id1).length || $('#user-' + ids.id2).length){
	    $('#user-' + ids.id1).css({'opacity':'0.6'});
	    $('#user-' + ids.id2).css({'opacity':'0.6'});
	}
    }
    else {
	if($('#run').attr('data-val') == ids.id1 || $('#run').attr('data-val') == ids.id2){
	    $('#jump').css({'background-color':'#aaaaFF'});
	    $('#assemble').css({'background-color':'#bbb'});
	}
    }
};

MainView.prototype.fusionPossible = function(ids){
    if(!$('#game').length && ($('#run').attr('data-val') == ids.id1 || $('#run').attr('data-val') == ids.id2)){
	$('#assemble').css({'background-color':'#aaaaFF'});
    }
};
MainView.prototype.fusionNotPossible = function(ids){
    if(!$('#game').length && ($('#run').attr('data-val') == ids.id1 || $('#run').attr('data-val') == ids.id2)){
	$('#assemble').css({'background-color':'#bbb'});
    }
};

MainView.prototype.clientTimeout = function(info){
    if(!$('#game').length){
	if($('#run').attr('data-val') == info.id1 || $('#run').attr('data-val') == info.id2){
	    $('.replaceText').html(info.compteur);
	}
    }
};
MainView.prototype.endFusion = function(info){
    if(!$('#game').length){
	if($('#run').attr('data-val') == info.id1 || $('#run').attr('data-val') == info.id2){
	    $('.replaceText').html('FUSION');
	    $('#jump, #assemble').css({'background-color':'#bbb'});
	}
    }
    else {
	$('#user-' + info.id1).css({'opacity':'1'});
	$('#user-' + info.id2).css({'opacity':'1'});
    }
};

MainView.prototype.endOfGame = function(id){
    if($('#game').length){
	alert('Le joueur ' + id + ' a gagné !');
    }
    else {
	$('.action').css({'background-color':'#bbb'});
    }
};