jQuery(document).ready(function($){
	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
	
	initHeadline();
	
	$('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function() {
		$('.contact-form form input[type="text"], .contact-form form textarea').removeClass('input-error');
	});
	$('.myForm').submit(function(e) {
		e.preventDefault();
	    var postdata = $('.myForm').serialize();
	    emailjs.send("gmail", "template_X6PYJgC6",
	    	{"email": $('#contact-email').val(),
	    	"subject": $('#contact-subject').val(),
	    	"message": $('#contact-message').val()});
        $('form').find('input[type=text]').val('');
        $('form').find('textarea').val('');
        setTimeout(function(){
            alert("Message Sent");
        },100)
	});

	function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
				letters = word.text().split(''),
				selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
		    var newLetters = letters.join('');
		    word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
					newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
					width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
				    if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
		
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
		 	setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
		 	setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
	}

	function takeNext($word) {
		return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
	}

	function takePrev($word) {
		return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
	}

	function switchWord($oldWord, $newWord) {
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}
});
$(function() {
    
    var $formLogin = $('#login-form');
    var $formLost = $('#lost-form');
    var $formRegister = $('#register-form');
    var $divForms = $('#div-forms');
    var $addform = $('new-market-form');
    var $modalAnimateTime = 300;
    var $msgAnimateTime = 150;
    var $msgShowTime = 2000;

    $("form").submit(function () {
        switch(this.id) {
            case "login-form":
                var $lg_username=$('#login_username').val();
                var $lg_password=$('#login_password').val();
                if ($lg_username == "ERROR") {
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "fa-times", "Error");
                }
                else {
                    //msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "fa-check", "Logged In");
                    $.ajax({
                        url: '/login',
                        type: 'POST',
                        data: JSON.stringify({ "lg_username": $lg_username,"lg_password": $lg_password}) ,
                        dataType: "json",
						contentType: "application/json",
                        success:function(res){
                         window.location.replace(window.location.protocol + "//" + window.location.host + res.redirect);

                    	},
                    	error:function(res){
                         
                    	}
                	});
                    
                }
                return false;
                break;
            case "lost-form":
                var $ls_email=$('#lost_email').val();
                if ($ls_email == "ERROR") {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "fa-times", "Error");
                }
                else if(!validateEmail($ls_email)){
                	msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "error", "fa-times", "Please check your email-id");
                } 
                else {
                    msgChange($('#div-lost-msg'), $('#icon-lost-msg'), $('#text-lost-msg'), "success", "fa-check", "Password reset email sent");
                }
                return false;
                break;
             case "new-market-form":
                var $title=$('#new-market-title').val();
                var $desc=$('#new-market-desc').val();
                var $phone=$('#new-market-phone').val();
                var $email=$('#new-market-email').val();
                var $price=$('#new-market-price').val();
                var $owner=$('#new-market-owner').val();
                if ($title == "ERROR") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "fa-times", "Error");
                }
                else {
                    //var files = document.getElementById("image-upload").files;
                    //console.log(files);  
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "fa-check", "ADDED");
                    // setTimeout(function () {
                    //  console.log("bla")
                    //  $('new-market-modal').modal('toggle');
                    // },100);
                    $.ajax({
                        url: '/market-add',
                        type: 'GET',
                        data: { newmarkettitle: $title, newmarketdesc: $desc, newmarketphone: $phone, newmarketemail: $email, newmarketowner: $owner, newmarketprice: $price} ,
                        contentType: 'application/json; charset=utf-8',
                        success:function(res){
                         window.location.replace(window.location.protocol + "//" + window.location.host + res.redirect);
                        },
                        error:function(res){
                        
                        }
                    });
                }

                return false;
                break;    
                case "new-bnb-form":
             	var $title=$('#new-bnb-title').val();
                var $desc=$('#new-bnb-desc').val();
                var $phone=$('#new-bnb-phone').val();
                var $email=$('#new-bnb-email').val();
                //var $photo=$('#new-bnb-photo').val();
                var $owner=$('#new-bnb-owner').val();
                if ($title == "ERROR") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "fa-times", "Error");
                }
                else {
    				// var files = document.getElementById("image-upload").files;
    				// console.log(files[0].name);  
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "fa-check", "ADDED");
                    // setTimeout(function () {
                    // 	console.log("bla")
                    // 	$('new-bnb-modal').modal('toggle');
                    // },100);
                    $.ajax({
                        url: '/bnb-add',
                        type: 'GET',
						data: { newbbtitle: $title, newbbdesc: $desc, newbbphone: $phone, newbbemail: $email, newbbowner: $owner} ,
        				contentType: 'application/json; charset=utf-8',
                        success:function(res){
                         window.location.replace(window.location.protocol + "//" + window.location.host + res.redirect);
                    	},
                    	error:function(res){
                        
                    	}
                	});
                }

                return false;
                break;    
				case "new-promotions-form":
             	var $title=$('#new-promotions-title').val();
                var $desc=$('#new-promotions-desc').val();
                var $phone=$('#new-promotions-phone').val();
                var $email=$('#new-promotions-email').val();
                //var $photo=$('#new-promotions-photo').val();
                var $owner=$('#new-promotions-owner').val();
                if ($title == "ERROR") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "fa-times", "Error");
                }
                else {
    				// var files = document.getElementById("image-upload").files;
    				// console.log(files[0].name);  
                    msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "success", "fa-check", "ADDED");
                    // setTimeout(function () {
                    // 	console.log("bla")
                    // 	$('new-promotions-modal').modal('toggle');
                    // },100);
                    $.ajax({
                        url: '/promotions-add',
                        type: 'GET',
						data: { newpromotionstitle: $title, newpromotionsdesc: $desc, newpromotionsphone: $phone, newpromotionsemail: $email, newpromotionsowner: $owner} ,
        				contentType: 'application/json; charset=utf-8',
                        success:function(res){
                         window.location.replace(window.location.protocol + "//" + window.location.host + res.redirect);
                    	},
                    	error:function(res){
                        
                    	}
                	});
                }

                return false;
                break;                    
            case "register-form":
                var $rg_username=$('#register_username').val();
                var $rg_email=$('#register_email').val();
                var $rg_password=$('#register_password').val();
                if ($rg_username == "ERROR") {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "fa-times", "Error");
                }
                else if(!validateEmail($rg_email)){
                	msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "fa-times", "Please check your email-id");
                }
                else {
                    msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "success", "fa-check", "Registration Successful");
					$.ajax({
						url: 'register',
						type: 'GET',
						data: { rg_username: $rg_username, rg_email: $rg_email, rg_password: $rg_password} ,
        				contentType: 'application/json; charset=utf-8', 
						success:function(res){
        				alert("Registered");
    				},  error:function(res){
    					
    				}});
                }
                return false;
                break;
            default:
                return false;
        }
        return false;
    });
    
    $('#login_register_btn').click( function () { modalAnimate($formLogin, $formRegister) });
    $('#register_login_btn').click( function () { modalAnimate($formRegister, $formLogin); });
    $('#login_lost_btn').click( function () { modalAnimate($formLogin, $formLost); });
    $('#lost_login_btn').click( function () { modalAnimate($formLost, $formLogin); });
    $('#lost_register_btn').click( function () { modalAnimate($formLost, $formRegister); });
    $('#register_lost_btn').click( function () { modalAnimate($formRegister, $formLost); });
   
    
    function modalAnimate ($oldForm, $newForm) {
        var $oldH = $oldForm.height();
        var $newH = $newForm.height();
        $divForms.css("height",$oldH);
        $oldForm.fadeToggle($modalAnimateTime, function(){
            $divForms.animate({height: $newH}, $modalAnimateTime, function(){
                $newForm.fadeToggle($modalAnimateTime);
            });
        });
    }
    
    function msgFade ($msgId, $msgText) {
        $msgId.fadeOut($msgAnimateTime, function() {
            $(this).text($msgText).fadeIn($msgAnimateTime);
        });
    }
    
    function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
        var $msgOld = $divTag.text();
        msgFade($textTag, $msgText);
        $divTag.addClass($divClass);
        $iconTag.removeClass("fa-arrow-right");
        $iconTag.addClass($iconClass + " " + $divClass);
        setTimeout(function() {
            msgFade($textTag, $msgOld);
            $divTag.removeClass($divClass);
            $iconTag.addClass("fa-arrow-right");
            $iconTag.removeClass($iconClass + " " + $divClass);
  		}, $msgShowTime);
    }
    function validateEmail(email) {
    	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}
});