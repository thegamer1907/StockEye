
function updateTable(stockName,index){
    // console.log(index)
    // console.log(stockName)
    chrome.storage.sync.get([stockName], function(result){
        loadTable(stockName,result[stockName])
    });
}

function loadTable(stockName, data) {
   
    var row = '<tr>'
    row+= `<td hidden>${stockName}</td>`
    row+= `<td>${data.display}</td>`
    row+= `<td>${data.date}</td>`
    row+= `<td>${data.purchase_price}</td>`
    row+= `<td>${data.price}</td>`
    row+= `<td>${data.target}</td>`
    row+= `<td align='center'><input class="delete" type=button value="Delete" style="width:100%"></td>`
    row += '</tr>'
    $('#stocks').append(row);
    $(".delete").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        var par = $(this).parent().parent();
        // console.log(par)
        par.remove()
    });
}

$(document).ready(function(e) { 
    chrome.storage.sync.get(['stocks'], function(result) {
        result.stocks.forEach(updateTable)
        $('#stocks').show()
    });
});


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


function dateToYMD(date) {
    var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
}

document.getElementById("add").addEventListener("click", function(){
    var stockName = $('#fname').val();
    if(stockName.length == 0){
        alert("Enter Stock Name")
        return
    }

    var displayName = $('#dname').val();
    if(displayName.length == 0){
        alert("Enter Stock Display Name")
        return
    }
    var currentPrice = $('#current_price').text()
    if(currentPrice.length == 0){
        alert("Check Price Once")
        return
    }
    var inp = $("#date").val()
    if(inp.length == 0){
        alert("Enter Date")
        return
    }
    var d = Date.parse(inp)
    var date = dateToYMD(new Date(d))
    
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
    row+= `<td hidden>${stockName}</td>`
    row+= `<td>${displayName}</td>`
    row+= `<td>${date}</td>`
    row+= `<td>${price}</td>`
    row+= `<td>${currentPrice}</td>`
    row+= `<td>${target}</td>`
    row+= `<td align='center'><input class="delete" type=button value="Delete" style="width:100%"></td>`
    row += '</tr>'
    $('#stocks').prepend(row);
    $('#stocks').show()
    $('#form').trigger("reset");
    $('#current').text("")
    $(".delete").on('click', function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();
        var par = $(this).parent().parent();
        // console.log(par)
        par.remove()
    });
})


document.getElementById("addall").addEventListener("click", function(){
    var table = document.getElementById('stocks');

    var rowLength = table.rows.length;

    var finalStockArray = []

    for(var i=1; i<rowLength; i+=1){
        var row = table.rows[i];
        if(row.cells.length > 0){
            var stockName = row.cells[0].innerHTML;
            var finalObj = { 
                [stockName] : { 
                        "display" : row.cells[1].innerHTML, 
                        "date" : row.cells[2].innerHTML, 
                        "purchase_price" : row.cells[3].innerHTML, 
                        "price" : row.cells[4].innerHTML,
                        "target" : row.cells[5].innerHTML
                    }
            }
            finalStockArray.push(stockName);
            chrome.storage.sync.set(finalObj);
        }
    }

    chrome.storage.sync.set({stocks : finalStockArray}, function(){
        location.reload()
    });
})