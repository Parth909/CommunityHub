//Uppercasing the first letter only
// visibility is working fine
  if($('.flw-upper').is(':visible')){
    //Splitting the string at SPACES
    //['We', 'are', 'legends']

    var splitStr = $('.flw-upper').text().toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    splitStr = splitStr.join(' '); 

    $('.flw-upper').text(splitStr);

  }
//tooltip functionality
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


var searchBar = $("#searchBar");
var search = $('.right-search');

searchBar.focusin(function() {
  search.addClass('active');
});
searchBar.focusout(function() {
  search.removeClass('active');
});

// 1) :- CLICK & COPY TO CLIPBOARRD FUNCTIONALITY

function myFunction() {
    /* Get the text field */
    var copyText = document.getElementById("myInputCopy");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    /* Select the text field */
    textArea.select();
    textArea.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand("copy");
  
    /* Alert the copied text */
    alert("Copied the text: " + textArea.value);

    textArea.remove();
  }

//active nav-item color-change



// 2) :- RANDOM NAME COLOR FUNCTIONALITY


//-----------Random Color Functionality --------

var set = [
          "rgb(252, 81, 81)",
          "rgb(252, 126, 48)",
          "rgb(0, 204, 113)",
          "rgb(0, 177, 212)",
          "rgb(150, 113, 227)"
        ];
       var previousNum;
       var randNum;

      if($(".btn-follow-topic")){
       window.onload = function() {
            // Get a random number from predefined set
            randNum = getRndmFromSet(set);

            // Get another random number if number was the last chosen number in the set 
            while (previousNum == randNum) {
                 randNum = getRndmFromSet(set);
            }

           // record the previously chosen number
            previousNum = randNum;



          // debugger;

          $(".btn-follow-topic").css({"background-color": randNum, "color": "#fff"});

          $(".in-cell-no").css("color", randNum);

          // $(".btn-left-optn").css("color", randNum);

          $(".topic-name").css("color", randNum);

          $(".topic-name-2").css("color", randNum);

          $(".topic-cr-name").css("color", randNum);

          $("span.topic-title").css("color", randNum);

          $(".topic-cr-image").css("border-color", randNum);


        }

      }

       function getRndmFromSet(set) {
           var rndm = Math.floor(Math.random() * set.length);
           return set[rndm];
       }
//end of random non repetitive color generation

$(".left-turn-sect-1-btn").click(function(e){
  if($(".left-turn-sect-1").is(":visible")){

  }else{
    $(".left-turn-sect-1").addClass("d-block");
    $(".left-turn-sect-2").removeClass("d-block");
    $(".left-turn-sect-2").addClass("d-none");
    $(".left-turn-sect-3").removeClass("d-block");
    $(".left-turn-sect-3").addClass("d-none");
  }
});

$(".left-turn-sect-2-btn").click(function(e){
  if($(".left-turn-sect-2").is(":visible")){

  }else{
    $(".left-turn-sect-2").addClass("d-block");
    $(".left-turn-sect-1").removeClass("d-block");
    $(".left-turn-sect-1").addClass("d-none");
    $(".left-turn-sect-3").removeClass("d-block");
    $(".left-turn-sect-3").addClass("d-none");
  }
});

$(".left-turn-sect-3-btn").click(function(e){
  if($(".left-turn-sect-3").is(":visible")){

  }else{
    $(".left-turn-sect-3").addClass("d-block");
    $(".left-turn-sect-2").removeClass("d-block");
    $(".left-turn-sect-2").addClass("d-none");
    $(".left-turn-sect-1").removeClass("d-block");
    $(".left-turn-sect-1").addClass("d-none");
  }
});

//----------------------------------------------
// var initColor = document.querySelector(".in-cell-no").;

// 	var random = Math.floor(Math.random() * colors.length);
// 	name.style.color = colors[random];

//////////////////////////////////////////
//READ MORE LESS FUNCTIONALITY

