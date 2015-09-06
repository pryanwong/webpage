//str = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It w as popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

words   = function(textInput) {
  var data = textInput.split(" ");
  console.log(data);
  return data;
}

wordWrap = function(data, maxwidth) {
   var dataIn = data;
   var maxwidthIn = maxwidth;
   var newLineStr = "\n"; done = false; res = '';
   var returnStr = '';
   var lineStr = '';
   var lineDone = false;
   var wordCount = 0;
   while (wordCount < dataIn.length) {
        lineDone = false;
		while(!lineDone && (wordCount < dataIn.length)) {
		   console.log("Word: " + dataIn[wordCount] + ":" + dataIn[wordCount].length);
		   if (dataIn[wordCount].slice(-1) == newLineStr) {
		       dataIn[wordCount] = dataIn[wordCount].substring(0, dataIn[wordCount].length - 1);
			   console.log("Removed newLineStr: " + dataIn[wordCount]);
		   }
		   
		   if (dataIn[wordCount].length >= maxwidthIn) {
		      var letterCount = 0;
			  while (letterCount < dataIn[wordCount].length) {
			      var chop = 0;
			      if (dataIn[wordCount].length < maxwidthIn) {
				    chop = dataIn[wordCount].length;
				  } else {
				    chop = maxwidthIn;
				  }
			      returnStr += [dataIn[wordCount].slice(0, chop), newLineStr].join(''); 
				  dataIn[wordCount] = dataIn[wordCount].slice(chop);
				  letterCount = chop;
			  }
		   }
		   if ((lineStr.length + dataIn[wordCount].length) <= maxwidthIn) {
		     lineStr = [lineStr,dataIn[wordCount]].join(' ');
		   }
		   if ((wordCount+1) < dataIn.length) {
		     if ((lineStr.length + dataIn[wordCount + 1].length) > maxwidthIn) {
		        lineStr = [lineStr,newLineStr].join('');
		        lineDone = true;
		     } 
		   } else {
		     lineDone = true;
		   }
		   wordCount++;     
		}
		returnStr = [returnStr,lineStr].join('');
		lineStr = "";
   }	
   return returnStr;
}

testWhite = function(x) {
    var white = new RegExp(/^\s$/);
	console.log("Testing White: " + white.test(x.charAt(0)));
    return white.test(x.charAt(0));
};

//str = wordWrap(str, 40);
