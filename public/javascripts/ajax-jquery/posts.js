//Likes
//**Ajax updates the db permanently but updates the view for live session
//**Always remember HTML inside a particular element is updated

$('.new-post-creation-form').on('submit', function(e){
  e.preventDefault();

  $videoDiv =$('.video-selected-div');
  var loader = $(this).find('.loading-div');
  $form = $(this);//used for clearing the preview images
  var actionUrl = $(this).attr('action');
  var parent = $(this).closest('.new-post-creation-container');
  $postsList = parent.siblings('.topic-own-posts-list');

  //doing things
  if(loader.hasClass('d-none')){
    loader.removeClass('d-none');
    loader.addClass('d-block');
  }

  var postDesc = $(this).find('.fordynpostbody');
  postDesc.css('height', '48px');

  var fd = new FormData();

// BCZ WE ARE USING DYNAMIC ELEMENTS NEED TO CHECK IF EXISTS
if($('#post-create-images')[0]){

  // COPYING the 'filelist' array bcz it is immutable can't be modified
  var filesArr = Array.from($("#post-create-images")[0].files); 
debugger;

  for(var i = 0; i<filesArr.length; i++){
    var fileName = filesArr[i].name;
    $('.pr-image-wrapper').each(function(){
    //supportive element for deletion
      var imgName = $(this).find('p').text();
      if((fileName === imgName) && ($(this).hasClass('marked-for-delete'))){
          filesArr.splice(i, 1);  
      }
    });    
  }//don't forget upload.array('postImages', 4) helper in the route
  for(var i = 0; i < filesArr.length; i++){
    debugger;
      fd.append("postImages", filesArr[i]);
  }

}



if($('#post-create-video')[0]){
  var videoFile = Array.from($('#post-create-video')[0].files); 

  for(var i=0; i < videoFile.length; i++){
    debugger;
    fd.append('postVideo', videoFile[i]);
  }

// fd.append('postVideo', $('#post-create-video')[0].files[0]);
}


  var other_data = $(this).serializeArray();

  $.each(other_data,function(key,input){
    fd.append(input.name,input.value);
  });

debugger;
  /* how formdata looks
  {
    postImages:[image1, image2, image3, image4],
    post[mood]: someValue,
    post[title]: someValue,
    post[description]: someValue,
  } 
  
   */

  $.ajax({
    url:actionUrl,
    data:fd,
    contentType:false,
    processData: false,
    form:$form,
    videoDiv:$videoDiv,
    type: 'POST',
    success:function(data){

      if(data.err){
        
        $('#exampleModalLabel-e-s').text(`${data.err}`);

        console.log(data.err);
        $('#error-success-dialog').modal({
          backdrop: 'static',
          keyboard: false,
          focus: true
        });

      }else{

        this.videoDiv.html('');
        this.form.find('.fordynpostmood').val('');
        this.form.find('.fordynpost').val('');
        this.form.find('.fordynpostbody').val('');
        var updateCnt = this.form.find('.change-cnt')
        $('.pr-image-wrapper').each(function(){
          $(this).remove();
        });
        updateCnt.css('stroke-width', '1.5');
        updateCnt.css('stroke', '#2d2d2d'); 

        //At last
        if(loader.hasClass('d-block')){
          loader.removeClass('d-block');
          loader.addClass('d-none');
        }

      }

    }//success-end

  });

});

$('.div-content').on('submit', '.ed-po-form', function(e){
  e.preventDefault();

  var actionUrl = $(this).attr('action');
  var data = $(this).serialize();
  var parent = $(this).closest('.parent-container');
  $textDiv = parent.find('.post-text-div');
  $postEditForm = parent.find('.toggle-post-edit-form');

  $.ajax({
    url:actionUrl,
    data:data,
    type: 'PUT',
    textDiv: $textDiv,
    postEditForm: $postEditForm,
    success:function(data){

    if(data.err){

      $('#exampleModalLabel-e-s').text(`${data.err}`);

      console.log(data.err);
      $('#error-success-dialog').modal({
        backdrop: 'static',
        keyboard: false,
        focus: true
      });


    }else{

      if(this.postEditForm.hasClass('d-block')){
        this.postEditForm.addClass('d-none');
        this.postEditForm.removeClass('d-block');
        this.textDiv.removeClass('d-none');    
      }
      this.textDiv.html(
        `
                <div class="mb-1"></div>
        <h5 class="text-white title py-0 px-1_5">${data.title}</h5>

        <!-- READ MORE LESS FUNCTIONLITY(Remember in the post word "comment" is used for toggling) -->
        <div class="bg-custom-black comment more mt-0 pt-0 mb-2">
          ${data.description}
        </div>
        `);

    }


    }
  });

});