$(document).ready(function() {
	var showChar = 160;
	var ellipsestext = " . . .";
	var moretext = "Show more";
	var lesstext = "Show less";
	$('.more').each(function() {
		var content = $(this).html();
    
		if(content.length > showChar) {

			var c = content.substr(0, showChar);
			var h = content.substr(showChar-1, content.length - showChar);

			var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink" id="seeing-fnc">' + moretext + '</a></span>';

			$(this).html(html);
		}

	});

	$(".morelink").click(function(){
		if($(this).hasClass("less")) {
			$(this).removeClass("less");
			$(this).html(moretext);
		} else {
			$(this).addClass("less");
			$(this).html(lesstext);
		}
		$(this).parent().prev().toggle();
		$(this).prev().toggle();
		return false;
	});
});

///////////////////////////////////
// follow button functionality

// $(function(){
//   $("#follow-toggle").click(function () {
//      $(this).text(function(i, text){
//          return text === "Follow" ? "Following" : "Follow";
//      })
//   });
// })


//////////////////////////////////////////
// input-resizing functionality
input = document.querySelector(".autoresizing"); 
input.addEventListener('input', autoResize, false); 

function autoResize() { 
    this.style.height = 'auto'; 
    this.style.height = this.scrollHeight + 'px'; 
} 

/////////////////////////////////////////
//toggling display textarea functionality

$(".likebutton").click(function() {
  var $parent = $(this).closest(".parent-container");
  
  var likes = parseInt($parent.find(".likes-count").text());

  if($parent.find(".icon-fav").text() == "favorite") {
      $parent.find(".icon-fav").text("favorite_border");
      $parent.find(".likes-count").text(++likes);
  }
  else {
      $parent.find(".icon-fav").text("favorite");
      $parent.find(".likes-count").text(--likes);
  }
});
// // toggling the post inputs
// $(document).ready(function() {
//   $(".edit-post-input").click(function() {
//     var $parent = $(this).closest(".parent-container");
//     var postform = $parent.find(".toggle-edit-post-form");
//     var hidepost = $parent.find(".hide-org-post");

//     if(postform.hasClass('d-none')) {
//         postform.removeClass('d-none');
//         postform.addClass('d-block');
//         hidepost.removeClass('d-block');
//         hidepost.addClass('d-none');
//     }
//     else {
//       postform.removeClass('d-block');
//       postform.addClass('d-none');
//       hidepost.removeClass('d-none');
//       hidepost.addClass('d-block');
//     }
//   });
// });
// CancelPost button functionality
// $(document).ready(function() {
//   $(".btn-cancelpost").click(function() {
//     var $parent = $(this).closest(".parent-container");
//     var postform = $parent.find(".toggle-edit-post-form");
//     var hidepost = $parent.find(".hide-org-post");

//     if(postform.hasClass('d-none')) {
//         postform.removeClass('d-none');
//         postform.addClass('d-block');
//         hidepost.removeClass('d-block');
//         hidepost.addClass('d-none');
//     }
//     else {
//       postform.removeClass('d-block');
//       postform.addClass('d-none');
//       hidepost.removeClass('d-none');
//       hidepost.addClass('d-block');
//     }
//   });
// });

//toggling the comment input
$(document).ready(function() {
  
  $(".parent-container").on('click', '.comment-input-toggle', function() {
    var $parent = $(this).closest(".parent-container");
    var commentform = $parent.find(".toggle-comment-post-form");

    if(commentform.hasClass('d-none')) {
        commentform.removeClass('d-none');
        commentform.addClass('d-block');
    }
    else {
      commentform.removeClass('d-block');
      commentform.addClass('d-none');
    }
  });
});

//CancelComment button functionality
$(document).ready(function() {
  
  $(".parent-container").on('click', '.btn-cancelcomment', function() {
    var $parent = $(this).closest(".parent-container");
    var postform = $parent.find(".toggle-comment-post-form");

    if(postform.hasClass('d-none')) {
        postform.removeClass('d-none');
        postform.addClass('d-block');
    }
    else {
      postform.removeClass('d-block');
      postform.addClass('d-none');
    }
  });
});

