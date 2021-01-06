var stockDetails = []



function updateTable(stockName,index){
    chrome.storage.sync.get([stockName], function(result){
        loadTable(stockName,result[stockName])
    });
}

function loadTable(stockName, data) {
    var row = '<tr>'
    row+= `<td>${data.display}</td>`
    row+= `<td>${data.date}</td>`
    row+= `<td>${data.purchase_price}</td>`
    row+= `<td>${data.price}</td>`
    row+= `<td>${data.target}</td>`
    row += '</tr>'
    $('#stocks').append(row);
}

$(document).ready(function(e) { 
    chrome.storage.sync.get(['stocks'], function(result) {
        result.stocks.forEach(updateTable)
    });

    chrome.storage.sync.get(["last_updated"], function(result){
        document.getElementById("updated").innerText = "Last Updated : " + result["last_updated"]
    })
});


document.getElementById("options").addEventListener("click", function(){
    chrome.runtime.openOptionsPage()
})