//Delete post form
$('.parent-container').on('submit', '.del-po-form', function(e){
  e.preventDefault();

  var actionUrl = $(this).attr('action');
  $mainCard = $(this).closest('.card-body');
  var parentCont = $(this).closest('.parent-container');
  parentCont.append(`<div class="loader-2 loading-div d-none">Loading...</div>`);
  parentCont.css('position', 'relative');
  $loader2 = parentCont.find('.loader-2');
  debugger;
  if($loader2.hasClass('d-none')){
    $loader2.removeClass('d-none');
    $loader2.addClass('d-block');
  }
  // $mainCard.click(function(){return false;});
  $mainCard.css('opacity', '0.4');
  $loader2.css('opacity', '1')
  debugger;

  $.ajax({
    url:actionUrl,
    type: 'DELETE',
    mainCard: $mainCard,
    loader2: $loader2,
    success: function(data){
      debugger;
      var mainCard = this.mainCard;
      var loader2 = this.loader2;
      setTimeout(function(){
        mainCard.remove();
        if(loader2.hasClass('d-block')){
          loader2.removeClass('d-block');
          loader2.addClass('d-none');
        }
      }, 1000);
    }
  });

});


// Like form
$('.parent-container').on('submit', '.like-form', function(e){
    e.preventDefault();
    var actionUrl = $(this).attr('action');
    var parent = $(this).closest('.sub-parent');
    // Items to be changed
    $item = $(this);
    $originalBtn = $(this).find('.post-item-box');
    $likesCount = parent.find('.like-no');
    $.ajax({
        url: actionUrl,
        //no data
        type: 'POST',
        item: $item,
        originalBtn: $originalBtn,
        likesCount: $likesCount,
        success: function(data){
            // debugger;
            //data refers to the modelObj
            if(this.originalBtn.hasClass('not-liked')){
                //html inside the item(form) will be changed
                this.item.html(`
                    <button class="liked-btn post-item-box btn-block py-1 def-liked" type="submit">
                        <div style="font-weight: 600;">
                          <i class="fas fa-thumbs-up"></i> Liked
                        </div>
                    </button>
                `);
                    if(data.shpost){
                        this.likesCount.html(`
                                <a href="/posts/${data._id}/likes/SHARED_POST">
                                <span class="likes-val"></span>
                                ${data.likes.length} Like${data.likes.length === 1 ? '' : 's'}
                                </a>
                            `);
                    } else {
                        this.likesCount.html(`
                                <a href="/posts/${data._id}/likes/POST">
                                <span class="likes-val"></span>
                                ${data.likes.length} Like${data.likes.length === 1 ? '' : 's'} 
                                </a>
                            `);                    
                    }
            }else{
                this.item.html(`
                      <button class="post-item-box btn-block py-1 not-liked" type="submit">
                        <i class="fas fa-thumbs-up"></i> Like
                      </button>
                `);
                    if(data.shpost){
                        this.likesCount.html(`
                                <a href="/posts/${data._id}/likes/SHARED_POST">
                                <span class="likes-val"></span>
                                ${data.likes.length} Like${data.likes.length === 1 ? '' : 's'}
                                </a>
                            `);
                    } else {
                        this.likesCount.html(`
                                <a href="/posts/${data._id}/likes/POST">
                                <span class="likes-val"></span>
                                ${data.likes.length} Like${data.likes.length === 1 ? '' : 's'}
                                </a>
                            `);                    
                    }                
            }
        }

    });
});

//Comments
//1) Creating new comment and appending to the list