//Image toggling button button functionality
$(document).ready(function() {
  
  $(".parent-container-sh").on('click', '.post-images-grid', function() {
    var $parent = $(this).closest(".parent-container-sh");
    
    var sepimages = $parent.find(".sep-images");

    if(sepimages.hasClass('d-none')) {
        sepimages.removeClass('d-none');
        $(this).addClass('d-none');
    }
    else {
        sepimages.addClass('d-none');
        $(this).removeClass('d-none');
    }
  });
});


  $(".support-div-for-bind").on('click', '.post-images-grid', function() {
    var $parent = $(this).closest(".parent-container");
    
    var sepimages = $parent.find(".sep-images");

    if(sepimages.hasClass('d-none')) {
        sepimages.removeClass('d-none');
        $(this).addClass('d-none');
    }
    else {
        sepimages.addClass('d-none');
        $(this).removeClass('d-none');
    }
  });



$(document).ready(function() {
  
  $(".parent-container").on('click', '.options_minimize__link', function() {
    var $parent = $(this).closest(".parent-container");
    var gridimages = $parent.find(".post-images-grid");
    var sepimages = $parent.find(".sep-images");

    if(gridimages.hasClass('d-none')) {
        gridimages.removeClass('d-none');
        sepimages.addClass('d-none');
    }

  });
});


// toggling the comment input form
$('.parent-container').on('click', '.edit-post-tog', function(e){
  e.preventDefault();
  var $parent = $(this).closest('.parent-container');
  var postEditForm = $parent.find('.toggle-post-edit-form');
  var textDiv = $parent.find('.post-text-div');

  if(postEditForm.hasClass('d-none')){
    postEditForm.removeClass('d-none');
    postEditForm.addClass('d-block');
    textDiv.addClass('d-none');
  }else{
    postEditForm.addClass('d-none');
    postEditForm.removeClass('d-block');
    textDiv.removeClass('d-none');    
  }
});

//canceling the form and displaying the div
$(".parent-container").on('click', '.btn-cancelpost-edit', function(){
  var $parent = $(this).closest('.parent-container');
  var postEditForm = $parent.find('.toggle-post-edit-form');
  var textDiv = $parent.find('.post-text-div');

  if(postEditForm.hasClass('d-none')){
    postEditForm.removeClass('d-none');
    postEditForm.addClass('d-block');
    textDiv.addClass('d-none');
  }else{
    postEditForm.addClass('d-none');
    postEditForm.removeClass('d-block');
    textDiv.removeClass('d-none');    
  }
});



//toggling the comment-form of post
$(document).ready(function(){
  //Binding is very for dynamic elements to work
  $('.comments-list').on('click', '.com-inp-tog', function(){
    var parent = $(this).closest('.full-single-comm');
    var comEditForm = parent.find('.toggle-comment-edit-form');
    var commentDiv = parent.find('.comment-div');
    var forcomment = parent.find('.forcomment-edit');


    if(comEditForm.hasClass('d-none')){
      commentDiv.addClass('d-none');
      comEditForm.removeClass('d-none').addClass('d-block');
      // forcomment.setAttribute('autofocus');

      $('.forcomment-edit').focus(function(){
        var that = this;
        setTimeout(function(){ that.selectionStart = that.selectionEnd = 10000; }, 0);
      });

    }else{
      commentDiv.removeClass('d-none');
      comEditForm.addClass('d-none').removeClass('d-block');
    }
  });
});

//----------toggling the comment-form of post
$(document).ready(function(){
  $('.comments-list').on('click', '.btn-cancelcomment-edit', function(){
    var parent = $(this).closest('.full-single-comm');
    var comEditForm = parent.find('.toggle-comment-edit-form');
    var commentDiv = parent.find('.comment-div');

    if(commentDiv.hasClass('d-none')){
      commentDiv.removeClass('d-none');
      comEditForm.addClass('d-none').removeClass('d-block');
    }
  });
});

//-0------Moving the cursor to the end of the text
jQuery.fn.putCursorAtEnd = function() {

  return this.each(function() {
    
    // Cache references
    var $el = $(this),
        el = this;

    // Only focus if input isn't already
    if (!$el.is(":focus")) {
     $el.focus();
    }

    // If this function exists... (IE 9+)
    if (el.setSelectionRange) {

      // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
      var len = $el.val().length * 2;
      
      // Timeout seems to be required for Blink
      setTimeout(function() {
        el.setSelectionRange(len, len);
      }, 1);
    
    } else {
      
      // As a fallback, replace the contents with itself
      // Doesn't work in Chrome, but Chrome supports setSelectionRange
      $el.val($el.val());
      
    }

    // Scroll to the bottom, in case we're in a tall textarea
    // (Necessary for Firefox and Chrome)
    this.scrollTop = 999999;

  });

};

