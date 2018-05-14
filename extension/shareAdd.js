chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('we are here')
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting == "hello")
        //send back the url
        sendResponse({farewell: "goodbye",});
        return true
    });


    
    
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            
            // var list = document.getElementsByTagName("ytd-popup-container")[0];
    
            // console.log('the answer is: ', list)
            
            // list.addEventListener('click', () => {
                //     console.log('i clicked it fam')
                // })
                     
   
    
    }
    }, 1000)