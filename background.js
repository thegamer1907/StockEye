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

const key = "CJ7SNCCZRHAV5QGB"

function doGetCall(stockName,index){
    var url=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockName}&apikey=${key}`;
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET",url);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(xhttp.responseText)
            var latest_date = resp["Meta Data"]["3. Last Refreshed"];
            var data = resp["Time Series (Daily)"][latest_date]
            chrome.storage.sync.get([stockName], function(result) {
                var updatedStock = result[stockName]
                var price = data["4. close"]
                updatedStock["price"] = price
                console.log("firing notification")
                chrome.notifications.create(stockName, {
                    title: 'Stock Price Update',
                    message: `${stockName} crossed the target price Rs.${updatedStock.target}. Current Price : Rs.${price}`,
                    type: 'basic',
                    iconUrl : 'icon.png'
                });
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