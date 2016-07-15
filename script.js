// Code goes here

var app = angular.module('metrics', [
  'charts.line'
  ]); 

app.controller('MainCtrl', function($scope) {
  
  
  $scope.metricTypes = [
      {id:'orders', name:'orders'},
      {id:'pageViews', name:'pageViews'},
      {id:'sales', name:'sales'},
      {id:'clickThruRate', name:'clickThruRate'}
  ];
  
  $scope.selectedmetric = $scope.metricTypes[0];
  $scope.chartDisplayObject = [["Date",$scope.selectedmetric.id]];
  $scope.jsonResponse = undefined;
  $scope.isJSONFileRead = false;
  
  $scope.updateMetricSelection = function(){
    
    angular.forEach($scope.jsonResponse.records, function(record){
       $scope.chartDisplayObject.push([record.date, record[$scope.selectedmetric]]);
    });
  };
  
  
  $scope.uploadJSONFile = function(){
   var reader = new FileReader();
   reader.onload = function(e) {
      $scope.$apply(function() {
          $scope.jsonResponse = JSON.parse(reader.result);
          angular.forEach($scope.jsonResponse.records, function(record){
            $scope.chartDisplayObject.push([record.date, record[$scope.selectedmetric.id]]);
          });
          if(angular.isDefined($scope.jsonResponse.records)) 
            $scope.isJSONFileRead = true;
      });
  };
  
  var jsonFileInput = document.getElementById('fileInput');    
  var jsonFile = jsonFileInput.files[0];
  
  reader.readAsText(jsonFile);
    
  };
});

angular.module('charts.line', [
])
    .directive('metricChart', [
        function() {
            return {
                restrict:'A',
                scope: {
                  metricColumn:'=', 
                  metricObject:'='
                },
                link: function(scope, element, attr, controller) {

                    var getOptions = function() {
                        return {
                          title: scope.metricColumn,
                          curveType: 'function',
                          legend: { position: 'bottom' }
                        };
                    };
                    var getDataTable = function() {
                      return google.visualization.arrayToDataTable(scope.metricObject);
                    };
                    var drawChart = function(options) {
                      var data = getDataTable();
                      var chart  = new google.visualization.LineChart(element[0]);
                      chart.draw(data, options);
                     };
                            
                    var init = function() {
                        drawChart(getOptions());
                    };

                    // Watch for changes to the directives options
                    scope.$watch('metricObject', init, true);
                    scope.$watch('metricColumn', init, true);
                }
            };
        }
    ]);
