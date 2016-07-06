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

$(function() {
   $('.directUpload').find("input:file").each(function(i, elem) {
     log.debug("URL directUpload")
     log.debug(form)
     var fileInput    = $(elem);
     log.debug("fileInput")
     log.trace(fileInput)
     var form         = $(fileInput.parents('form:first'));
     var URL_dest = form.data('url') + "/" + form.data('form-data').key
     var submitButton = $('#submitButton');
     progressBar.css('display','inline');
     fileInput.fileupload({
     add: function(e, data) {
             var uploadErrors = [];
             var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
             if(data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
                 uploadErrors.push('Not an accepted file type');
             }
             if(data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 1000000) {
                 uploadErrors.push('Filesize is too big');
             }
             if(uploadErrors.length > 0) {
                 alert(uploadErrors.join("\n"));
             } else {
                 data.submit();
             }
     },
     fileInput:       fileInput,
     url:             form.data('url'),
     type:            'POST',
     autoUpload:       true,
     formData:         form.data('form-data'),
     paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
     dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
     replaceFileInput: false,
     progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        //progressBar.css('width', progress + '%')
        $('#progress').show();
        progressBar.text(progress + '%');
        progressBar.attr('value',progress);
        console.log("Progress: ", progress);
     },
     start: function (e) {
        //submitButton.attr('disabled', 'disabled');
        progressBar.addClass('progress-success');
        log.trace(form);
     },
     done: function(e, data) {
        $("#saveMessage").text('Changes Made, Save Pending...');
        submitButton.prop('disabled', false);
        //progressBar.text("Uploading done");
        $('#upload_button').removeAttr('disabled');
        // extract key and generate URL from response
        var key   = $(data.jqXHR.responseXML).find("Key").text();
        var url   = '//' + form.data('host') + '/' + key;
        log.debug("done:key,url")
        log.debug(key)
        log.debug(url)
        // create hidden field
        var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
        form.append(input);
        imageURL = "https:" + url;
        log.debug("imageURL");
        log.debug(imageURL);
        canvas.setBackgroundImage(imageURL,
             canvas.renderAll.bind(canvas), {
                backgroundImageOpacity: 0.5,
                backgroundImageStretch: false,
                scaleX:1,
                scaleY:1,
                top: center.top,
                left: center.left,
                originX: 'center',
                originY: 'center',
                crossOrigin: 'anonymous'
             }
        );
        $('#progress').hide();
        //submitButton.removeAttr('disabled');
        //resetFormElement($('#backgroundfile'));
        //$("#backgroundfile").val("");
        $('#backgroundSection').modal('hide');
        backgroundButton(true);
        onSave();
      },
      fail: function(e, data) {
        submitButton.prop('disabled', false);
        progressBar.removeClass('progress-success').addClass('progress-danger');
      }
    });
  });
});
function backgroundExists(link) {

   log.info("In background exists")
   log.debug(link)
   var background_exists = false;
   if (link === undefined || link === "") {
      background_exists = false;
      log.debug("Using Background Button")
      if ( $( "#backgroundButton" ).length ) {
              log.debug("Found Background Button")
      }
      if ( $( "#backgroundButtonText" ).length ) {
              log.debug("Found backgroundButtonText")
      }
      backgroundButton(false);
   } else {
      background_exists = true;
      log.debug("Using Remove Background Button")
      if ( $( "#backgroundButton" ).length ) {
              log.debug("Found Background Button")
      }
      if ( $( "#backgroundButtonText" ).length ) {
              log.debug("Found backgroundButtonText")
      }
      backgroundButton(true);
   }
   log.debug("Background Exists?")
   log.debug(background_exists)
   log.info("Leaving Background Exists")
   return background_exists;
}

function backgroundButton( background )
{
   if (background) {
     $("#backgroundButton").attr("onclick","removeBackgroundRoutine(); return false;");
     $("#backgroundButtonText").html('Remove Background');
   } else {
     $("#backgroundButton").attr("onclick","addBackgroundRoutine(); return false;");
     $("#backgroundButtonText").html('Background');
   }
}

function removeBackgroundRoutine()
{
   removeBackground();
   backgroundButton(false);
   return false;
}

function addBackgroundRoutine()
{
   runBackground();
   backgroundModal();
   return false;
}

function toggle_versions_pane()
{
   var effect = 'slide';
   // Set the options for the effect type chosen
   var options = { direction: 'right' };
   // Set the duration (default: 400 milliseconds)
   var duration = 500;
   $('#versionspanel').toggle(effect, options, duration);
}


function runBackground() {
   $('#lefile').value = '';
   $("#backgroundfile").val('');
   //submitButton.removeAttr('disabled');
   progressBar.addClass("progress-success");
   progressBar.text('0%');
   progressBar.attr('value','0');
}

function removeBackground() {
   $("#saveMessage").text('Changes Made, Save Pending...');
   $('#lefile').attr("value", "");
   $('#lefile').val("");
   canvas.setBackgroundImage(0, canvas.renderAll.bind(canvas));
   onSave();
}

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
          console.log(data)
          console.log("An error has occurred");
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

var Inspect = {
    TYPE_FUNCTION: 'function',
    // Returns an array of (the names of) all methods
    methods: function(obj) {
        var testObj = obj || self;
        var methods = [];
        for (prop in testObj) {
            if (typeof testObj[prop] == Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                methods.push(prop);
            }
        }
        return methods;
    },
    // Returns an array of (the names of) all properties
    properties: function(obj) {
        var testObj = obj || self;
        var properties = [];
        for (prop in testObj) {
            if (typeof testObj[prop] != Inspect.TYPE_FUNCTION && typeof Inspect[prop] != Inspect.TYPE_FUNCTION) {
                properties.push(prop);
            }
        }
        return properties;
    }
}
