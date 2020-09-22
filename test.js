    $("#post-create-images").change(function () {
      if($(this)[0].files.length <= 4){

        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#create-post-preview-image");
            dvPreview.html("");
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;


              //For single image only
              $($(this)[0].files).each(function () {
                  var file = $(this);
                  if (regex.test(file[0].name.toLowerCase())) {
                      var reader = new FileReader();
                      reader.onload = function (e) {
                          var singleImg = $(`<div class="each-img-container single-pr-image"></div>`)
                          var img = $("<img />");
                          var label = $(`<button type="button" class="btn btn-cancel-img-pr"><i class="fas fa-2x fa-times-circle fa-cancel-pr"></i></button>`);
                          img.attr("class", "cr-post-pr-images p-0 pr-img1");
                          img.attr("src", e.target.result);
                          singleImg.append(img);
                          singleImg.append(label);

                          dvPreview.append(singleImg);
                      }
                      reader.readAsDataURL(file[0]);
                  } else {
                      alert(file[0].name + " is not a valid image file.");
                      dvPreview.html("");
                      return false;
                  }
              }); 


        }
      }

  });

    // --------------------------------------------------------------



    $('.new-post-creation-form').on('submit', function(e){
  e.preventDefault();


  $form = $(this);//used for clearing the preview images
  var actionUrl = $(this).attr('action');
  var parent = $(this).closest('.new-post-creation-container');
  $postsList = parent.siblings('.topic-own-posts-list');


  var fd = new FormData();

  // COPYING the 'filelist' array bcz it is immutable can't be modified
  var filesArr = Array.from($("#post-create-images")[0].files); 
  var videoFile = Array.from($('#post-create-video')[0].files); 

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

debugger;
for(var i=0; i < videoFile.length; i++){
  fd.append('postVideo', videoFile[i]);
}

for(var i = 0; i < filesArr.length; i++){
    fd.append("postImages", filesArr[i]);
}
  var other_data = $(this).serializeArray();

  $.each(other_data,function(key,input){
    fd.append(input.name,input.value);
  });

debugger;


// ajax 

  $.ajax({
    url:actionUrl,
    data:fd,
    contentType: false,
    processData: false,
    form:$form,
    videoDiv:$videoDiv,
    type: 'POST',
    success:function(data){

    },
    error:function(err){
      console.log('Error has occured', err);
    }

  });

});
// ----------------------------------------------

function prPostImages(e) {

      e.preventDefault();
      if($(this)[0].files.length <= 4){

        //All the things needed to tbe done
      }

    }



$("#post-create-images").change(function (e) {

    prPostImages(e);

}

        $("#post-create-images").change(function (e) {

      prPostImages(e);

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




// before updating
    ISODate("2020-07-17T06:03:08.770Z")

// after updating
ISODate("2020-07-17T06:03:08.770Z")

// just after some time
ISODate("2020-07-17T06:08:42.761Z")