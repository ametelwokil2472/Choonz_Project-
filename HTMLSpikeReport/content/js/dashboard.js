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

    var data = {"OkPercent": 99.69183359013867, "KoPercent": 0.3081664098613251};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5760785824345146, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.3086734693877551, 500, 1500, "Create Request-8"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-3"], "isController": false}, {"data": [0.5535714285714286, 500, 1500, "Create Request-9"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-5"], "isController": false}, {"data": [0.07653061224489796, 500, 1500, "Create Request-7"], "isController": false}, {"data": [0.4431818181818182, 500, 1500, "Delete Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-4"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Request-7"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-5"], "isController": false}, {"data": [0.375, 500, 1500, "Delete Request-8"], "isController": false}, {"data": [0.33163265306122447, 500, 1500, "Create Request-2"], "isController": false}, {"data": [0.11989795918367346, 500, 1500, "Create Request-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-0"], "isController": false}, {"data": [0.17045454545454544, 500, 1500, "Delete Request-1"], "isController": false}, {"data": [0.03409090909090909, 500, 1500, "Delete Request-2"], "isController": false}, {"data": [0.0, 500, 1500, "Create Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2596, 8, 0.3081664098613251, 1903.5477657935314, 0, 15320, 609.0, 5285.800000000001, 11637.45, 13776.0, 121.3140800972008, 8628.67496728819, 33.44891992616477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Request", 44, 4, 9.090909090909092, 7946.136363636367, 5254, 11944, 7927.0, 10089.0, 10365.75, 11944.0, 2.8403589180814666, 1006.9844612395907, 5.137307549544897], "isController": false}, {"data": ["Create Request-8", 196, 0, 0.0, 1683.673469387756, 240, 5368, 1254.5, 3107.0, 3188.8999999999996, 4492.090000000001, 10.422205679038605, 225.8890945708816, 1.6386475725832181], "isController": false}, {"data": ["Delete Request-3", 44, 0, 0.0, 2.659090909090909, 1, 6, 2.0, 5.0, 5.75, 6.0, 5.236848369435849, 196.80628496191386, 0.910311532968341], "isController": false}, {"data": ["Create Request-9", 196, 0, 0.0, 729.6632653061226, 119, 1684, 625.0, 1141.1000000000001, 1194.3, 1638.41, 10.915571396747605, 652.4489877165015, 1.7375372438182224], "isController": false}, {"data": ["Delete Request-4", 44, 0, 0.0, 1.659090909090909, 1, 3, 2.0, 3.0, 3.0, 3.0, 5.237471729556005, 16.402902184263777, 0.8848462980597548], "isController": false}, {"data": ["Create Request-6", 196, 0, 0.0, 1.8214285714285716, 0, 36, 1.0, 3.0, 4.0, 9.81000000000003, 11.650023775558726, 54.848402951141225, 1.513137853661436], "isController": false}, {"data": ["Delete Request-5", 44, 0, 0.0, 1.340909090909091, 0, 3, 1.0, 2.0, 3.0, 3.0, 5.238095238095238, 6.368582589285714, 0.8849516369047619], "isController": false}, {"data": ["Create Request-7", 196, 0, 0.0, 3242.0969387755113, 739, 8364, 3243.5, 5084.9, 5193.549999999999, 8353.33, 10.01993763100046, 712.9328606666326, 1.3796984433311181], "isController": false}, {"data": ["Delete Request-6", 44, 4, 9.090909090909092, 921.2499999999999, 60, 2936, 952.0, 1129.5, 1378.75, 2936.0, 3.8817820908689895, 251.9787990736656, 0.6409902955447728], "isController": false}, {"data": ["Create Request-4", 196, 0, 0.0, 3.770408163265307, 1, 51, 3.0, 5.0, 8.0, 24.81000000000003, 11.648639011054321, 437.7681397093783, 1.5129579965529538], "isController": false}, {"data": ["Delete Request-7", 44, 0, 0.0, 1024.9545454545457, 550, 1211, 1056.0, 1110.5, 1184.75, 1211.0, 3.9618224383216276, 85.86785858995138, 0.7970072483342338], "isController": false}, {"data": ["Create Request-5", 196, 0, 0.0, 1.8112244897959198, 0, 16, 1.0, 3.0, 4.0, 9.210000000000008, 11.649331352154531, 14.163493684992572, 1.4561664190193166], "isController": false}, {"data": ["Delete Request-8", 44, 0, 0.0, 1330.7272727272734, 622, 2229, 1109.0, 2186.0, 2209.5, 2229.0, 4.022673249222892, 240.44615103309562, 0.8171055037484001], "isController": false}, {"data": ["Create Request-2", 196, 0, 0.0, 1661.862244897959, 168, 3388, 1212.0, 3196.2, 3283.15, 3354.05, 15.359297860669226, 482.4416189953766, 2.519884805266045], "isController": false}, {"data": ["Create Request-3", 196, 0, 0.0, 3481.0765306122453, 344, 8016, 4094.5, 5395.3, 5438.0, 7992.72, 11.262426018502557, 1775.9767981813482, 1.8147463799344943], "isController": false}, {"data": ["Create Request-0", 196, 0, 0.0, 4.693877551020404, 2, 45, 3.0, 7.0, 15.0, 33.360000000000014, 20.29615822719271, 95.6337533654344, 2.61630164647406], "isController": false}, {"data": ["Create Request-1", 196, 0, 0.0, 2.9285714285714284, 1, 98, 2.0, 4.0, 6.0, 23.310000000000088, 20.444351726296027, 31.28544839365808, 2.595474340252425], "isController": false}, {"data": ["Delete Request-0", 44, 0, 0.0, 8.840909090909093, 1, 48, 3.0, 26.5, 40.25, 48.0, 9.854423292273236, 32.652400615901456, 1.6937290033594625], "isController": false}, {"data": ["Delete Request-1", 44, 0, 0.0, 1927.6363636363637, 1088, 3111, 1550.5, 2595.0, 3005.5, 3111.0, 5.822416302765648, 30.482396288209607, 2.041257278020378], "isController": false}, {"data": ["Delete Request-2", 44, 0, 0.0, 2725.159090909092, 1423, 5496, 2409.0, 4913.5, 5301.25, 5496.0, 4.4538920943415325, 702.3338845341128, 0.9133958396598847], "isController": false}, {"data": ["Create Request", 196, 0, 0.0, 10831.673469387752, 3176, 15320, 12568.0, 13816.9, 13939.499999999998, 15304.48, 9.159306509649985, 3585.369013665942, 13.00549967288191], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 4, 50.0, 0.15408320493066255], "isController": false}, {"data": ["Assertion failed", 4, 50.0, 0.15408320493066255], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2596, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 4, "Assertion failed", 4, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete Request", 44, 4, "Assertion failed", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Request-6", 44, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 4, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
