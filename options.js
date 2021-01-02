

document.getElementById("check").addEventListener("click", function(){
    const key = "CJ7SNCCZRHAV5QGB"
   var stockName = $('#fname').val();
   if(stockName.length > 0){
    var url=`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockName}&apikey=${key}`;   
    $.get(url, function(resp, status){
        var metadata = resp["Meta Data"]
        if(metadata != null){
            var latest_date = metadata["3. Last Refreshed"];
            var data = resp["Time Series (Daily)"][latest_date]
            $('#current').text("Current Price : " + data["4. close"])
            $('#current_price').text(data["4. close"])
        }else{
            $('#current').text("Stock Not Found")
        }
      });
   }
})

document.getElementById("add").addEventListener("click", function(){
    var stockName = $('#fname').val();
    if(stockName.length == 0){
        alert("Enter Stock Name")
        return
    }
    var currentPrice = $('#current_price').text()
    if(currentPrice.length == 0){
        alert("Check Price Once")
        return
    }
    var date = $("#date").val()
    if(date.length == 0){
        alert("Enter Date")
        return
    }
    var price = $('#price').val()
    if(price.length == 0){
        alert("Enter Purchase Price")
        return
    }

    var target = $('#target').val()
    if(target.length == 0){
        alert("Enter Target Price")
        return
    }
    
    var row = '<tr>'
    row+= `<td>${stockName}</td>`
    row+= `<td>${date}</td>`
    row+= `<td>${price}</td>`
    row+= `<td>${currentPrice}</td>`
    row+= `<td>${target}</td>`
    row+= `<td align='center'><input id="delete" type=button value="Delete" style="width:100%"></td>`
    row += '<tr>'
    $('#stocks tr:last').after(row);
    $('#stocks').show()
    $('#form').trigger("reset");
    $('#current').text("")
})

document.getElementById("addall").addEventListener("click", function(){
    var table = document.getElementById('stocks');

    var rowLength = table.rows.length;

    var finalStockArray = []

    for(var i=2; i<rowLength-1; i+=1){
    var row = table.rows[i];
        var stockName = row.cells[0].innerHTML;
        var finalObj = { 
            [stockName] : { 
                    "date" : row.cells[1].innerHTML, 
                    "purchase_price" : row.cells[2].innerHTML, 
                    "price" : row.cells[3].innerHTML,
                    "target" : row.cells[4].innerHTML
                }
        }
        finalStockArray.push(stockName);
        chrome.storage.sync.set(finalObj);
    }

    chrome.storage.sync.get(['stocks'], function(result) {
        var updatedArray = result.stocks.concat(finalStockArray.filter((item) => result.stocks.indexOf(item) < 0))
        console.log(updatedArray)
        chrome.storage.sync.set({stocks : updatedArray}, function(){
            location.reload()
        });
    });

})