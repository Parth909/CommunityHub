// $("#create-topic").submit(function(e){
//     e.preventDefault();
//     var actionUrl = $(this).attr('action');
//     var parent = $(this).closest('.parent-container');
//     var coverImgSrc = parent.find('#pr-cover-img').attr('src');


//     var fd = new FormData();
// 	var file_data = $('input[type="file"]')[0].files;

// 	    fd.append("topicImage", file_data[0]);

//     var other_data = $(this).serializeArray();


// 	$.each(other_data,function(key,input){
// 		if(input.name === 'topic[coverImage]'){
// 			input.value = coverImgSrc;

// 			fd.append(input.name,input.value);
// 		}else if(input.name === 'topic[category]'){
// 			var optVal = $('select#category').children("option:selected").text();

// 			input.value = optVal;
// 			fd.append(input.name,input.value);
// 		}
// 		else if(input.name === 'tags'){

// 			debugger;
// 				var tags = [];

// 				$.each($("#tags option:selected"), function(){            
// 	            	tags.push($(this).text());
// 	        	});

// 	        	input.value = tags;
// 			debugger;
// 			fd.append(input.name,input.value);
			
// 		}
// 		else{
// 	    	fd.append(input.name,input.value);			
// 		}

// 	});

// 	$.ajax({
// 	    url: actionUrl,
// 	    data: fd,
// 	    contentType: false,
// 	    processData: false,
// 	    type: 'POST',
// 	    success: function(res){
// 	    	if(res.redirect){
// 	    		window.location = res.redirect;
// 	    	}
// 	    },
// 	    error: function(err){
// 	    	console.log(err);
// 	    }
// 	});
		
// });





$("#create-topic").submit(function(e){
    e.preventDefault();
    var actionUrl = $(this).attr('action');
    var parent = $(this).closest('.parent-container');
    var coverImgSrc = parent.find('#pr-cover-img').attr('src');


    var fd = new FormData();
	var file_data = $('input[type="file"]')[0].files; //for multiple files

	// for(var i = 0;i<file_data.length;i++){
	//     fd.append("file_"+i, file_data[i]);
	// }

	    fd.append("topicImage", file_data[0]);//only one image for now
	    //name="topicImage" in the required input[type="file"] field 
	    //that same name is used in the route while uploading 

    var other_data = $(this).serializeArray();


	$.each(other_data,function(key,input){
		if(input.name === 'topic[coverImage]'){
			input.value = coverImgSrc;

			fd.append(input.name,input.value);
		}else if(input.name === 'topic[category]'){
			var optVal = $('select#hub').children("option:selected").val();

			input.value = optVal;
			fd.append(input.name,input.value);
		}
		else if(input.name === 'tags'){

				var tags = [];

				// $.each($("#tags option:selected"), function(){            
	   //          	tags.push($(this).text());
	   //      	});

	   //      	input.value = tags;

		    var value = $('#tags').val();
	      	var val = value.split(',');

	      	val.forEach(function(val){
		    	tags.push(val);
	      	});

			fd.append(input.name, tags);

debugger;
			
		}
		else{
	    	fd.append(input.name,input.value);			
		}

	});

	$.ajax({
	    url: actionUrl,
	    data: fd,
	    contentType: false,
	    processData: false,
	    type: 'POST',
	    success: function(res){
	    	if(res.redirect){
	    		window.location = res.redirect;
	    	}
	    },
	    error: function(err){
	    	console.log(err);
	    }
	});
		
});


$('#fol-topic-form').on('click', function(e){
	e.preventDefault();
	var actionUrl = $(this).attr('action');

	var $btn = $('.follow-topic-btn');
	var $loader = $btn.find('.disp-loader');
	$loader.html(`
                <div class="loader following-loader loading-div">Loading..</div>
		`); 
	debugger;
	$.ajax({
		url:actionUrl,
		btn:$btn,
		loader:$loader,
		contentType:false,
    	processData: false,
		type:'POST',
		success:function(data){
			if(data.err){

				this.loader.html('');
				$('#exampleModalLabel-e-s').text(`${data.err}`);

			      console.log(data.err);
			      $('#error-success-dialog').modal({
			        backdrop: 'static',
			        keyboard: false,
			        focus: true
			      });

			}else{

				this.loader.html('');
					
				if(data === 'removed'){
					this.btn.html(`
						<i class="fas fa-lg fa-check-square"></i> Follow Topic
						<div class="disp-loader d-inline-block"></div>
						`);
				}else if(data === 'added'){
					this.btn.html(`
						<i class="fas fa-lg fa-check-square"></i> Following
						<div class="disp-loader d-inline-block"></div>
						`);
				}

			}
		}
	});

});	

// $(".left-hubs-navs").on('click', function(e){
// 	debugger;
// 	var fd = new FormData();
// 	var hub = $(this).attr('name');
// 	debugger;
// 	var hub_title = 'hub_title';
// 	fd.append(hub_title, hub);

// 	$.ajax({
// 	    url: '/topics',
// 	    data: fd,
// 	    contentType: false,
// 	    processData: false,
// 	    type: 'GET',
// 	    success: function(res){
// 	    	if(res.redirect){
// 	    		window.location = res.redirect;
// 	    	}

// 	    	$('.left-hubs-navs').each(function(){
// 	    		if(!$(this).hasClass('hub-active')){
// 			   		$(this).removeClass('hub-active');
// 	    		}
// 	    	});


// 			if(!$(this).hasClass('hub-active')){
// 			   $(this).addClass('hub-active');
// 			}
// 	    },
// 	    error: function(err){
// 	    	console.log(err);
// 	    }
// 	});
// });