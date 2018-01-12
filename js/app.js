angular.module('viz', []);



angular.module('viz').controller('studentScatter', ['$scope','$window', 

  function ($scope, $window) {
 
    $scope.d3Data = [[{x: 5, y:67, active: false}, {x:25, y: 96, active: false}, {x:45, y:50, active: false}, {x:65, y: 49, active: false}, {x:85, y:47, active: false}], [{x: 5, y: 28, active: false}, {x: 25, y: 39, active: false}, {x: 45, y: 99, active: false}, {x: 65, y: 77, active: false}, {x: 85, y: 69, active: false}]]
    $scope.activeStudent = undefined;
    $scope.activeObj = {type: "student", student: null, previousStudent: null}
    $scope.rawData = [{"id":1, "name":"Jane", "data": [{"month": "September 2016", "value":1}, {"month": "October 2016", "value":21}, {"month": "November 2016", "value": 287}, {"month": "December 2016", "value": 150}, {"month": "January 2017", "value": 115}]},{"id":2, "name":"Christopher", "data": [{"month": "September 2016", "value":79}, {"month": "October 2016", "value": 199}, {"month": "November 2016", "value":156}, {"month": "December 2016", "value": 177}, {"month": "January 2017", "value": 49}]}, {"id":3, "name":"Max", "data": [{"month": "September 2016", "value": 280}, {"month": "October 2016", "value":284}, {"month": "November 2016", "value": 90}, {"month": "December 2016", "value": null}, {"month": "January 2017", "value": 49}]}];
    $scope.startMonth = "September 2016";
    $scope.numberOfMonths = 7;

    $scope.myFunc = function(){
      console.log("myFunc")
    }
    $scope.clickHelp = function(id){
      if($scope.activeObj.student === id){
        $scope.activeObj.previousStudent = id;
        $scope.activeObj.student = null;
      }
      else{
        $scope.activeObj.previousStudent = $scope.activeObj.student;
        $scope.activeObj.student = id;
      }

      $scope.$broadcast("updateChart")
    }


    var createMonthLabels = function(monthString){
      var initialMonthMoment = moment($scope.startMonth).startOf("month")
      var startMonthString = initialMonthMoment.format("MMMM YYYY")
      var arrOfMonths = []
      for(let i = 0; i < $scope.numberOfMonths; i++){
        var momentM = moment(startMonthString).add(i, "month")
        if(momentM.month()=== 0){
             arrOfMonths.push(momentM.format("MMMM YYYY"))
        }
        else{
          arrOfMonths.push(momentM.format("MMMM"))
        }
        
      }
      return arrOfMonths;
    }

    $scope.monthLabels =createMonthLabels();


    console.log($scope, "scope in controller")

    $window.addEventListener('resize', function () {
      $scope.$broadcast('windowResize');
    });

    var months = function(monthString){
      var initialMonthMoment = moment($scope.startMonth).startOf("month")
      var startMonthString = initialMonthMoment.format("MMMM YYYY")
      var arrOfMonths = []
      for(let i = 0; i < $scope.numberOfMonths; i++){
        arrOfMonths.push(moment(startMonthString).add(i, "month").format("MMMM YYYY"))
      }
      return arrOfMonths;
    }();



    var monthValue = function(monthString){
      var monthInd = months.indexOf(monthString);
      
         return monthInd + 1;
      
     
    }

 

      var jitter = function(value, range){ // function to accomplish the Jitter -- Value input is 1,2,3..., or N of months
        var min = value - range;
        var max = value + range;
        var random = Math.round(((Math.random()*(max - min) + min))*10000) / 10000;
          return random
      };

      var formatData = function(initialData){ 
      var resArr = [];
    

      for(let i =0 ; i < initialData.length; i++){
        var dataArr;

        dataArr = []


        initialData[i].data.forEach(function(elem, ind){
                    var monthV = monthValue(elem.month);
                    if(elem.value || elem.value ===0 ){
                    
                        var rObj = {};


                    rObj.month = monthV// need to make a function for months -- What if there are missing months for a student.. etc.
                    rObj.x =  jitter(monthV, 0.4);// need to figure out how to pull in my jitter function
                    rObj.y = elem.value;
                    rObj.id = initialData[i].id;
                    rObj.name = initialData[i].name;

                    dataArr.push(rObj)
                    

                     
                    }
                    


        });


          
        resArr.push(dataArr);
      }

      
      return resArr
  }



    $scope.formattedData = formatData($scope.rawData);
 

    $scope.$on('graphClick', function(){

     
      if($scope.activeObj.student === arguments[1].id){
       
        $scope.activeStudent = undefined;
        $scope.activeObj.student = null;
        $scope.activeObj.previousStudent = arguments[1].id
        

      }
      else{

       
        $scope.activeObj.previousStudent = $scope.activeObj.student;
        $scope.activeStudent = arguments[1].id;
        $scope.activeObj.student = arguments[1].id;


      }
        console.log($scope, "$scope in controller")
        $scope.$broadcast("updateChart")

    })

    

  }
]);  