(function() {
  
  var textEdit = $(".cursor-at-end");

  textEdit
    .putCursorAtEnd() // should be chainable
    .on("focus", function() { // could be on any event
      textEdit.putCursorAtEnd()
    });
  
})();

//---------------The horizontal scroll functionality


// var hidWidth;
// var scrollBarWidths = 50;

// var widthOfList = function(){
//   var itemsWidth = 0;
//   $('.list a').each(function(){
//     var itemWidth = $(this).outerWidth();
//     itemsWidth+=itemWidth;
//   });
//   return itemsWidth;
// };

// var widthOfHidden = function(){
//   return (($('.sub-nav-optn-wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
// };

// var getLeftPosi = function(){
//   return $('.list').position().left;
// };

// var reAdjust = function(){
//   if (($('.sub-nav-optn-wrapper').outerWidth()) < widthOfList()) {
//     $('.scroller-right').show();
//   }
//   else {
//     $('.scroller-right').hide();
//   }
  
//   if (getLeftPosi()<0) {
//     $('.scroller-left').show();
//   }
//   else {
//     $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
//     $('.scroller-left').hide();
//   }
// }

// reAdjust();

// $(window).on('resize',function(e){  
//     reAdjust();
// });

// $('.scroller-right').click(function() {
  
//   $('.scroller-left').fadeIn('slow');
//   $('.scroller-right').fadeOut('slow');
  
//   $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

//   });
// });

// $('.scroller-left').click(function() {
  
//   $('.scroller-right').fadeIn('slow');
//   $('.scroller-left').fadeOut('slow');
  
//     $('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){
    
//     });
// });    



// horizontal scroll end



// FIXING THE SIDE SECTIONS
$(window).scroll(function() {
   if($(window).height() <= $(document).height()) {
      // alert("bottom!");

      if(($(window).height()) <= ($("#leftsect").height())) {
      var offview = parseInt($(window).height() - $("#leftsect").height());

      offview = -Math.abs(offview);

      $('#leftsect').css("top", offview);
      }else{
        $('#leftsect').css("top", "0px");
      }

    //   if($(window).scrollTop() >){
    //     $('#leftsect').css("top", "0px");
    // }
    //need to figure out if user scrolls up the leftsect should also scollup and stick    
   }

});

// $(".topic-search").click(function(e){
//   $(".navbar-search-btn").css("cssText", "display:none !important;");

// });

// if($(".topic-search-cont").is(":visible")){
// }  

// The count for posts
$('.post-create-count').keyup(function () {

        var parent = $(this).closest(".create-post-container");
        var characterCount = $(this).val().length,
        current = parent.find('.current_post_characters'),
        maximum = parent.find('.maximum_post_characters'),
        theCount = parent.find('.the_count_post_characters');
        var maxlength = $(this).attr('maxlength');
        var changeColor = 0.75 * maxlength;
        current.text(characterCount);

        if (characterCount > changeColor && characterCount < maxlength) {
          current.css('color', '#00b7ff');
          current.css('fontWeight', 'bold');
        }
        else if (characterCount >= maxlength) {
          current.css('color', '#e74a3b');
          current.css('fontWeight', 'bold');
        }
        else {
          var col = maximum.css('color');
          var fontW = maximum.css('fontWeight');
          current.css('color', col);
          current.css('fontWeight', fontW);
        }
});

