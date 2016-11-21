jQuery(document).ready(function($){

	var title = [], desc = [],email = [],phone = [],owner = [], str='';
	$.getJSON("data/bnb.json")
		.success(function(res){
			for(var i = 0; i < res.length; i++){
				title[i] = res[i].title;
				desc[i] = res[i].desc;
				owner[i] = res[i].owner;
				phone[i] = res[i].phone;
				email[i] = res[i].email;
				str += '<div class="media main-list wow animated slideInLeft" data-wow-delay=".1s">' +
							'<div class="media-left">' +
				 				'<a href="#">' +
                    				'<img class="media-object" src="http://placehold.it/150x150" alt="">' +
                				'</a>' +
            				'</div>' +
            				'<div class="media-body">' + 
                			'<h4 class="media-heading">'+ title[i] +'</h4>' +
                			'<p>'+desc[i]+'</p>' + '<p>'+owner[i]+'</p>' + '<p>'+phone[i]+'</p>' + '<p>'+email[i]+'</p></div></div>'
			}
			$('#bnb-main-section').append(str)
	})
});
