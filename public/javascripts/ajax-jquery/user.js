$('#followUser').on('submit', function(e){
	e.preventDefault();

	var actionUrl = $(this).attr('action');
	var $btn = $('.follow-user-btn');
	var $loader = $btn.find('.disp-loader');
	$loader.html(`
                <div class="loader button-loader loading-div">Loading..</div>
		`); 


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
			}else{
//seeing wether loader works
// var loader = this.loader;
// var btn = this.btn;

// 				setTimeout(function(){
// 					loader.html('');
					
// 					if(data === 'removed'){
// 						btn.html(`
// 							Follow
// 							<div class="disp-loader d-inline-block"></div>
// 							`);
// 					}else if(data === 'added'){
// 						btn.html(`
// 							Following
// 							<div class="disp-loader d-inline-block"></div>
// 							`);
// 					}
// 				}, 2000);

				this.loader.html('');					
				if(data === 'removed'){
					this.btn.html(`
						Follow
						<div class="disp-loader d-inline-block"></div>
						`);
				}else if(data === 'added'){
					this.btn.html(`
						Following
						<div class="disp-loader d-inline-block"></div>
						`);
				}


			}//cond end
		}//success end
	});

});

// THE SORTFOLLOWINGTOPICS XHR REQUEST
//no need to bind it to the parent
$('.sortFollowingTopics').on('submit', function(e){
	e.preventDefault();
	debugger;
	//input is used for finding the limit
	var inp = $(this).find('input');
	var limit = inp.val();
	var data = $(this).serialize();
	var actionUrl = $(this).attr('action');
	var $list = $('.followingTopics-list');
	var buttonVal = $(this).find('button').text();


	// THIS PART HANDLES THE LOADER
    var parentCont = $(this).closest('.parent-container');
    $mainCard = $(this).closest('.card-body');
    parentCont.append(`<div class="loader-2 loading-div d-none">Loading...</div>`);
    parentCont.css('position', 'relative');
    $loader2 = parentCont.find('.loader-2');
    debugger;
    if($loader2.hasClass('d-none')){
      $loader2.removeClass('d-none');
      $loader2.addClass('d-block');
    }
  
    $mainCard.css('opacity', '0.4');
    $loader2.css('opacity', '1');

	$.ajax({
		url:actionUrl,
		data:data,
		type:'POST',
		list:$list,
		limit: parseInt(limit),
		buttonVal: buttonVal,
		//loaderpart
		loader2: $loader2,
		mainCard: $mainCard,		
		sortFollowingTopicsA_Z:function(topicsArr){


				const sortArr = topicsArr.sort((a, b)=>{
					debugger;
					//convertinng them to lowercase so that **each word is evaluated on same basis**
					if(a.title.toLowerCase() < b.title.toLowerCase()){
						return -1;
					}else if(a.title.toLowerCase() > b.title.toLowerCase()){
						return 1;
					}
					return 0;
				});

				return sortArr;
		},
		sortFollowingTopicsRecentlyAdded:function(topicsArr){

				const sortedArr = topicsArr.sort((a, b)=>{
					//convertinng them to lowercase so that **each word is evaluated on same basis**
					// if the time of *first* is *larger means it was recently created*
					// reversing the equalitites
					if(a.time > b.time){
						return -1;
					}else if(a.time < b.time){
						return 1;
					}
					return 0;
				});

				return sortedArr;
		},
		createFollTopics:function(topic){
			return `
			<a href="/topics/${topic._id}/posts" class="dec-none actualFollowingTopics">
	          <div class="row leftsectMenu-nav" title="${topic.title}">
	          	${topic.logo[0] ? `<img src="/images/<%= topic.logo[0].url%>.jpg" alt="user1">` : `<img src="/images/backimg.jpg" alt="user1">`}
	            <div class="title">
	              ${topic.title}
	            </div>
	          </div>
	        </a>
			`;
		},
		success:function(data){

			if(data.err){
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

    				$('#exampleModalLabel-e-s').text(`${data.err}`);

			        console.log(data.err);
			        $('#error-success-dialog').modal({
			          backdrop: 'static',
			          keyboard: false,
			          focus: true
			        });

			}else{	

				//The 2 lines for the loader
				this.loader2.remove();
    			this.mainCard.css('opacity', '1');

				if(this.buttonVal === 'A - Z'){
					var sortedTopics = this.sortFollowingTopicsA_Z(data.followingTopics.actFollowingTopics);
				}else if(this.buttonVal === 'Creation Date'){
					debugger;
					var sortedTopics = this.sortFollowingTopicsRecentlyAdded(data.followingTopics.actFollowingTopics);
					
				}
//.slice(0,4)
					this.list.html(
						`
						${sortedTopics.slice(0,this.limit).map(this.createFollTopics).join("")}
						`);
			}
		}
	});
});

