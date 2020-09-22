$('.btn-more-upload').on('click', function(e){

      $('#file-type-selection').modal({
        backdrop: 'static',
        keyboard: false,
        focus: true
      });

});

$('.btn-select-img').on('click', function(e){
	e.preventDefault();

  //Clear previous the pr-images
  $('#create-post-preview-image').html('');

  //////////// sicne i am replacing the html everytime no need to clear the label
	$('.upload-optn-selected-div').html(`
            <div class="file-up-div bg-custom-black">
              <label for="post-create-images" class="text-left btn btn-transparent-gray">
                      <span><img src="/images/gallery.svg" class="s-left-prof-icons"></span>
                      <span class="post-files-title rn-title-1">Select Images</span>
              </label>
              <input id="post-create-images" class="d-none" accept="images/*" type="file" multiple name="postImages">
            </div>
		`);

	$('#post-create-images').bind('click');
	$('#post-create-images').bind('change', function(e){




      e.preventDefault();
      if($(this)[0].files.length <= 4){

        if (typeof (FileReader) != "undefined") {

      $('.rn-title-1').text(' Selected');


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

	$('#file-type-selection').modal('hide');
})

$('.btn-select-vid').on('click', function(e){
  e.preventDefault();

    $('.all-uploads-optn-div').html(`
          <div class="video-content  bg-custom-black d-block">

            <div class="file-up-div bg-custom-black pl-2">
              <label for="post-create-video" class="btn btn-transparent-gray">
                <span><img src="/images/video-camera.svg" class="s-left-prof-icons"></span>
                <span class="upload-video-title rn-title-2">Select Video</span>
              </label>
              <input id="post-create-video" class="d-none multi-video" name="postVideo" type="file" accept="video/*">
            </div>

            <div class="d-inline bg-custom-black">
              <div class="video-preview-div bg-custom-black single-post-video">

              </div>
            </div>

          </div>
    `);
  $('#post-create-video').bind('click');
    $('#post-create-video').bind('change', function(e) {

      e.preventDefault();

      var parent = $(this).closest('.video-content');
      var videoPrDiv = parent.find('.video-preview-div');
      videoPrDiv.html(`<video class="py-0 my-0 cr-post-video" loop controls>
                      <source src="" id="video_here">
                      </video>`);
      videoPrDiv.css('width', '100%').css('height', '100%');
      // debugger;

      var $source = parent.find('#video_here');
      $source[0].src = URL.createObjectURL(this.files[0]);
      $source.parent()[0].load();

      $('.rn-title-2').text(' Selected');

    });

  $('#file-type-selection').modal('hide');

});