angular.module('viz').directive('studentList', [function(){

    var link = function($scope, $el, $attrs){
      console.log($scope, "scope in Student list directive")
      console.log($el, $el[0], "el and el0")
      var svg = d3.select($el[0]).append("svg")
      .attr({width: 200, height: 1000})
       .attr("viewBox", "0 0 " + (200 + 40 ) + " " + (1000+ 40));

    }


      return {
      template: '<div class="studentlist"></div>',
      replace: true,
    
      scope: {
        //d3Data: '=data',
        //activeStudent: '=active',
        activeObj: '=activeobj',
        //startMonth: '=start',
        //numberOfMonth: '=duration',
        rawData: '=students'
     
      },
      link: link,
      restrict: 'E' // "Make this an html element"
    };
}]) 
angular.module('viz').directive('scatterChart', [

  function () {

    var link = function ($scope, $el, $attrs) {
      var margin = {top: 40, right: 40, bottom: 40, left: 40};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom;

      var arrMonthInd = [];

      for(let i = 1; i <= $scope.numberOfMonth; i++){
        arrMonthInd.push(i);
      }


  
      var svg = d3.select($el[0]).append("svg")
        .attr({width: width, height: height})
        .attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.top + margin.bottom));

      var chart = svg.append("g");

   

      chart.append("text").attr("id", "loading")
        .text("Loading...")
        .attr("transform", "translate(200,250)");

      var update = function () {
        var data = $scope.d3Data;
     
        console.log($scope, "$scope in Update")

        var valueline = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .interpolate("linear");

        chart.selectAll("*").remove();
      


        if (data.length) chart.select("#loading").remove();

        var x = d3.scale.linear().domain([0.5,$scope.numberOfMonth + 0.5]).range([0,width])//.range([0,width])//.domain([0,width]

        var y = d3.scale.linear().domain([0,400]).range([height, 0])//.range([height,0]//.range([height, 0])
                 
    


        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("top")
            .innerTickSize(-height)
            .outerTickSize(0)
            .tickPadding(10)
            //.orient("bottom")
            

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("right")
            .innerTickSize(-width)
            .outerTickSize(0)
            .tickPadding(10)


        var yAxisGrid = yAxis.ticks(6)
        var xAxisGrid = xAxis.ticks($scope.numberOfMonth)
        .tickFormat(function(d, i){
          return $scope.monthLabels[i]
        })//.tickFormat("").orient("top")
        var selection = chart.selectAll(".series").data(data, function (d, i) { return i })


      chart.append("g")

      .attr("class", "annotation")
     
      .selectAll(".annotationMonth")
      .data(arrMonthInd, function(d, i ){ return i})
      .enter()
      .append("rect")

      .attr("x", function(d){ return x(d - 0.5)})
      .attr("y", function(d){return 0})
      .attr("width", width / $scope.numberOfMonth)
      .attr("height", height)
      .attr("fill",function(d){
        if(d % 2 === 0){
          return "#ffffff"
        }
        else{
          return "#f9f9f7"

        }
      })
    

      

 


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

      var SVG2 = selection.enter().append("g")


      var enter1 = SVG2.attr("class", function(d,i){return i})

     // console.log("Are my changes having any effect")

      var enter2 = enter1.selectAll(".point")
      .data(function(d){ return d;})
          var enter3 = enter2.enter()
          var circle = enter3.append("circle")
          .on("click", function(a,b,c){
          
            
                $scope.$emit('graphClick', a, b, c)      
          })
          //.attr("class", "point")
          .attr("class", function(a,b,c){
            return "point_series" + a.id
          })
        .attr("r", 5)
        .attr("fill", function(d, idx, dataIdx){

          if(d.id === $scope.activeObj.student){
            return "#ef6640";

          }
          else{
            return "#7a9ef2";
          }
        })

        .attr("cx", function(d){ return x(d.x);})
        .attr("cy", function(d) { return y(d.y);})



      SVG2.append("path")
      .attr("class",function(d){

        
      return "display_series" + d[0].id}) //".line_series"
      .attr("stroke", "#ef6640")
      /*
      .attr("stroke-width", function(d, idx){

        if(d[0].id === $scope.activeObj.student){

            return 3;
        }
        else{
            return 0;
        }

      } )*/
      .attr("stroke-width",3)
      .attr("opacity",0)
      .attr("fill", "none")
      .attr("d", function(d){
   
        return valueline(d)
      })  


       var label = enter1.selectAll(".label")
       .data(function(d){return d;})
       .enter()

       label.append("rect")
       .attr("x", function(d){ return x(d.x) - 20})
       .attr("y", function(d){return y(d.y) - 40})
       .attr("width", 40)
       .attr("height", 20)
       .attr("fill","#5d5d5c")
        .attr("class",function(d){

        
      return "display_series_point" + d.id})

       .attr("opacity", function(d, idx, dataIdx){
       
         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          }
        })
      
       
       label.append("text")
       .attr("x", function(d){ return x(d.x) - 20})
       .attr("y", function(d){return y(d.y) - 20})
        .attr("class",function(d){

        
      return "display_series_point" + d.id})
      .text(function (d) { if(d.y || d.y === 0) {return d.y.toString() + "Min."}})
         .attr("opacity", function(d, idx, dataIdx){

         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          }
        })
         .attr("font-size", "14px")
         .attr("fill", "#ece2e5")


           label.append("text")
       .attr("x", function(d){ return x(d.x) })
       .attr("y", function(d){return y(d.y)})
        .attr("class",function(d){

        
      return "display_series_point" + d.id})
      .text(function (d) { if(d.y || d.y === 0) {return d.name}})
         .attr("opacity", function(d, idx, dataIdx){

         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          }
        })
         .attr("font-size", "14px")
         .attr("fill", "#ece2e5")

        resize();

      };



      var updateActive = function(){
        var testing = d3.selectAll(".point_series1");
        console.log(testing, "testing")
        console.log($scope.activeObj, "scope.activeObj")

        //CIRCLES
        
      d3.selectAll(".point_series" + $scope.activeObj.student).attr("fill","#ef6640")
      d3.selectAll(".point_series" + $scope.activeObj.previousStudent).attr("fill","#7a9ef2")
      

        // CONNECTING LINE

      d3.selectAll(".display_series" + $scope.activeObj.student).attr("opacity", 1)//.attr("stroke-width", 3);
       d3.selectAll(".display_series" + $scope.activeObj.previousStudent).attr("opacity",0)


        // LABEL RECTANGLES

         d3.selectAll(".display_series_point" + $scope.activeObj.student).attr("opacity",1)
            d3.selectAll(".display_series_point" + $scope.activeObj.previousStudent).attr("opacity",0)



      };

      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }

      $scope.$on('windowResize',resize);
       $scope.$on('updateChart', function(){//console.log("heard in the directive from $scope.on")
          console.log($scope, "scope as heard from the $scope.on")
          
         // update()
          updateActive();
      })  

      $scope.$watch('d3Data', update);




    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
    
      scope: {
        d3Data: '=data',
        activeStudent: '=active',
        activeObj: '=activeobj',
        startMonth: '=start',
        numberOfMonth: '=duration',
        monthLabels: '=labels'
      },
      link: link,
      restrict: 'E' // "Make this an html element"
    };
}]);


