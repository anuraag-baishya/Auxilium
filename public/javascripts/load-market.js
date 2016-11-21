jQuery(document).ready(function($){

	var title = [], desc = [],price = [],phone = [],owner = [], str='';
	$.getJSON("data/MARKET.json")
		.success(function(res){
			for(var i = res.length-1; i >= 0; i--){
				title[i] = res[i].title;
				desc[i] = res[i].desc;
				owner[i] = res[i].owner;
				phone[i] = res[i].phone;
				price[i] = res[i].photo;
				str += '<div class="media main-list wow animated slideInLeft" data-wow-delay=".1s">' +
							'<div class="media-left">' +
				 				'<a href="#">' +
                    				'<img class="media-object" src="http://placehold.it/150x150" alt="">' +
                				'</a>' +
            				'</div>' +
            				'<div class="media-body">' + 
                			'<h4 class="media-heading">'+ title[i] +'</h4>' +
                			'<p>'+desc[i]+'</p>' + '<p>'+owner[i]+'</p>' + '<p>'+price[i]+'</p>' + '<p>'+phone[i]+'</p></div></div>'
			}
			$('#market-main-section').append(str)
	})
});
