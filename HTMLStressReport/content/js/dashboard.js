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

    var data = {"OkPercent": 99.7697620874904, "KoPercent": 0.23023791250959325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.554489639293937, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "Delete Request"], "isController": false}, {"data": [0.15816326530612246, 500, 1500, "Create Request-8"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-3"], "isController": false}, {"data": [0.5867346938775511, 500, 1500, "Create Request-9"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-5"], "isController": false}, {"data": [0.015306122448979591, 500, 1500, "Create Request-7"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "Delete Request-6"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-4"], "isController": false}, {"data": [0.6888888888888889, 500, 1500, "Delete Request-7"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-5"], "isController": false}, {"data": [0.5, 500, 1500, "Delete Request-8"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "Create Request-2"], "isController": false}, {"data": [0.08163265306122448, 500, 1500, "Create Request-3"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-0"], "isController": false}, {"data": [1.0, 500, 1500, "Create Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Request-0"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Request-1"], "isController": false}, {"data": [0.0, 500, 1500, "Delete Request-2"], "isController": false}, {"data": [0.0, 500, 1500, "Create Request"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2606, 6, 0.23023791250959325, 2056.923637759019, 0, 15735, 689.5, 5896.6, 12643.2, 13945.389999999996, 118.6270939548434, 8444.289972203887, 32.76525443258376], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete Request", 45, 3, 6.666666666666667, 10476.444444444443, 6985, 13608, 9139.0, 13377.4, 13508.6, 13608.0, 3.1955688112484024, 1138.229363615786, 5.79384087398807], "isController": false}, {"data": ["Create Request-8", 196, 0, 0.0, 1950.9285714285718, 294, 5892, 1739.5, 3087.5, 3366.0499999999956, 5493.330000000001, 11.12498580996708, 241.1210303382904, 1.7491432767624022], "isController": false}, {"data": ["Delete Request-3", 45, 0, 0.0, 3.422222222222222, 1, 6, 3.0, 5.0, 5.0, 6.0, 8.925029750099167, 335.41203112604126, 1.551421187028957], "isController": false}, {"data": ["Create Request-9", 196, 0, 0.0, 797.5867346938769, 110, 1476, 756.0, 1217.3000000000002, 1349.7999999999997, 1466.3, 12.11671612265084, 724.244552597212, 1.9287350859297727], "isController": false}, {"data": ["Delete Request-4", 45, 0, 0.0, 2.111111111111112, 1, 7, 2.0, 3.3999999999999986, 4.0, 7.0, 8.926800238048006, 27.957273792402297, 1.5081410558420947], "isController": false}, {"data": ["Create Request-6", 196, 0, 0.0, 3.7295918367346896, 0, 54, 2.0, 6.300000000000011, 13.0, 40.420000000000016, 11.180832857957787, 52.63944844552196, 1.4521980176839702], "isController": false}, {"data": ["Delete Request-5", 45, 0, 0.0, 2.022222222222222, 1, 5, 2.0, 3.3999999999999986, 4.0, 5.0, 8.932115919015482, 10.859847967943628, 1.5090391152242952], "isController": false}, {"data": ["Create Request-7", 196, 0, 0.0, 3445.6683673469383, 1437, 8725, 3194.0, 5225.5, 5531.949999999996, 8682.32, 10.1444024636406, 721.7972025257492, 1.396836667356762], "isController": false}, {"data": ["Delete Request-6", 45, 3, 6.666666666666667, 2243.688888888889, 85, 3917, 1428.0, 3875.2, 3898.6, 3917.0, 5.417118093174431, 360.6509852383532, 0.9183708017334777], "isController": false}, {"data": ["Create Request-4", 196, 0, 0.0, 7.765306122448977, 1, 206, 4.0, 13.0, 27.0, 159.44000000000005, 11.171910624715002, 419.8521841512768, 1.4510391729366166], "isController": false}, {"data": ["Delete Request-7", 45, 0, 0.0, 797.1555555555557, 445, 1249, 885.0, 1197.2, 1235.3999999999999, 1249.0, 5.968169761273209, 129.35308562665782, 1.200627901193634], "isController": false}, {"data": ["Create Request-5", 196, 0, 0.0, 3.3367346938775535, 0, 56, 2.0, 6.0, 9.0, 33.690000000000026, 11.176369960654615, 13.588457618178708, 1.397046245081827], "isController": false}, {"data": ["Delete Request-8", 45, 0, 0.0, 908.5777777777778, 593, 1159, 917.0, 1075.6, 1146.8, 1159.0, 6.1091501493347815, 365.15164692506113, 1.2409211240836275], "isController": false}, {"data": ["Create Request-2", 196, 0, 0.0, 1542.0306122448976, 147, 4448, 1382.0, 2616.6000000000004, 3410.5499999999997, 3726.3200000000006, 14.280510018214937, 448.55931238615665, 2.342896174863388], "isController": false}, {"data": ["Create Request-3", 196, 0, 0.0, 3486.2448979591827, 429, 8442, 3038.5, 5717.6, 5926.15, 8388.65, 10.706872063804216, 1688.3720565490821, 1.7252284087184528], "isController": false}, {"data": ["Create Request-0", 196, 0, 0.0, 11.306122448979593, 1, 160, 5.0, 24.600000000000023, 39.59999999999991, 140.60000000000002, 20.32351721277478, 95.7626665543343, 2.6198283907092494], "isController": false}, {"data": ["Create Request-1", 196, 0, 0.0, 6.372448979591834, 1, 54, 3.0, 15.300000000000011, 26.299999999999955, 51.09, 20.51711504239506, 31.396796163508842, 2.60471187061656], "isController": false}, {"data": ["Delete Request-0", 45, 0, 0.0, 13.444444444444443, 2, 70, 7.0, 32.4, 58.999999999999915, 70.0, 17.051913603637743, 56.50111607142858, 2.930797650625237], "isController": false}, {"data": ["Delete Request-1", 45, 0, 0.0, 2244.0888888888885, 1747, 3614, 2070.0, 3147.3999999999996, 3474.499999999999, 3614.0, 7.215007215007215, 37.7730992965368, 2.5294800685425685], "isController": false}, {"data": ["Delete Request-2", 45, 0, 0.0, 4259.822222222222, 1711, 6680, 4614.0, 6596.8, 6620.3, 6680.0, 6.620567897601884, 1044.0046504891864, 1.3577336508753863], "isController": false}, {"data": ["Create Request", 196, 0, 0.0, 11283.591836734695, 5586, 15735, 12832.5, 13980.3, 14170.599999999997, 15715.6, 8.922068463219228, 3492.5134357360707, 12.668640181172615], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, 50.0, 0.11511895625479662], "isController": false}, {"data": ["Assertion failed", 3, 50.0, 0.11511895625479662], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2606, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, "Assertion failed", 3, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete Request", 45, 3, "Assertion failed", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Request-6", 45, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: code.jquery.com:443 failed to respond", 3, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