// THE SORTFOLLOWINGTOPICS XHR REQUEST
//see more following topics
$('.see-more-following-topics').on('submit', function(e){
	e.preventDefault();
	
	var limit = parseInt($('.sortFollowingTopics').find('input').val());

	limit += limit;
		
	// this *input* is used for knowing the 
	$('input[name="following_topic_limit"]').each(function(){
		// $(this) now points to the input[name="following_topic_limit"]
		$(this).val(limit);
	});
	var actionUrl = $(this).attr('action');
	var $list = $('.followingTopics-list');

// THIS PART HANDLES THE LOADER
  var parentCont = $(this).closest('.parent-container');
  $mainCard = $(this).closest('.card-body');
  parentCont.append(`<div class="loader-2 loading-div d-none">Loading...</div>`);
  parentCont.css('position', 'relative');
  $loader2 = parentCont.find('.loader-2');
  debugger;
  if($loader2.hasClass('d-none')){
    $loader2.removeClass('d-none');
    $loader2.addClass('d-block');
  }
  
  $mainCard.css('opacity', '0.4');
  $loader2.css('opacity', '1');

	$.ajax({
		url:actionUrl,
		type:'POST',
		list:$list,
		loader2: $loader2,
		mainCard: $mainCard,
		limit: parseInt(limit),
		createFollTopics:function(topic){
			return `
			<a href="/topics/${topic._id}/posts" class="dec-none actualFollowingTopics">
	          <div class="row leftsectMenu-nav" title="${topic.title}">
	          	${topic.logo[0] ? `<img src="/images/<%= topic.logo[0].url%>.jpg" alt="user1">` : `<img src="/images/backimg.jpg" alt="user1">`}
	            <div class="title">
	              ${topic.title}
	            </div>
	          </div>
	        </a>
			`;
		},
		success:function(data){

			if(data.err){
				
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

    				$('#exampleModalLabel-e-s').text(`${data.err}`);

			        console.log(data.err);
			        $('#error-success-dialog').modal({
			          backdrop: 'static',
			          keyboard: false,
			          focus: true
			        });

			}else{	
				//fixing back the loader and card
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

					this.list.html(
						`
						${data.followingTopics.actFollowingTopics.slice(0,this.limit).map(this.createFollTopics).join("")}
						`);

					//removing the see more button
					if(this.limit>= data.followingTopics.actFollowingTopics.length){
						$('.left-prof-sect-following-topics-see-more').remove();
					}
			}
		}
	});
});

// MANAGING THE 'MY TOPICS'

