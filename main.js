chrome.browserAction.onClicked.addListener(function(tab) {
	afsGetScreenshot();
});

function afsGetMetaContents(mn, callback){
	var bannerId = 'banner-wrap'; // this should eventually be an option
	
  var code = 'var meta = document.querySelector("meta[name=\'' + mn + '\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
           'if (!(meta)) meta = document.getElementById("' + bannerId + '").offsetWidth + "," + document.getElementById("' + bannerId + '").offsetHeight;' + 
           '({' +
           '    mn: meta || ""' +
           '});';
           
	chrome.tabs.executeScript({
	    code: code
	}, function(results) {
	    if (!results) {
	        // An error occurred at executing the script. You've probably not got
	        // the permission to execute a content script for the current tab
	        return;
	    }
	    var result = results[0];
	    // Now, do something with result.mn
	    
	    callback(result.mn);
	});
}

function cropImage(imgSrc, imgWidth, imgHeight) {
	var cropCode = 'var dpr = window.devicePixelRatio;var scaleRatio = (1 / dpr);var canvasElement = document.createElement("canvas");canvasElement.id = "CanvasLayer";canvasElement.style="display:none";canvasElement.width = ' + imgWidth + ';canvasElement.height = ' + imgHeight + ';document.body.appendChild(canvasElement);var canvas = document.getElementById("CanvasLayer");var ctx = canvas.getContext("2d");var image = new Image();image.onload = function() {ctx.scale(scaleRatio, scaleRatio);ctx.drawImage(image, 0, 0);var html="<img src=\'"+canvas.toDataURL(\'image/jpeg\')+"\' alt=\'from canvas\'/>";var tab=window.open();tab.document.write(html);tab.document.execCommand("saveAs", true, ".jpg");};image.src = "' + imgSrc + '";';

	chrome.tabs.executeScript({
	  code: cropCode
	}, function(results) {
		
	});
}

function afsGetScreenshot() {
	afsGetMetaContents('ad.size', function(adSize) {
		// Parse it.
		var adParts = adSize.split(',');
		var adWidth = adParts[0];
		var adHeight = adParts[1];
		
		// Replace the width= and height= on each.
		adWidth = parseInt(adWidth.replace('width=', ''));
		adHeight = parseInt(adHeight.replace('height=', ''));
		
		var dimensions = {
			width: adWidth,
			height: adHeight,
			left: 0,
			top: 0
		};
		
		if(adWidth > 0 && adHeight > 0) {
			// get the first container
			// use captureVisualTab to capture the entire site, and then crop to the ad size
			chrome.tabs.captureVisibleTab(null, {format: 'jpeg'}, function(screenshot) {
				cropImage(screenshot, adWidth, adHeight);
			});
		}
	});
}