chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({stocks: []});

      chrome.storage.onChanged.addListener(function(changes, namespace) {
          var storageChange = changes["stocks"];
          if(storageChange != null){
            storageChange.newValue.forEach(doGetCall)
          }        
      });
     chrome.alarms.create('fetch_stocks', { periodInMinutes: 1 });
});



function doGetCall(stockName){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET",stockName);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var el = $( '<div></div>' );
            el.html(xhttp.responseText)
            var divs = $(el).find('.D\\(ib\\).Mend\\(20px\\)')
            var price = 0
            for(var i=0;i< divs["length"]; i++){
                if($(divs[i]).attr('class') == "D(ib) Mend(20px)"){
                    var span = $(divs[i]).find('span')[0]
                    price = $(span).text()
                    break;
                }
            }
            chrome.storage.sync.get([stockName], function(result) {
                var updatedStock = result[stockName]
                updatedStock["price"] = price
                var d = new Date()
                chrome.storage.sync.set({["last_updated"] : `${d.toDateString()} ${d.toLocaleTimeString()}`});
                if(parseFloat(price.replace(',', '')) >= parseFloat(updatedStock.target)){
                    chrome.notifications.create(`${stockName}_${updatedStock.target}`, {
                        title: 'Stock Price Update',
                        message: `${updatedStock.display} crossed the target price Rs.${updatedStock.target}. Current Price : Rs.${price}`,
                        type: 'basic',
                        iconUrl : 'icon.png'
                    });
                }
                chrome.storage.sync.set({ [stockName] : updatedStock});
            });
        }
    };
}


chrome.alarms.onAlarm.addListener((alarm) => {
    if(alarm.name == 'fetch_stocks'){
        fetch_stocks()
    }
  });


  function fetch_stocks() {
    chrome.storage.sync.get(['stocks'], function(result) {
        result.stocks.forEach(doGetCall)
      });
  }