chrome.browserAction.onClicked.addListener(function(tab) {
	afsGetScreenshot();
});

function afsGetMetaContents(mn, callback){
  var code = 'var meta = document.querySelector("meta[name=\'' + mn + '\']");' + 
           'if (meta) meta = meta.getAttribute("content");' +
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

function afsGetScreenshot() {
	afsGetMetaContents('ad.size', function(adSize) {
		// Parse it.
		var adParts = adSize.split(',');
		var adWidth = adParts[0];
		var adHeight = adParts[1];
		
		// Replace the width= and height= on each.
		adWidth = parseInt(adWidth.replace('width=', ''));
		adHeight = parseInt(adHeight.replace('height=', ''));
		
		if(adWidth > 0 && adHeight > 0) {
			// get the first container
			var firstContainerAd = document.body.children[0];
			
			alert(firstContainerAd);
			
			if(firstContainerAd != null && firstContainerAd != false) {
				window.AFSImageGenerator(firstContainerAd); // on screen.
			}
		}
	});
}