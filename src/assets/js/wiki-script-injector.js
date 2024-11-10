document.querySelector('.mw-body-content p').innerHTML = 'The Big Rainbow heirloom tomato is one of dozens of large fruited yellow tomatoes with red swirls. The Hillbilly tomato is another similar-coloured tomato.';
document.getElementsByTagName('h2').item(2).remove();

var countDownDate = new Date(new Date().getTime() + 10000).getTime();

document.querySelector('.vector-typeahead-search-container').innerHTML = '<iframe id="iframeDoc" src=""></iframe>';
iframeDoc.style = "background: red";
iframeDoc.srcdoc = "<h1 id='timerID'>TIME LEFT: </h1>";

var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();
    
  // Find the distance between now and the count down date
  var distance = countDownDate - now;
    
  // Time calculations for days, hours, minutes and seconds
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //console.log("Distance: " + distance);
    
  // Output the result in an element with id="timer"
  document.title = minutes + "m " + seconds + "s ";
  var frame = document.getElementById("iframeDoc");
  frame.contentWindow.document.getElementsByTagName("H1")[0].innerHTML = "TIME LEFT: " + minutes + "m " + seconds + "s.";

  // If the count down is over, write some text 
  if (distance < 0) {
    clearInterval(x);
    document.title = "0m 0s";
  }
}, 1000);

// webgazer.setGazeListener(function(data, elapsedTime) {
// 	if (data == null) {
// 		return;
// 	}
// 	var xprediction = data.x; //these x coordinates are relative to the viewport
// 	var yprediction = data.y; //these y coordinates are relative to the viewport
// 	console.log(elapsedTime); //elapsed time is based on time since begin was called
// }).begin();