//The circle count 
$('.post-create-count').keyup(function () {

        var parent = $(this).closest(".create-post-container");
        var characterCount = $(this).val().length;
        var updateCnt = parent.find('.change-cnt');
 
        var maxlength = $(this).attr('maxlength');
        var changeColor = 0.75 * maxlength;
        var percent = Math.floor(characterCount / maxlength * 100);
        //65 refer css file
        var loaderCalc = 65 - (65 * percent) / 100;
          
        updateCnt.css('stroke-dashoffset', loaderCalc);

        if(characterCount === 0){
          updateCnt.css('stroke-width', '1.5');
          updateCnt.css('stroke', '#676767');          
        }
        else if (characterCount > changeColor && characterCount < maxlength) {
          updateCnt.css('stroke-width', '2.5');
          updateCnt.css('stroke', '#00b7ff');

        }
        else if (characterCount >= maxlength) {
          updateCnt.css('stroke-width', '2.5');
          updateCnt.css('stroke', '#e74a3b');

        }
        else {
          updateCnt.css('stroke-width', '1.5');
          updateCnt.css('stroke', '#00b7ff');          

        }
});

// Developing great preview functionality while creating the posts
//after wards move that in the ajax file
// so that the error can also be rendered in a more better way

//remember the backend validation as well
$(function () {
    $("#post-create-images").change(function (e) {
      e.preventDefault();
      if($(this)[0].files.length <= 4){

        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#create-post-preview-image");
            dvPreview.html("");
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

            if($(this)[0].files.length === 1){

              //For single image only
              $($(this)[0].files).each(function () {
                  var file = $(this);
                  //Need the original filename without lowercase for checking
                  var orgFileName = file[0].name;
                  if (regex.test(file[0].name.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          var imgWrapper = $(`<div class="pr-image-wrapper d-inline p-0 m-0"></div>`);//
                          var singleImg = $(`<div class="each-img-container single-pr-image"></div>`)
                          var img = $("<img />");
                          var pName = $("<p class='d-none'></p>");
                          pName.text(orgFileName);
                          var label = $(`<button type="button" class="btn btn-cancel-img-pr"><i class="fas fa-2x fa-times-circle fa-cancel-pr"></i></button>`);
                          img.attr("class", "cr-post-pr-images p-0 pr-img1");
                          img.attr("src", e.target.result);
                          singleImg.append(img);
                          singleImg.append(label);
                          imgWrapper.append(singleImg);
                          imgWrapper.append(pName);
                          dvPreview.append(imgWrapper);
                          debugger;
                      }
                      reader.readAsDataURL(file[0]);
                  } else {
                      alert(file[0].name + " is not a valid image file.");
                      dvPreview.html("");
                      return false;
                  }
              }); 

            }else if($(this)[0].files.length === 2 || $(this)[0].files.length === 4){

              var imgCounter=0;
              //For two images
              $($(this)[0].files).each(function () {

                  var file = $(this);
                  //Need the original filename without lowercase for checking
                  var orgFileName = file[0].name;
                  if (regex.test(file[0].name.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        imgCounter++;
                          var imgWrapper = $(`<div class="pr-image-wrapper d-inline p-0 m-0"></div>`);//
                          var singleImg = $(`<div class="each-img-container double-pr-image d-inline-flex px-auto"></div>`);
                          var img = $("<img />");
                          var pName = $("<p class='d-none'></p>");
                          pName.text(orgFileName);
                          var label = $(`<button type="button" class="btn btn-cancel-img-pr"><i class="fas fa-2x fa-times-circle fa-cancel-pr"></i></button>`);
                          img.attr(`class`, `cr-post-pr-images p-0 pr-img${imgCounter}`);
                          img.attr("src", e.target.result);
                          singleImg.append(img);
                          singleImg.append(label);
                          imgWrapper.append(singleImg);
                          imgWrapper.append(pName);
                          dvPreview.append(imgWrapper);
                      }
                      reader.readAsDataURL(file[0]);
                  } else {
                      alert(file[0].name + " is not a valid image file.");
                      dvPreview.html("");
                      return false;
                  }
              }); 

            }else if($(this)[0].files.length === 3){

              //For three images
              var counter = 0, imgCounter=0;
              $($(this)[0].files).each(function () {

                counter++;

                if( counter >= 1 && counter <= 2){

                  var file = $(this);
                  //Need the original filename without lowercase for checking
                  var orgFileName = file[0].name;
                  if (regex.test(file[0].name.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          imgCounter++;//1 , 2 
                          var imgWrapper = $(`<div class="pr-image-wrapper d-inline p-0 m-0"></div>`);//
                          var singleImg = $(`<div class="each-img-container triple-pr-image d-inline-flex mt-0"></div>`)
                          var img = $("<img />");
                          var pName = $("<p class='d-none'></p>");
                          pName.text(orgFileName);
                          var label = $(`<button type="button" class="btn btn-cancel-img-pr"><i class="fas fa-2x fa-times-circle fa-cancel-pr"></i></button>`);
                          img.attr(`class`, `cr-post-pr-images p-0 m-0 pr-img${imgCounter}`);
                          img.attr("src", e.target.result);
                          singleImg.append(img);
                          singleImg.append(label);
                          imgWrapper.append(singleImg);
                          imgWrapper.append(pName);
                          dvPreview.append(imgWrapper);

                      }
                      reader.readAsDataURL(file[0]);
                  } else {
                      alert(file[0].name + " is not a valid image file.");
                      dvPreview.html("");
                      return false;
                  }

                }else{// for the third counter adding extra class(triple-last-img)

                  var file = $(this);
                  //Need the original filename without lowercase for checking
                  var orgFileName = file[0].name;
                  if (regex.test(file[0].name.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          imgCounter++;//3
                          var imgWrapper = $(`<div class="pr-image-wrapper d-inline p-0 m-0"></div>`);//
                          var singleImg = $(`<div class="each-img-container triple-pr-image d-inline-flex mt-0 triple-last-img"></div>`)
                          var img = $("<img />");
                          var pName = $("<p class='d-none'></p>");
                          pName.text(orgFileName);
                          var label = $(`<button type="button" class="btn btn-cancel-img-pr"><i class="fas fa-2x fa-times-circle fa-cancel-pr"></i></button>`);
                          img.attr(`class`, `cr-post-pr-images p-0 m-0 pr-img${imgCounter}`);
                          img.attr("src", e.target.result);
                          singleImg.append(img);
                          singleImg.append(label);
                          imgWrapper.append(singleImg);
                          imgWrapper.append(pName);
                          dvPreview.append(imgWrapper);

                      }
                      reader.readAsDataURL(file[0]);
                  } else {
                      alert(file[0].name + " is not a valid image file.");
                      dvPreview.html("");
                      return false;
                  }

                }

              });//each loop

            }




        } else {
            alert("This browser does not support HTML5 FileReader.");
        }

      }else{
        //Properly render the error in ajax
        alert("Please enter less than 4 images");
      }

    });
});