$('.parent-container').on('submit', '.po-co-form', function(e){
    e.preventDefault();

    var partialsModal = $(".partials-modal");

    var poComData = $(this).serialize();
    var actionUrl = $(this).attr('action');
    var mainParent = $(this).closest('.parent-container');
    var parCommList = mainParent.find('.comments-list');
    var commNo = mainParent.find(".comm-no");
    //Appending the data inside the commList (commList must be outside the loop)

    //converts it into a string to save to the db
    $.ajax({
      url:actionUrl, 
      data:poComData, 
      type:'POST',

      success: function(data){
            //data corresponds to modelObj
            debugger;


            if(!data.err){

            parCommList.prepend(`
                <li class="full-single-comm">
                  <div class="dropdown show">
                    <div class="btn-group float-right">
                            <button type="button" class="option-button btn btn-secondary dropdown-toggle " data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="background-color:rgb(20, 20, 20, .7);">
                              <i class="fas fa-md fa-ellipsis-h"></i>
                            </button>
                      <div class="dropdown-menu dropdown-menu-right mr-1 text-right" aria-labelledby="option-button" style="background:0px;border:0px;">
                        <div class="com-optn-box d-inline pt-0 mt-0">
                          

                          ${data.modelObj.shpost ? `<form class="del-po-co-form d-inline" action="/topics/${data.topic._id}/posts/${data.modelObj._id}/pviews/${data.ppview._id}/SHARED_POST" method="POST" class="text-center d-inline" style="cursor:pointer;">
                          <button class="btn-sm btn-com-optn" name="confirm_delete" type="submit">
                          <i class="fas fa-trash"></i>
                          </button>
                          </form>` : `<form class="del-po-co-form d-inline" action="/topics/${data.topic._id}/posts/${data.modelObj._id}/pviews/${data.ppview._id}/POST" method="POST" class="text-center d-inline" style="cursor:pointer;">
                              <button class="btn-sm btn-com-optn" name="confirm_delete" type="submit">

                                <i class="fas fa-trash"></i>
                              </button>
                            </form>`}            

                          <button class="btn-sm btn-com-optn com-inp-tog">
                            <i class="fas fa-pen"></i>
                          </button>
                        </div>
                    </div>
                    </div>
                  </div>

                    <div class="comment-display">

                      <a href="/profile/${data.ppview.author._id}" class="post-author-names ">
                      <span class="badge">

                      <img src="${data.ppview.author.profimage.secure_url}" class="modal-image-2">
                      </span>${data.ppview.author.username}</a>

                      <div class="comment-div pl-1">

                        <p>${data.ppview.body}</p>
                        <!-- btndropdown -->
                      </div>

                    </div> 

                <div class="toggle-comment-edit-form d-none">
                  <div class="row d-block mx-1">
                  <form class="d-inline ed-po-co-form" action="/topics/${data.topic._id}/posts/${data.modelObj._id}/pviews/${data.ppview._id}" method="POST" id="postEditForm" enctype="application/x-www-form-urlencoded">
                    <div class="col-12">
                      <textarea class="input-form-control-com bg-custom-black px-1 autoresizing cursor-at-end forcomment-edit" name="pview[body]" placeholder="Edit Comment..." autofocus>${data.ppview.body}</textarea>
                    </div>
                    <div class=" bg-custom-black d-inline-block">
                      <button class="btn d-inline btn-savepost" type="submit">Save<span style="display:inline;"><i class="fas fa-md fa-paper-plane pl-1"></i></span></button>

                      <div class="comment-pic-container">
                        <!-- image in comments -->
                      </div>
                    </div>
                  </form>
                      <button class="btn d-inline btn-cancelcomment-edit">Cancel</button>

                  </div>
                </div>
              </li>
                `);
            $('.toggle-comment-post-form').removeClass("d-block");
            $('.toggle-comment-post-form').addClass("d-none");

            commNo.html(
              `
              ${data.modelObj.shpost ? `<a href="/topics/${data.topic._id}/posts/${data.modelObj._id}/SHARED_POST">
              <span class="likes-val"></span>
               ${data.modelObj.pviews.length} Comment${data.modelObj.pviews.length === 1 ? '' : 's'}
              </a>` :  `<a href="/topics/${data.topic._id}/posts/${data.modelObj._id}/POST">
              <span class="likes-val"></span>
              ${data.modelObj.pviews.length} Comment${data.modelObj.pviews.length === 1 ? '' : 's'}
              </a>`}
              
              `);

        }else{
          // triggering the modal

        }

      }
        
    });

});

//2) Deleting the comment
//REMEMBER BINDING IS VERY IMP OTHERWISE WON'T WORK FOR DYNAMICALLY CREATED ELEMENTS
$('.comments-list').on('submit', '.del-po-co-form', function(e){
  e.preventDefault();

  var actionUrl = $(this).attr('action');
  $itemToDelete = $(this).closest('.full-single-comm');
  //for commNO
  var mainParent = $(this).closest('.parent-container');
  var commNo = mainParent.find(".comm-no");
  //only one .comm-no so can access it using .parent-container

  $('#exampleModalLabel-e-s').text(`Deleted`);

  $('#error-success-dialog').modal('show');

 $.ajax({
    url: actionUrl,
    type: 'DELETE',
    itemToDelete: $itemToDelete,
    success: function(data){

      if(data.err){

        $('#exampleModalLabel-e-s').text(`${data.err}`);

        console.log(data.err);
        $('#error-success-dialog').modal({
          backdrop: 'static',
          keyboard: false,
          focus: true
        });

      }else{


        this.itemToDelete.remove();

        commNo.html(
            `
            ${data.shpost ? `<a href="/posts/${data._id}/SHARED_POST">
            <span class="likes-val"></span>
            ${data.pviews.length} Comment${data.pviews.length === 1 ? '' : 's'}
            </a>` :  `<a href="/posts/${data._id}/POST">
            <span class="likes-val"></span>
            ${data.pviews.length} Comment${data.pviews.length === 1 ? '' : 's'}
            </a>`}              
        `);

        $('#error-success-dialog').modal('hide');


      }

    }
  });
});

