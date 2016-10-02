jQuery(document).ready(function($){
	var str = '';

	for(var i = 0; i < 10; i++){
		str += '<div class="media main-list wow animated slideInLeft" data-wow-delay=".1s">' +
			'<div class="media-left">' +
				 '<a href="#">' +
                    '<img class="media-object" src="http://placehold.it/150x150" alt="">' +
                '</a>' +
            '</div>' +
            '<div class="media-body">' + 
                '<h4 class="media-heading">Media heading</h4>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis,<br>possimus commodi, fugiat magnam temporibus vero magni recusandae? Dolore, maxime praesentium.</p></div></div>'
	}
	$('#market-main-section').append(str);
});