// REMOVE THE PREVIEW IMAGE
// binding this to all the btns inside that div
$('#create-post-preview-image').on('click', '.btn-cancel-img-pr', function(e){
    // preventing Default submission
    e.preventDefault();
    var subParent = $(this).closest('.sub-parent-img-preview-div');
    let imgParent = $(this).closest('.each-img-container');

    var imgWrapper = $(this).closest('.pr-image-wrapper');

    //1) add the class on the pr-image wrapper 
    imgWrapper.addClass('marked-for-delete');

    imgParent.remove();

    // REMOVING THE CLASS (triple-last-img) so that particular css class removed and other css is used
    $('.each-img-container').each(function(){
      if($(this).hasClass('triple-last-img')){
        $(this).removeClass('triple-last-img');
      }
    });


});


$(document).ready(function(){
  if($(document).width() <= 992){
    $(".right-sect-aside").append(
    `
      <button type="button" class="btn btn-cancel-right-sect">
        <i class="fas fa-2x fa-times-circle fa-cancel-right-sect"></i>
      </button>
    `);
  }
});

// Toggling the topic-info and the mainmenu functionality

$(".tog-topic-info").click(function(e){
  e.preventDefault();

  if($('.topic-info').hasClass('d-none')){
    $('.topic-info').removeClass('d-none');
    $('.leftsectMenu').addClass('d-none');
  }
});

$('.tog-left-main-menu').click(function(e){
  e.preventDefault();

  if($('.leftsectMenu').hasClass('d-none')){
    $('.leftsectMenu').removeClass('d-none');
    $('.topic-info').addClass('d-none');
  }
});