jQuery(document).ready(function($){

	var result, names = [], locations = [], rating = [], photos = [] ,str='';
	var photo_url = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&maxheight=150&photoreference="
	var api_key = ""
	var json = $.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=13.3605,74.7864&radius=500&type=food&key=")
				.success(function(res) {
					result = res.results;
					for(var i = 0; i < result.length; i++){
						if(result[i].hasOwnProperty('photos')){
							console.log(result[i])
						names[i] = result[i].name;
						locations[i] = result[i].vicinity;
						rating[i] = result[i].rating;
						photos[i] = result[i].photos[0].photo_reference;
						str += '<div class="media main-list wow animated slideInLeft" data-wow-delay=".1s">' +
							'<div class="media-left">' +
				 				'<a href="#">' +
                    				'<img class="media-object" src="'+photo_url+photos[i]+'&key='+api_key+'" alt="">' +
                				'</a>' +
            				'</div>' +
            				'<div class="media-body">' + 
                			'<h4 class="media-heading">'+ names[i] +'</h4>' +
                			'<p><br><strong>Address: </strong>'+ locations[i] + '<br><strong>Rating: </strong>' + rating[i] +'</p></div></div>'
						//console.log(photos[i]);
					}
					}
					$('#places-main-section').append(str);
				})
});