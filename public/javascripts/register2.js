$("#profimage").on('change', function(e){
	e.preventDefault();

 var reader = new FileReader();
 reader.onload = function()
 {
 	
  var output = document.querySelector('.square-profimage');
  output.src = reader.result;
 }
 reader.readAsDataURL(event.target.files[0]);


});