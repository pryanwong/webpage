/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

function dragtest() {
    var div = document.createElement('div');
    return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
}

window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

function modernizerFunction(Mod, doc ) {
  log.info( "Entering  modernizerFunction");
  if (Mod.draganddrop) {
     // Browser supports HTML5 DnD.
     // Bind the event listeners for the image elements
     var images = doc.querySelectorAll('#images img');
     [].forEach.call(images, function (img) {
        img.addEventListener('dragstart', handleDragStart, false);
        img.addEventListener('dragend', handleDragEnd, false);
     });
     // Bind the event listeners for the canvas
     var canvasContainer = doc.getElementById('canvas-container');
     canvasContainer.addEventListener('dragenter', handleDragEnter, false);
     canvasContainer.addEventListener('dragover', handleDragOver, false);
     canvasContainer.addEventListener('dragleave', handleDragLeave, false);
     canvasContainer.addEventListener('drop', handleDrop, false);
  } else {
    // Replace with a fallback to a library solution.
    alert("This browser doesn't support the HTML5 Drag and Drop API.");
  }
  log.info( "Leaving  modernizerFunction");
};

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function GetDebugParameter(sParam){
    log.info( "Entering  GetDebugParameter");
    var sPageURL = window.location.hash;
    log.debug("sPageURL:");
    log.debug( sPageURL);
    sPageURL = sPageURL.split("?");
    if (sPageURL.length > 1) {
       var sURLVariables = sPageURL[1].split('&');
       log.debug("sURLVariables:");
       log.debug( sURLVariables);
       for (var i = 0; i < sURLVariables.length; i++)
       {
          var sParameterName = sURLVariables[i].split('=');
          log.debug("sParameterName:")
          log.debug(sParameterName);
          if (sParameterName[0] == sParam)
          {
            log.debug("sParameterName[1]:")
            log.debug(sParameterName[1]);
            log.info( "Leaving GetDebugParameter");
            return sParameterName[1];
          }
       }
    } else {
      log.info( "Leaving GetDebugParameter returning false");
      return false;
    }
};

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  e.stopPropagation();
  e.preventDefault();
}

function loadVersionsIntoPanel(timestamps) {
   versions = JSON.parse(timestamps)
   $("tbody#versionslisttab tr").remove()
   var arrayLength = versions.length;

   for (var i = 0; i < arrayLength; i++) {
      vararray = JSON.parse(versions[i])
      log.debug("Timestamp: ", vararray[0], ":", vararray[1])
      var link = '/companies/' + company_id + '/users/' + user_id + '/drawings/' + drawing_id + '/changeversion?version=' + vararray[0];
      tr = '<tr> <td> <a href="#" onclick="loadversion(\'' + link + '\'); return false;">' + vararray[1] + '</a></td> </tr>'
      $('#versionslisttab').append(tr);
   }
}

function loadversion(link) {
   $(".spinner").show();
   link = link + '&modified=' + modified;
   $.ajax({
       url: link,
       data: {
          format: 'json'
       },
       error: function(data) {
          //console.log(data)
          //console.log("An error has occurred");
          $(".spinner").fadeOut( 400 );
       },
       success: function(data) {
          log.trace("Data from AJAX: ", data)
          log.trace("Last Edit: ", JSON.parse(data[0]))
          loadVersionsIntoPanel(data[1])
          loadCanvasDrawing(data[2])
          modified = false;
          $(".spinner").fadeOut( 400 );
       },
       type: 'GET'
     });
}
