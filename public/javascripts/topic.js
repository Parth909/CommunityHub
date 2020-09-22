//RANDOM COLOR TAGS FUNCTIONALITY
var tagsColorSet = [
          "rgb(190, 193, 196)",
          "rgb(136, 221, 247)",
          "rgb(252, 182, 218)",
          "rgb(138, 93, 252)",
          "rgb(33, 178, 222)",
          "rgb(189, 0, 122)",
          "rgb(227, 144, 2)",
          "rgb(30, 138, 75)",
          "rgb(245, 225, 132)",
          "rgb(153, 255, 202)",
          "rgb(252, 210, 4)",
          "rgb(189, 147, 100)",
          "rgb(79, 123, 201)",
          "rgb(222, 16, 16)",
          "rgb(2, 168, 176)",
          "rgb(42, 201, 96)",
          "rgb(85, 252, 53)",
          "rgb(222, 105, 82)",
          "rgb(232, 77, 98)",
          "rgb(172, 140, 255)",
        ];
       var previousColors = [];
       var randColor;

       var tagsArray = document.querySelectorAll('.single-tag');

      if($(".single-tag")){
       window.onload = function() {


        for(let ele of tagsArray){
          if(tagsColorSet.length !== 0){
            randNo = getRndmColFromSet(tagsColorSet);
            randColor = tagsColorSet[randNo];
            previousColors.push(randColor);

            ele.style.borderColor = randColor;

            ele.querySelector('.tag-circle').style.color = randColor;

            tagsColorSet.splice(randNo, 1);                
          }else{
            //not to allocate new memory space so not using spread operator
            
            for(var i=0; i<previousColors.length; i++){
                tagsColorSet[i] = previousColors[i];              
            }
            
            previousColors.splice(0, previousColors.length);


            randNo = getRndmColFromSet(tagsColorSet);
            randColor = tagsColorSet[randNo];
            previousColors.push(randColor);

            ele.style.borderColor = randColor;

            ele.querySelector('.tag-circle').style.color = randColor;

            tagsColorSet.splice(randNo, 1); 
          }


        }


        }
      }

       function getRndmColFromSet(set) {
           var rndm = Math.floor(Math.random() * set.length);
           return rndm;
       }

//toggling the second half page
$(".bott-show-more-categories").click(function(e){
  e.preventDefault();

  let btn = $(this);
  let secondPart = $('.topic-index-second-half');

  if(!secondPart.is(":visible")){
    btn.addClass('d-none');
    secondPart.removeClass('d-none');
    secondPart.addClass('d-block');
  }

});

