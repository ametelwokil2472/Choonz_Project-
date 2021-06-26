/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.84939759036145, "KoPercent": 0.15060240963855423};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5777484939759037, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.29846938775510207, 500, 1500, "Create Request-8"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-3"], "isController": false}, {"data": [0.5739795918367347, 500, 1500, "Create Request-9"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-5"], "isController": false}, {"data": [0.07908163265306123, 500, 1500, "Create Request-7"], "isController": false}, {"data": [0.45, 500, 1500, "Delete Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-4"], "isController": false}, {"data": [0.51, 500, 1500, "Delete Request-7"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-5"], "isController": false}, {"data": [0.38, 500, 1500, "Delete Request-8"], "isController": false}, {"data": [0.32908163265306123, 500, 1500, "Create Request-2"], "isController": false}, {"data": [0.1326530612244898, 500, 1500, "Create Request-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-0"], "isController": false}, {"data": [0.21, 500, 1500, "Delete Request-1"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Request-2"], "isController": false}, {"data": [0.0, 500, 1500, "Create Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2656, 4, 0.15060240963855423, 1935.6603915662645, 0, 15174, 687.5, 5552.6, 10662.300000000003, 13868.86, 123.05981559560765, 8768.451117488301, 34.21221997637029], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Request", 50, 2, 4.0, 8394.960000000001, 6261, 10656, 8533.0, 9915.7, 10638.9, 10656.0, 3.3147706178732435, 1186.7572194668192, 6.026019913484487], "isController": false}, {"data": ["Create Request-8", 196, 0, 0.0, 1702.8724489795925, 96, 5806, 1371.5, 3262.0, 3455.4499999999994, 5723.55, 10.64465323412806, 230.710384646717, 1.6736222370064628], "isController": false}, {"data": ["Delete Request-3", 50, 0, 0.0, 3.2399999999999998, 2, 8, 3.0, 4.0, 6.449999999999996, 8.0, 5.808550185873606, 218.29144219040427, 1.0096893877788105], "isController": false}, {"data": ["Create Request-9", 196, 0, 0.0, 755.5306122448975, 118, 1531, 691.5, 1214.7000000000003, 1324.15, 1422.3600000000001, 11.287721723105276, 674.6944558425478, 1.7967760164708593], "isController": false}, {"data": ["Delete Request-4", 50, 0, 0.0, 1.5800000000000003, 0, 6, 1.0, 2.0, 3.349999999999987, 6.0, 5.809225049378413, 18.193539778668526, 0.981441341350064], "isController": false}, {"data": ["Create Request-6", 196, 0, 0.0, 1.7346938775510201, 0, 24, 2.0, 2.0, 3.0, 5.570000000000022, 10.838909472985677, 51.02967047779683, 1.4077880467842727], "isController": false}, {"data": ["Delete Request-5", 50, 0, 0.0, 1.5200000000000005, 1, 3, 1.0, 2.0, 2.4499999999999957, 3.0, 5.809900069718801, 7.063794518359284, 0.9815553828724146], "isController": false}, {"data": ["Create Request-7", 196, 0, 0.0, 3183.209183673469, 960, 7554, 2745.5, 5480.2, 5576.999999999999, 7462.82, 9.99948982194786, 711.4827527932249, 1.37688287587368], "isController": false}, {"data": ["Delete Request-6", 50, 2, 4.0, 1103.8600000000001, 48, 2526, 1051.5, 1232.8999999999999, 2100.1, 2526.0, 4.49195939268709, 307.2784481403288, 0.7832854190998113], "isController": false}, {"data": ["Create Request-4", 196, 0, 0.0, 3.6122448979591835, 1, 14, 3.0, 6.0, 7.149999999999977, 13.030000000000001, 10.83411641147532, 407.1575213503952, 1.4071655104748217], "isController": false}, {"data": ["Delete Request-7", 50, 0, 0.0, 1123.3600000000004, 380, 1351, 1110.0, 1290.8, 1305.4499999999998, 1351.0, 4.719207173194904, 102.28328515809343, 0.9493717555450684], "isController": false}, {"data": ["Create Request-5", 196, 0, 0.0, 1.7193877551020416, 0, 6, 2.0, 3.0, 4.0, 5.030000000000001, 10.837111578016145, 13.175980385380958, 1.3546389472520182], "isController": false}, {"data": ["Delete Request-8", 50, 0, 0.0, 1360.2600000000002, 228, 2400, 1209.5, 2182.5, 2355.2, 2400.0, 5.127679212388473, 306.4917019728746, 1.0415598400164086], "isController": false}, {"data": ["Create Request-2", 196, 0, 0.0, 1757.081632653061, 202, 6614, 1373.5, 3352.9, 3407.499999999999, 6610.12, 12.409775864252248, 389.8023972711156, 2.0359788527288845], "isController": false}, {"data": ["Create Request-3", 196, 0, 0.0, 3550.9081632653056, 496, 8040, 3833.5, 5668.9, 5796.65, 7854.7300000000005, 10.45221843003413, 1648.22372071979, 1.6841953524957338], "isController": false}, {"data": ["Create Request-0", 196, 0, 0.0, 5.0153061224489806, 1, 75, 3.0, 8.0, 12.449999999999932, 35.23000000000005, 20.39117769454848, 96.08147692987932, 2.62855024968789], "isController": false}, {"data": ["Create Request-1", 196, 0, 0.0, 2.9132653061224505, 1, 39, 2.0, 4.0, 6.0, 28.330000000000013, 20.52141137053712, 31.403370720343418, 2.60525730290022], "isController": false}, {"data": ["Delete Request-0", 50, 0, 0.0, 4.099999999999999, 1, 21, 3.0, 9.0, 16.04999999999996, 21.0, 10.815487778498811, 35.836865266061, 1.858911961929483], "isController": false}, {"data": ["Delete Request-1", 50, 0, 0.0, 2041.04, 1191, 3423, 1733.0, 3185.2, 3408.9, 3423.0, 6.233636703652911, 32.63527965652661, 2.1854253677845654], "isController": false}, {"data": ["Delete Request-2", 50, 0, 0.0, 2754.48, 1557, 4727, 2454.0, 4086.1, 4624.549999999999, 4727.0, 4.911108928396032, 774.4387139647383, 1.0071610107062174], "isController": false}, {"data": ["Create Request", 196, 0, 0.0, 10982.821428571431, 3923, 15174, 12735.5, 13916.5, 14269.449999999999, 15112.89, 9.081221331603576, 3554.8206614436135, 12.894624820460548], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 2, 50.0, 0.07530120481927711], "isController": false}, {"data": ["Assertion failed", 2, 50.0, 0.07530120481927711], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2656, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 2, "Assertion failed", 2, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete Request", 50, 2, "Assertion failed", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Request-6", 50, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 2, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