//no need to bind it to the parent
$('.sortMyTopics').on('submit', function(e){
	e.preventDefault();
	debugger;
	//input is used for finding the limit
	var inp = $(this).find('input');
	var limit = inp.val();
	var data = $(this).serialize();
	var actionUrl = $(this).attr('action');
	var $list = $('.myTopics-list');
	var buttonVal = $(this).find('button').text();


	// THIS PART HANDLES THE LOADER
    var parentCont = $(this).closest('.parent-container');
    $mainCard = $(this).closest('.card-body');
    parentCont.append(`<div class="loader-2 loading-div d-none">Loading...</div>`);
    parentCont.css('position', 'relative');
    $loader2 = parentCont.find('.loader-2');
    debugger;
    if($loader2.hasClass('d-none')){
      $loader2.removeClass('d-none');
      $loader2.addClass('d-block');
    }
  
    $mainCard.css('opacity', '0.4');
    $loader2.css('opacity', '1');

	$.ajax({
		url:actionUrl,
		data:data,
		type:'POST',
		list:$list,
		limit: parseInt(limit),
		buttonVal: buttonVal,
		//loaderpart
		loader2: $loader2,
		mainCard: $mainCard,		
		sortFollowingTopicsA_Z:function(topicsArr){


				const sortArr = topicsArr.sort((a, b)=>{
					debugger;
					//convertinng them to lowercase so that **each word is evaluated on same basis**
					if(a.title.toLowerCase() < b.title.toLowerCase()){
						return -1;
					}else if(a.title.toLowerCase() > b.title.toLowerCase()){
						return 1;
					}
					return 0;
				});

				return sortArr;
		},
		sortFollowingTopicsRecentlyAdded:function(topicsArr){

				const sortedArr = topicsArr.sort((a, b)=>{
					//convertinng them to lowercase so that **each word is evaluated on same basis**
					// if the time of *first* is *larger means it was recently created*
					// reversing the equalitites
					if(a.time > b.time){
						return -1;
					}else if(a.time < b.time){
						return 1;
					}
					return 0;
				});

				return sortedArr;
		},
		createFollTopics:function(topic){
			return `
			<a href="/topics/${topic._id}/posts" class="dec-none actualFollowingTopics">
	          <div class="row leftsectMenu-nav" title="${topic.title}">
	          	${topic.logo[0] ? `<img src="/images/<%= topic.logo[0].url%>.jpg" alt="user1">` : `<img src="/images/backimg.jpg" alt="user1">`}
	            <div class="title">
	              ${topic.title}
	            </div>
	          </div>
	        </a>
			`;
		},
		success:function(data){

			if(data.err){
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

    				$('#exampleModalLabel-e-s').text(`${data.err}`);

			        console.log(data.err);
			        $('#error-success-dialog').modal({
			          backdrop: 'static',
			          keyboard: false,
			          focus: true
			        });

			}else{	

				//The 2 lines for the loader
				this.loader2.remove();
    			this.mainCard.css('opacity', '1');

				if(this.buttonVal === 'A - Z'){
					var sortedTopics = this.sortFollowingTopicsA_Z(data.myTopics);
				}else if(this.buttonVal === 'Creation Date'){
					debugger;
					var sortedTopics = this.sortFollowingTopicsRecentlyAdded(data.myTopics);
					
				}
//.slice(0,4)
					this.list.html(
						`
						${sortedTopics.slice(0,this.limit).map(this.createFollTopics).join("")}
						`);
			}
		}
	});
});

// THE SORTFOLLOWINGTOPICS XHR REQUEST
//see more following topics
$('.see-more-my-topics').on('submit', function(e){
	e.preventDefault();
	
	var limit = parseInt($('.sortMyTopics').find('input').val());

	limit += limit;
		
	// this *input* is used for knowing the 
	$('input[name="my_topic_limit"]').each(function(){
		// $(this) now points to the input[name="following_topic_limit"]
		$(this).val(limit);
	});
	var actionUrl = $(this).attr('action');
	var $list = $('.myTopics-list');

// THIS PART HANDLES THE LOADER
  var parentCont = $(this).closest('.parent-container');
  $mainCard = $(this).closest('.card-body');
  parentCont.append(`<div class="loader-2 loading-div d-none">Loading...</div>`);
  parentCont.css('position', 'relative');
  $loader2 = parentCont.find('.loader-2');
  debugger;
  if($loader2.hasClass('d-none')){
    $loader2.removeClass('d-none');
    $loader2.addClass('d-block');
  }
  
  $mainCard.css('opacity', '0.4');
  $loader2.css('opacity', '1');

	$.ajax({
		url:actionUrl,
		type:'POST',
		list:$list,
		loader2: $loader2,
		mainCard: $mainCard,
		limit: parseInt(limit),
		createFollTopics:function(topic){
			debugger;
			return `
			<a href="/topics/${topic._id}/posts" class="dec-none actualMyTopics">
	          <div class="row leftsectMenu-nav" title="${topic.title}">
	          	${topic.logo[0] ? `<img src="/images/<%= topic.logo[0].url%>.jpg" alt="user1">` : `<img src="/images/backimg.jpg" alt="user1">`}
	            <div class="title">
	              ${topic.title}
	            </div>
	          </div>
	        </a>
			`;
		},
		success:function(data){

			if(data.err){
				
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

    				$('#exampleModalLabel-e-s').text(`${data.err}`);

			        console.log(data.err);
			        $('#error-success-dialog').modal({
			          backdrop: 'static',
			          keyboard: false,
			          focus: true
			        });

			}else{	
				debugger;
				//fixing back the loader and card
					this.loader2.remove();
    				this.mainCard.css('opacity', '1');

					this.list.html(
						`
						${data.myTopics.slice(0,this.limit).map(this.createFollTopics).join("")}
						`);

					//removing the see more button
					if(this.limit>= data.myTopics.length){
						$('.left-prof-sect-my-topics-see-more').remove();
					}
			}
		}
	});
});
