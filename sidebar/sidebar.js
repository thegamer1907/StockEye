var stockDetails = []



function updateTable(stockName,index){
    chrome.storage.sync.get([stockName], function(result){
        loadTable(stockName,result[stockName])
    });
}

function loadTable(stockName, data) {
    // chrome.extension.getBackgroundPage().console.log(data);    
    var row = '<tr>'
    row+= `<td>${stockName}</td>`
    row+= `<td>${data.date}</td>`
    row+= `<td>${data.purchase_price}</td>`
    row+= `<td>${data.price}</td>`
    row+= `<td>${data.target}</td>`
    row += '<tr>'
    $('#stocks tr:last').after(row);
}

$(document).ready(function(e) { 
    chrome.storage.sync.get(['stocks'], function(result) {
        result.stocks.forEach(updateTable)
    });
});


document.getElementById("options").addEventListener("click", function(){
    chrome.runtime.openOptionsPage()
})