//3) Updating the comment
$(".comments-list").on('submit', '.ed-po-co-form', function(e){
  e.preventDefault();

  var data = $(this).serialize();
  var actionUrl = $(this).attr('action');
  var parent = $(this).closest('.full-single-comm');
  $itToUp = parent.find('.comment-display');
  $clForm = parent.find('.toggle-comment-edit-form')

  //no need to update the .full-single-comm

  $.ajax({
    url:actionUrl,
    data:data,
    type: 'PUT',
    itToUp: $itToUp,
    clForm: $clForm,
    success: function(data){
      //pview is the data

      if(data.err){

        $('#exampleModalLabel-e-s').text(`${data.err}`);

        console.log(data.err);
        $('#error-success-dialog').modal({
          backdrop: 'static',
          keyboard: false,
          focus: true
        });

      }else{

        this.itToUp.html(
          `
            <a href="/profile/${data.author._id}" class="post-author-names ">
            <span class="badge">
            <img src="${data.author.profimage.secure_url}" class="modal-image-2">
            </span>${data.author.username}</a>

            <div class="comment-div pl-1">

              <p>${data.body}</p>
              <!-- btndropdown -->
            </div>
          `);

        this.clForm.removeClass("d-block");
        this.clForm.addClass("d-none");

      }
    }
  });

});

//1)Adding or remove Bookmark

$('.parent-container').on('submit', '.post-bookmark', function(e){
  e.preventDefault();

  var data = $(this).serialize();
  var actionUrl = $(this).attr('action');
  var parent = $(this).closest('.parent-container');
  $bookBtn = parent.find('.post-bookmark');
  $bookmarkUp = parent.find('.bookmark-div');

  $.ajax({
    url:actionUrl,
    data:data,
    type: 'POST',
    bookmarkUp: $bookmarkUp,
    bookBtn: $bookBtn,
    success:function(data){

      if(data === 'added'){
        this.bookmarkUp.html(
        `
                <div class="bookmarked-sign ml-2 pl-1">
                  <i class="fas fa-bookmark"></i> Bookmarked 
                </div>
        `);
        this.bookBtn.html(
        `
                <button class="uni-red navs-dropdown-item book-btn">
                  <i class="fas fa-bookmark"></i> Remove Bookmark 
                </button>
        `);
      }else{
        this.bookmarkUp.html('');
        this.bookBtn.html(`
                <button class="bookmark navs-dropdown-item">
                  <i class="fas fa-bookmark book-btn"></i> Add Bookmark 
                </button>          
        `);
      }
      
    }
  });

});


//CONFIRM DELETE
//will be triggered before deleting to confirm
//REMEMBER BINDING IS VERY IMP OTHERWISE WON'T WORK FOR DYNAMICALLY CREATED ELEMENTS
$('.comments-list').on('click', 'button[name="confirm_delete"]', function(e) {
  var $form = $(this).closest('form');
  e.preventDefault();
  $('#confirmDelete').modal({
      backdrop: 'static',
      keyboard: false,
      focus: true
  })
  .on('click', '#sureDelete', function(e) {
      $form.trigger('submit');
    });
});

$('.post-menu-optns').on('click', 'button[name="confirm_delete"]', function(e) {
  var $form = $(this).closest('form');
  e.preventDefault();
  $('#confirmDelete').modal({
      backdrop: 'static',
      keyboard: false,
      focus: true
  })
  .on('click', '#sureDelete', function(e) {
      $form.trigger('submit');
    });
});

// $(".del-po-co-form").submit(function(e){
//   e.preventDefault();
//   var actionUrl = $(this).attr('action');
//   $itemToDelete = $(this).closest('.full-single-comm');
//   $('#confirmDelete').modal({
//       backdrop: 'static',
//       keyboard: false,
//       focus: true
//   })
//   .on('click', '#sureDelete', function(e) {
//       $.ajax({
//         url: actionUrl,
//         type: 'DELETE',
//         itemToDelete: $itemToDelete,
//         success: function(data){
//           debugger;
//             this.itemToDelete.remove();
//           }
//       });
//     });
// });


// Creating and handling errors in ajax

window.addEventListener('error', function (e) {
  var stack = e.error.stack;
  var message = e.error.toString();

  if (stack) {
    message += '\n' + stack;
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/log', true);
  // Fire an Ajax request with error details
  xhr.send(message);
});

