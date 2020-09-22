

$('.create_topic_name').keyup(function () {

        var parent = $(this).closest(".create-topic-container");
        var characterCount = $(this).val().length,
        current = parent.find('.current_topic_characters'),
        maximum = parent.find('.maximum_topic_characters'),
        theCount = parent.find('.the_count_topic_characters');
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

$('.create_topic_name2').keyup(function () {

        var parent = $(this).closest(".create-topic-container");
        var characterCount = $(this).val().length,
        current = parent.find('.current_topic_characters'),
        maximum = parent.find('.maximum_topic_characters'),
        theCount = parent.find('.the_count_topic_characters');
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
    //SELECT2 CONTAINER

    // $(document).ready(function(){
    
    //  load_json_data('category');
    
    //  function load_json_data(id, parent_id)
    //  {
    //   var html_code = '';
    //   $.getJSON('/category_tags.json', function(data){

    //   if(id!='tags'){
    //     html_code += '<option value="">Select '+id+'</option>';
    //   } 
      
    //    $.each(data, function(key, value){//each object
    //     if(id == 'category')
    //     {
    //      if(value.parent_id == '0')
    //      {
    //       html_code += '<option value="'+value.id+'">'+value.name+'</option>';
    //      }
    //     }
    //     else
    //     {
    //      if(value.parent_id == parent_id)
    //      {
          
    //       html_code += '<option value="'+value.id+'">'+value.name+'</option>';
    //      }
    //     }
    //    });
    //    $('#'+id).html(html_code);
    //   });
    
    //  }
    
    //  $(document).on('change', '#category', function(){
    //   var category_id = $(this).val();
    //   if(category_id != '')
    //   {
    //    load_json_data('tags', category_id);
    //   }
    //   else
    //   {
    //    $('#tags').html('');
    //   }
    //  });
    
    // });

//used to select multiple options from second list

// $(document).ready(function() {
//     $('#tags').select2({
//       closeOnSelect: false
//     });
//     $('#category').select2();
// });

//------------- Preview the image functionality ----------------

function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {

      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  //removing the TOPIC LOGO
  $("#pr-topic-img").attr("src","/images/pract_logo2.png");

  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
        $('.image-upload-wrap').addClass('image-dropping');
    });
    $('.image-upload-wrap').bind('dragleave', function () {
        $('.image-upload-wrap').removeClass('image-dropping');
});

var loadBackImg = function(event){
  var backImg = document.getElementById("pr-topic-img");
  backImg.src = URL.createObjectURL(event.target.files[0]);
  backImg.onload = function(){
     URL.revokeObjectURL(backImg.src); // free memory
  }
}

// Change the background Image according to the selection

$('.cover-image').on('click', function() {

  var background = $(this).css('background-image');
  background = background.replace('url(','').replace(')','').replace(/\"/gi, "");

  $("#pr-cover-img").attr('src', background);

});
//
// $('.display-tags-block').on('click', '.close-tag-title', function(e){
//   var parentTag = $(this).closest('.display-tag-name');
//   var actualName = parentTag.find('.actual-name').val();
//   parentTag.remove();

//   var value = $('#tags').val();

//   for(var i = 0; i<value.length; i++){
//     if(vale)
//   }

// });

$(document).ready(function() {

  var commaCount = 0;

  $('#tags').on('keyup', function(e){
    var tagArray = [];
    var value = $(this).val();
    var totalCharCounter = 0;
      var val = value.split(',');
      // debugger;
      var tagsBlock = $(this).siblings('.display-tags-block');
      if(tagsBlock.hasClass('bg-custom-black')){
        tagsBlock.addClass('bg-custom-more-black');
        tagsBlock.removeClass('bg-custom-block');
      }

      tagsBlock.html('');

      if(val.length <= 7){

        //Can enter only 7 tags right now
        if($('#tags').attr('maxlength')){
          $('#tags').removeAttr('maxlength');
        }

        val.forEach(function(val){

            if(val.length < 53){
              tagsBlock.append(`
                        <div class="my-1 px-1 display-tag-name py-0">
                            
                            <span class="px-2 py-0 actual-name">${val}</span>
                        </div>
                `);
              totalCharCounter += val.length;
            }else{

              $('#exampleModalLabel-e-s').text(`Keep your tags short and catchy`);

              $('#error-success-dialog').modal({
                backdrop: 'static',
                keyboard: false,
                focus: true
              });

            }

        });

      }else{//outer val end

        //if the user enters more than 7 tags using maxlength to stop them from typing
        $('#tags').attr('maxlength', totalCharCounter);

        $('#exampleModalLabel-e-s').text(`U can enter more tags later`);

        $('#error-success-dialog').modal({
          backdrop: 'static',
          keyboard: false,
          focus: true
        });
      }//outer val end
    
  });

});