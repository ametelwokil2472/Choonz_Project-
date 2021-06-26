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

    var data = {"OkPercent": 99.92383853769992, "KoPercent": 0.07616146230007616};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5752749336367083, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Delete Request-3"], "isController": false}, {"data": [0.5, 500, 1500, "Update Request-8"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-4"], "isController": false}, {"data": [0.5, 500, 1500, "Update Request-7"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-5"], "isController": false}, {"data": [0.5, 500, 1500, "Update Request-6"], "isController": false}, {"data": [0.375, 500, 1500, "Delete Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Update Request-5"], "isController": false}, {"data": [0.5138888888888888, 500, 1500, "Delete Request-7"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "Delete Request-8"], "isController": false}, {"data": [0.0, 500, 1500, "Update Request"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.0, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.24744897959183673, 500, 1500, "Create Request-8"], "isController": false}, {"data": [0.5867346938775511, 500, 1500, "Create Request-9"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-6"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "Create Request-7"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-5"], "isController": false}, {"data": [0.336734693877551, 500, 1500, "Create Request-2"], "isController": false}, {"data": [0.11479591836734694, 500, 1500, "Create Request-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Update Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Update Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Update Request-3"], "isController": false}, {"data": [0.2361111111111111, 500, 1500, "Delete Request-1"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "Update Request-2"], "isController": false}, {"data": [0.09722222222222222, 500, 1500, "Delete Request-2"], "isController": false}, {"data": [0.5, 500, 1500, "Update Request-1"], "isController": false}, {"data": [0.0, 500, 1500, "Create Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2626, 2, 0.07616146230007616, 1908.838918507236, 0, 15394, 656.5, 5384.200000000001, 11824.150000000003, 13679.73, 123.61137262285823, 8812.831619368999, 33.804673525466015], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Request-3", 36, 0, 0.0, 2.7499999999999996, 1, 8, 3.0, 3.0, 4.599999999999994, 8.0, 3.8159847360610555, 143.4087310525758, 0.6633254716981133], "isController": false}, {"data": ["Update Request-8", 11, 0, 0.0, 1076.6363636363637, 984, 1208, 1041.0, 1201.4, 1208.0, 1208.0, 2.725470763131814, 162.9059170589693, 0.4338395843657087], "isController": false}, {"data": ["Delete Request-4", 36, 0, 0.0, 1.3611111111111114, 0, 2, 1.0, 2.0, 2.0, 2.0, 3.817198600360513, 11.954839757183757, 0.6448978104124695], "isController": false}, {"data": ["Update Request-7", 11, 0, 0.0, 1115.6363636363637, 998, 1247, 1047.0, 1246.2, 1247.0, 1247.0, 2.662793512466715, 57.712928921568626, 0.4186618706124425], "isController": false}, {"data": ["Delete Request-5", 36, 0, 0.0, 2.333333333333333, 0, 22, 1.0, 2.0, 18.599999999999994, 22.0, 3.8167938931297707, 4.6405355438931295, 0.6448294370229007], "isController": false}, {"data": ["Update Request-6", 11, 0, 0.0, 1120.5454545454545, 925, 1240, 1176.0, 1239.2, 1240.0, 1240.0, 2.6875152699731246, 191.22253313584167, 0.3700582549474713], "isController": false}, {"data": ["Delete Request-6", 36, 1, 2.7777777777777777, 1344.5555555555557, 123, 3495, 803.5, 3280.3, 3481.4, 3495.0, 2.866013852400287, 198.45901998248547, 0.5061238655361834], "isController": false}, {"data": ["Update Request-5", 11, 0, 0.0, 0.9090909090909091, 0, 2, 1.0, 1.8000000000000007, 2.0, 2.0, 3.47112653834017, 4.2202661525717895, 0.43389081729252127], "isController": false}, {"data": ["Delete Request-7", 36, 0, 0.0, 826.0277777777777, 490, 1128, 828.0, 1062.0, 1085.5, 1128.0, 2.9230269568041574, 63.353183866515096, 0.5880308135758363], "isController": false}, {"data": ["Delete Request-8", 36, 0, 0.0, 971.3333333333335, 736, 1757, 822.0, 1411.5000000000007, 1549.5999999999997, 1757.0, 2.919944845486252, 174.53442784796007, 0.5931137967393949], "isController": false}, {"data": ["Update Request", 11, 0, 0.0, 6240.909090909091, 5018, 6732, 6381.0, 6725.8, 6732.0, 6732.0, 1.401988274279888, 505.63732714121846, 1.9427942980499617], "isController": false}, {"data": ["Transaction Controller", 11, 0, 0.0, 14606.90909090909, 12576, 15969, 14838.0, 15904.800000000001, 15969.0, 15969.0, 0.6795156906350384, 756.2156019312146, 3.146741606436867], "isController": true}, {"data": ["Delete Request", 36, 1, 2.7777777777777777, 7816.833333333334, 4417, 12708, 7332.0, 12565.4, 12621.3, 12708.0, 2.2546502160706456, 809.1090339645832, 4.1038010036324915], "isController": false}, {"data": ["Create Request-8", 196, 0, 0.0, 1782.4132653061226, 203, 5686, 1535.5, 2984.5000000000005, 3337.8999999999996, 3615.0500000000025, 10.245151847786316, 222.05166026344676, 1.6108100073179656], "isController": false}, {"data": ["Create Request-9", 196, 0, 0.0, 736.0204081632648, 92, 1409, 693.0, 1290.2, 1351.4499999999998, 1388.63, 10.86534730306558, 649.4474103851377, 1.7295425882809468], "isController": false}, {"data": ["Create Request-6", 196, 0, 0.0, 1.4489795918367347, 0, 20, 1.0, 2.0, 2.0, 9.330000000000013, 10.834715312327253, 51.00992433665008, 1.4072432974018796], "isController": false}, {"data": ["Create Request-7", 196, 0, 0.0, 3233.882653061225, 655, 7610, 3130.0, 5154.900000000001, 5342.15, 7116.27, 9.91852639036486, 705.7196782804514, 1.3657345908607865], "isController": false}, {"data": ["Create Request-4", 196, 0, 0.0, 3.8418367346938784, 1, 28, 3.0, 4.300000000000011, 11.149999999999977, 25.090000000000003, 10.832918808378931, 407.11251416293595, 1.407009962416404], "isController": false}, {"data": ["Create Request-5", 196, 0, 0.0, 1.801020408163266, 0, 56, 1.0, 2.0, 2.1499999999999773, 13.32000000000005, 10.83411641147532, 13.1723388010613, 1.354264551434415], "isController": false}, {"data": ["Create Request-2", 196, 0, 0.0, 1651.081632653061, 181, 3624, 1466.5, 2832.9, 3243.3, 3478.5, 15.088529638183218, 473.9445005773672, 2.475461893764434], "isController": false}, {"data": ["Create Request-3", 196, 0, 0.0, 3578.224489795918, 228, 7806, 3873.0, 5496.2, 5682.799999999999, 7588.72, 10.57515916693644, 1667.6097708097282, 1.704005139203626], "isController": false}, {"data": ["Create Request-0", 196, 0, 0.0, 4.265306122448977, 1, 66, 3.0, 6.0, 8.149999999999977, 37.87000000000003, 20.298260149130076, 95.64365744096933, 2.6165725973487985], "isController": false}, {"data": ["Update Request-0", 11, 0, 0.0, 2.272727272727273, 2, 3, 2.0, 3.0, 3.0, 3.0, 9.85663082437276, 32.65971522177419, 1.2609557011648744], "isController": false}, {"data": ["Create Request-1", 196, 0, 0.0, 2.4693877551020402, 1, 16, 2.0, 4.0, 7.0, 13.090000000000003, 20.455019828845753, 31.30177350761845, 2.5968286892089334], "isController": false}, {"data": ["Update Request-4", 11, 0, 0.0, 1.3636363636363635, 1, 2, 1.0, 2.0, 2.0, 2.0, 3.47112653834017, 10.498123915272958, 0.43389081729252127], "isController": false}, {"data": ["Delete Request-0", 36, 0, 0.0, 3.944444444444444, 1, 15, 3.0, 8.900000000000013, 12.449999999999996, 15.0, 7.274196807435846, 24.102880632451, 1.250252576278036], "isController": false}, {"data": ["Update Request-3", 11, 0, 0.0, 2.272727272727273, 1, 3, 2.0, 3.0, 3.0, 3.0, 3.468937243771681, 130.36632026568907, 0.450555325607064], "isController": false}, {"data": ["Delete Request-1", 36, 0, 0.0, 1760.5555555555554, 1129, 2834, 1713.5, 2413.9, 2730.2999999999997, 2834.0, 4.629034332004629, 24.234622122926577, 1.622874341005529], "isController": false}, {"data": ["Update Request-2", 11, 0, 0.0, 2112.5454545454545, 823, 2626, 2323.0, 2610.6, 2626.0, 2626.0, 2.755511022044088, 434.51527077592687, 0.44400324085671344], "isController": false}, {"data": ["Delete Request-2", 36, 0, 0.0, 2902.555555555555, 933, 5823, 2276.0, 5699.200000000001, 5784.75, 5823.0, 3.4735623311462756, 547.7533785821112, 0.7123516499421072], "isController": false}, {"data": ["Update Request-1", 11, 0, 0.0, 807.6363636363637, 664, 995, 804.0, 988.0, 995.0, 995.0, 5.218216318785579, 27.319196958017077, 1.3708009665559773], "isController": false}, {"data": ["Create Request", 196, 0, 0.0, 11007.41836734694, 2946, 15394, 12498.0, 13765.9, 13840.5, 15324.16, 9.226134437958953, 3611.543167335483, 13.100390110148748], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, 50.0, 0.03808073115003808], "isController": false}, {"data": ["Assertion failed", 1, 50.0, 0.03808073115003808], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2626, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, "Assertion failed", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Request-6", 36, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Request", 36, 1, "Assertion failed", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
