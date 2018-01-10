angular.module('viz', []);



angular.module('viz').controller('studentScatter', ['$scope','$window',

  function ($scope, $window) {
 
    $scope.d3Data = [[{x: 5, y:67, active: false}, {x:25, y: 96, active: false}, {x:45, y:50, active: false}, {x:65, y: 49, active: false}, {x:85, y:47, active: false}], [{x: 5, y: 28, active: false}, {x: 25, y: 39, active: false}, {x: 45, y: 99, active: false}, {x: 65, y: 77, active: false}, {x: 85, y: 69, active: false}]]
    $scope.activeStudent = 0;


    $window.addEventListener('resize', function () {
      $scope.$broadcast('windowResize');
    });


    $scope.$on('graphClick', function(){

      var studentDataset = $scope.d3Data[arguments[3]];
    
      if($scope.activeStudent === arguments[3]){
        $scope.activeStudent = undefined;

      }
      else{

        $scope.activeStudent = arguments[3];


      }
    })

  }
]);  



angular.module('viz').directive('scatterChart', [

  function () {

    var link = function ($scope, $el, $attrs) {
      var margin = {top: 40, right: 40, bottom: 40, left: 40};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      var svg = d3.select($el[0]).append("svg")
        .attr({width: width, height: height})
        .attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.top + margin.bottom));

      var chart = svg.append("g");

      chart.append("text").attr("id", "loading")
        .text("Loading...")
        .attr("transform", "translate(200,250)");

      var update = function () {
        var data = $scope.d3Data;

       


        var valueline = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .interpolate("linear");

        chart.selectAll("*").remove();
        
  


        if (data.length) chart.select("#loading").remove();

        var x = d3.scale.linear().domain([0,100]).range([0,width])//.range([0,width])//.domain([0,width])
           


        var y = d3.scale.linear().domain([0,100]).range([height, 0])//.range([height,0]//.range([height, 0])
                 
    
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .innerTickSize(-height)
            .outerTickSize(0)
            .tickPadding(10)
            //.orient("bottom")
            

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10)


        var yAxisGrid = yAxis.ticks(6)
        var xAxisGrid = xAxis.ticks(6)//.tickFormat("").orient("top")
        var selection = chart.selectAll(".series").data(data, function (d, i) { return i })
          




      var SVG2 = selection.enter().append("g")

     chart.append("g")
     .classed('x', true)
     .classed('grid', true)
     .call(xAxisGrid);

     chart.append("g")
     .classed('y', true)
     .classed('grid', true)
     .call(yAxisGrid)

   chart.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis); 
      
 chart.append("g")
        .attr("class", "yaxis")
        .call(yAxis);



      SVG2.append("path")
      .attr("class","line")
      .attr("stroke", "black")
      .attr("stroke-width", function(d, idx){

        if(idx === $scope.activeStudent){
            return 3;
        }
        else{
            return 0;
        }

      } )
      .attr("fill", "none")
      .attr("d", function(d){
   
        return valueline(d)
      })  

      var enter1 = SVG2.attr("class", function(d,i){return i})

      var enter2 = enter1.selectAll(".point")
      .data(function(d){return d;})





          var enter3 = enter2.enter()


          var circle = enter3.append("circle")
          .on("click", function(a,b,c){
                  console.log(a,b,c,"abc")
                 $scope.$emit('graphClick', a, b, c)
                 $scope.$apply(update)
           
          })
          .attr("class", "point")
        .attr("r", 5)
        .attr("fill", function(d, idx, dataIdx){
          if(dataIdx === $scope.activeStudent){
            return "red";

          }
          else{
            return "blue";
          }
        })
        .attr("cx", function(d){ return x(d.x);})
        .attr("cy", function(d) { return y(d.y);})
/*
        circle.append("rect")
        .attr("x", function(a,b,c){ console.log(a,b,c,"abc in rectangle append");return x(a.x) - 20})
       .attr("y", function(d){return y(d.y) - 40})
       .attr("width", 40)
       .attr("height", 20)
       .attr("fill","gray")
       .attr("opacity", function(d, idx, dataIdx){
         if(dataIdx === $scope.activeStudent){
            return 1;

          }
          else{
            return 0;
          }
        })
*/
       var label = enter1.selectAll(".label")
       .data(function(d){return d;})
       .enter()

       label.append("rect")
       .attr("x", function(d){ return x(d.x) - 20})
       .attr("y", function(d){return y(d.y) - 40})
       .attr("width", 40)
       .attr("height", 20)
       .attr("fill","gray")
       .attr("opacity", function(d, idx, dataIdx){
         if(dataIdx === $scope.activeStudent){
            return 1;

          }
          else{
            return 0;
          }
        })
      
       
       label.append("text")
       .attr("x", function(d){ return x(d.x) - 20})
       .attr("y", function(d){return y(d.y) - 20})
      .text(function (d) { return d.y.toString() + "Min."})
         .attr("opacity", function(d, idx, dataIdx){
         if(dataIdx === $scope.activeStudent){
            return 1;

          }
          else{
            return 0;
          }
        })
         .attr("font-size", "14px")



       

/*
        enter.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function (d) { return d.name; }); 

        selection.transition().duration(2000)
          .attr("transform", function (d) { 
            return "translate(" + d.x + "," + d.y + ")";
          }); 

        selection.selectAll("circle").transition().duration(3000)
          .attr("r", function (d) { return d.r; });

        resize();

        */


/*
           selection.transition().duration(2000)
          .style("opacity", 1) */

          //enter1.transition()
         // enter1.exit();
       /* selection.exit().transition().duration(1000)
          .attr("transform", function (d) {
            return "translate(" + 1000 + "," + 1000 + ")"; 
          }).remove();
*/
        resize();

      };

      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }

      $scope.$on('windowResize',resize);
      $scope.$watch('d3Data', update);
     


    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
      link: link, 
      restrict: 'E' 
    };
}]);


