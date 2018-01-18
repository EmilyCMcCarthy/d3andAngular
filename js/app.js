angular.module('viz', []);


/// BEGIN - CONTROLLER 
angular.module('viz').controller('studentScatter', ['$scope','$window', 

  function ($scope, $window) {
 
    $scope.d3Data = [[{x: 5, y:67, active: false}, {x:25, y: 96, active: false}, {x:45, y:50, active: false}, {x:65, y: 49, active: false}, {x:85, y:47, active: false}], [{x: 5, y: 28, active: false}, {x: 25, y: 39, active: false}, {x: 45, y: 99, active: false}, {x: 65, y: 77, active: false}, {x: 85, y: 69, active: false}]]
    $scope.activeObj = {type: "student", student: null, previousStudent: null, cat: null, previousCat: null}
    $scope.rawData = [{"id":1, "name":"Jane", "data": [{"month": "September 2016", "value":1}, {"month": "October 2016", "value":21}, {"month": "November 2016", "value": 287}, {"month": "December 2016", "value": 150}, {"month": "January 2017", "value": 115}]},{"id":2, "name":"Christopher", "data": [{"month": "September 2016", "value":79}, {"month": "October 2016", "value": 199}, {"month": "November 2016", "value":156}, {"month": "December 2016", "value": 177}, {"month": "January 2017", "value": 49}]}, {"id":3, "name":"Max", "data": [{"month": "September 2016", "value": 280}, {"month": "October 2016", "value":284}, {"month": "November 2016", "value": 90}, {"month": "December 2016", "value": null}, {"month": "January 2017", "value": 49}]}];
    $scope.startMonth = "September 2016";
    $scope.numberOfMonths = 5;
    $scope.goalData =[{month: "A", value: 5, cat: "GoalMet", ids: [1,9,5,4,6]}, {month: "A", value: 3, cat: "GoalNotMet", ids: [3,7,8]}, {month: "A", value: 2, cat: "GoalExceeded", ids: [2,10]},{month: "B", value: 3, cat: "GoalMet", ids: [1,2,3]}, {month: "B", value: 5, cat: "GoalNotMet", ids: [4,5,6,7,8]}, {month: "B", value: 2, cat: "GoalExceeded", ids: [9,10]}, {month: "C", value: 2, cat: "GoalMet", ids: [10,9]}, {month: "C", value: 4, cat: "GoalNotMet", ids: [1,4,3,8]}, {month: "C", value: 4, cat: "GoalExceeded", ids: [2,5,6,7]}]//[{"id":1, "name":"Jane", "data": [{"month": "September 2016", "minuteGoal":2, "dayGoal": 1}, {"month": "October 2016", "minuteGoal":2, "dayGoal": 3}, {"month": "November 2016", "minuteGoal": 3, "dayGoal": 3}, {"month": "December 2016", "minuteGoal": 2, "dayGoal": 2}, {"month": "January 2017", "minuteGoal": 1, "dayGoal": 3}]},{"id":2, "name":"Christopher", "data": [{"month": "September 2016", "minuteGoal": 1, "dayGoal": 2}, {"month": "October 2016", "minuteGoal": 2, "dayGoal": 1}, {"month": "November 2016", "minuteGoal": 1, "dayGoal": 1}, {"month": "December 2016", "minuteGoal": 3, "dayGoal": 3}, {"month": "January 2017", "minuteGoal": 1, "dayGoal": 3}]}, {"id":3, "name":"Max", "data": [{"month": "September 2016", "minuteGoal": 3, "dayGoal": 2}, {"month": "October 2016", "minuteGoal": 1, "dayGoal": 3}, {"month": "November 2016", "minuteGoal": 3, "dayGoal": 1}, {"month": "December 2016", "minuteGoal": 3, "dayGoal": 2}, {"month": "January 2016", "minuteGoal": 2, "dayGoal": 3}]}]
    $scope.goalStudentData = [{"id": 1, "name": "Jane A."},{"id": 2, "name": "Christopher C."},{"id":3, "name": "Jehosephat D."},{"id": 4, "name": "Janice E."},{"id": 5, "name": "Betty F."},{"id": 6, "name": "Sarah F."},{"id": 7, "name": "Rose G."},{"id": 8, "name": "Mary G."},{"id": 9, "name": "Benjamin H."}, {"id": 10, "name": "Danielle H."}]


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

    $scope.monthLabels = createMonthLabels();



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
                    rObj.x =  jitter(monthV, 0.45);// need to figure out how to pull in my jitter function
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

      //console.log("arguments", arguments)

     if(arguments[4]==="student"){


        if($scope.activeObj.student === arguments[1].id){
       
        $scope.activeStudent = undefined;
        $scope.activeObj.student = null;
        $scope.activeObj.previousStudent = arguments[1].id
        $scope.activeObj.type = "student"

        if($scope.activeObj.previousCat){
          $scope.activeObj.previousCat = null;
          $scope.activeObj.previousCatIds = [];
        }
        

      }
     
      else{
        if($scope.activeObj.cat){
          $scope.activeObj.previousCat = $scope.activeObj.cat 
          $scope.activeObj.previousCatIds = $scope.activeObj.catIds;
          $scope.activeObj.cat = null;
          $scope.activeObj.catIds = [];
        }
        else{
          $scope.activeObj.previousCat = null;
          $scope.activeObj.previousCatIds = [];
        }
       
        $scope.activeObj.previousStudent = $scope.activeObj.student;
        $scope.activeStudent = arguments[1].id;
        $scope.activeObj.student = arguments[1].id;
        $scope.activeObj.type = "student"


      }


      }
      /*else if(){

      }*/
      else if(arguments[4]==="goal"){
     
        if($scope.activeObj.cat === arguments[1].cat + "_" + arguments[1].month){
      
          $scope.activeObj.cat = null;
          $scope.activeObj.catIds = [];
          $scope.activeObj.previousCat = arguments[1].cat + "_" + arguments[1].month;
          $scope.activeObj.previousCatIds = arguments[1].ids;

          $scope.activeObj.type = "cat"

          if($scope.activeObj.previousStudent){
            $scope.activeObj.previousStudent = null;
          }
        }
        else{
    
          if($scope.activeObj.student || $scope.activeObj.student === 0){
            $scope.activeObj.previousStudent = $scope.activeObj.student;
            $scope.activeObj.student = null;
          }
          else{
            $scope.activeObj.previousStudent = null;
          }
          $scope.activeObj.previousCat = $scope.activeObj.cat;
          $scope.activeObj.previousCatIds = $scope.activeObj.catIds;
          $scope.activeObj.cat = arguments[1].cat + "_" + arguments[1].month;
          $scope.activeObj.catIds = arguments[1].ids;
          $scope.activeObj.type = "cat"
        }
      }
     //}
      
      
        $scope.$broadcast("updateChart")

    })

    

  }
]);  
// END CONTROLLER


// BEGIN STUDENT LIST D3 DIRECTIVE

angular.module('viz').directive('studentList', [function(){

    var link = function($scope, $el, $attrs){
/*
      var margin = {top: 100, right: 100, bottom: 100, left: 100};
      var width = 960 - margin.left - margin.right;
      var height = 500 - margin.top - margin.bottom; */

      var svg = d3.select($el[0]).append("svg")
      .attr({width: 1000, height: 1000})
      // .attr("viewBox", "0 0 " + (200 + 40 ) + " " + (1000+ 40));

    
      var rectH =100;
      var rectW = 500;

      var chart = svg.append("g");

      var update = function(){
       

         
      var boxes = chart.append("g")

      .attr("class", "boxes")
      .selectAll(".studentList")
      .data($scope.rawData, function(d, i ){ return d.id})
      .enter()

      boxes.append("rect")

      .attr("x", function(d, i){ return 0})
      .attr("class", function(d){
        return "student_list_box_" + d.id;
      })
      .attr("y", function(d, i){return i*rectH})
      .attr("width", rectW )
      .attr("height", rectH)
      .attr("fill", function(d, i){
        if(d.id === $scope.activeObj.student){
          return '#eb7e61'
        }
        else{
          return '#f9f9f7'
        }
      })
      .attr("stroke", "darkgray")
      .on('click', function(a,b,c){
 
         $scope.$emit('graphClick', a, b, c, "student")   
      })

      boxes.append("text")
      .attr("x", function(d, i){ return 20})
      .attr("y", function(d, i){return i*rectH + 50})
        /*.attr("class",function(d){

        
      return "display_series_point" + d.id}) */
      .text(function (d) { /*if(d.y || d.y === 0) {return d.y.toString() + "Min."}}) 
         .attr("opacity", function(d, idx, dataIdx){

         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          } */ return  d.name
        })
         .attr("font-size", "40px")
          .attr("class", function(d){
          return "student_list_text_" + d.id;
          })
         .attr("fill", function(d,i){
            if(d.id === $scope.activeObj.student){
              return "#fdf7f5"
            }
            else{
              return "#253f73"
            }
         })

     
      .attr("stroke-width", 1)


      }

      var updateActive = function(){
      
          if($scope.activeObj.type === "cat"){

            if($scope.activeObj.previousStudent || $scope.activeObj.previousStudent === 0){
                  
                  d3.selectAll(".student_list_box_" + $scope.activeObj.previousStudent).attr("fill", "#f9f9f7")
                  d3.selectAll(".student_list_text_" + $scope.activeObj.previousStudent).attr("fill","#253f73")
              }

              if($scope.activeObj.previousCatIds){
                  for(let i = 0; i < $scope.activeObj.previousCatIds.length; i++ ){
                     d3.selectAll(".student_list_box_"+ $scope.activeObj.previousCatIds[i]).attr("fill","#f9f9f7")
                      d3.selectAll(".student_list_text_"+ $scope.activeObj.previousCatIds[i]).attr("fill","#253f73")
        

                  }
              }
              if($scope.activeObj.catIds){
                for(let i = 0; i < $scope.activeObj.catIds.length; i++ ){
                
                    d3.selectAll(".student_list_box_"+ $scope.activeObj.catIds[i]).attr("fill","#eb7e61")
                    d3.selectAll(".student_list_text_"+$scope.activeObj.catIds[i]).attr("fill","#fdf7f5")
                  
                  }
              }

            
        }
        else if($scope.activeObj.type === "student"){

            if($scope.activeObj.previousCat){

                  if($scope.activeObj.previousCatIds){
                  for(let i = 0; i < $scope.activeObj.previousCatIds.length; i++ ){
                     d3.selectAll(".student_list_box_"+ $scope.activeObj.previousCatIds[i]).attr("fill","#f9f9f7")
                      d3.selectAll(".student_list_text_" + $scope.activeObj.previousCatIds[i]).attr("fill","#253f73")
         

                  }
              }
           
            }

           
            d3.selectAll(".student_list_box_"+ $scope.activeObj.previousStudent).attr("fill","#f9f9f7")
            d3.selectAll(".student_list_box_"+ $scope.activeObj.student).attr("fill","#eb7e61")
        

            d3.selectAll(".student_list_text_"+ $scope.activeObj.previousStudent).attr("fill", "#253f73")
            d3.selectAll(".student_list_text_"+ $scope.activeObj.student).attr("fill","#fdf7f5")

        }

      }

      $scope.$watch('activeObj', updateActive);
      $scope.$watch('rawData', update);


         $scope.$on('updateChart', function(){
          
          updateActive();
      })  

    }

      



      return {
      template: '<div class="studentlist"></div>',
      replace: true,
    
      scope: {
     
        activeObj: '=activeobj',
      
        rawData: '=students'
     
      },
      link: link,
      restrict: 'E' // "Make this an html element"
    };
}]) 

// END STUDENT LIST D3 DIRECTIVE


// BEGIN BAR CHART D3 DIRECTIVE

angular.module('viz').directive('barChartMulti', [function(){

    var link = function($scope, $el, $attrs){



    var margin = {top: 20, right: 20, bottom: 100, left: 100},
    width = 2000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
 
      var svg = d3.select($el[0]).append("svg")
        .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
        .attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.bottom + margin.top));

      var chart = svg.append("g");
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

      var update = function(){

   

        var data = $scope.goalData//[{month: "A", value: 5, cat: "Goal Met", ids: [1,2,3,4,5]}, {month: "A", value: 3, cat: "Goal Not Met", ids: [6,7,8]}, {month: "A", value: 2, cat: "Goal Exceeded", ids: [9,10]},{month: "B", value: 3, cat: "Goal Met", ids: [1,2,3]}, {month: "B", value: 5, cat: "Goal Not Met", ids: [4,5,6,7,8]}, {month: "B", value: 2, cat: "Goal Exceeded", ids: [9,10]}, {month: "C", value: 2, cat: "Goal Met", ids: [10,9]}, {month: "C", value: 4, cat: "Goal Not Met", ids: [1,2,3,8]}, {month: "C", value: 4, cat: "Goal Exceeded", ids: [4,5,6,7]}]//[{month: "A", value: 5, cat: "Goat Met"}, {month:"B", value: 10, cat: "X"}, {month:"A", value: 7, cat: "X"}, {month: "C", value: 4, cat:"Y"}, {month: "A", value: 6, cat:"Y"}]
       
        var barPad = 0.1
       var barOuterPad = barPad / 2;
         var color = d3.scale.ordinal()
                       .domain(["GoalMet", "GoalExceeded", "GoalNotMet"])
                        .range(["#d8aade", "#d1e4b1", '#f4d0b0'])

        var x0 = d3.scale.ordinal()//.rangeRoundBands([0,width],0.1);
                      .domain(data.map(function(d){
                        return d.month;
                      }))
      
                      .rangeRoundBands([0,width], barPad, barOuterPad)


        var x1 = d3.scale.ordinal()
                    //.domain(data.map(function(d){
                    //    return d.cat
                    //}))
                    .domain(["GoalMet","GoalExceeded","GoalNotMet"])
                    .rangeRoundBands([0,x0.rangeBand()]/*, 0.1, 0.5*/)

        //.range([0,width]).rangeRoundBands([0,width],0.1)//.rangeRoundBands([0,width], 0.05);
        var y = d3.scale.linear().range([height, 0]);

       

        var xAxis = d3.svg.axis()
                      .scale(x0)
                      .orient("bottom")


        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left")
                  
            

        y.domain([0, d3.max(data, function(d){return d.value;})*1.25])


        var labelW = x0.rangeBand()*0.55
        var labelH = labelW * 0.4
        var space = labelH / 4;
        var triangleL = space;




chart.append("g")
  .selectAll("annotations")
  .data(["A","B","C"])
  .enter()
  .append("rect")
  .attr("x", function(d){
    return x0(d) - x0.rangeBand()*(1/(1-barPad))*(barPad/2)
  })
  .attr("y", 0)
  .attr("height", height)
  .attr("width", function(){return x0.rangeBand()*(1/(1- barPad))})
  .attr("fill", function(d,id){
    if(id % 2 === 0){
      return  "#f9f9f7"
    }
    else{
      return "#ffffff"

    }
  })
        chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
       .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

            var yAxisGrid = yAxis
                .outerTickSize(0)
                      .innerTickSize(-width)
                           .tickPadding(1)
            .ticks(7)//.orient("left")

     var grid =  chart.append("g")
     .classed('y', true)
     .classed('grid', true)
     .call(yAxisGrid)

     grid.selectAll("text").attr("font-size",20)
     console.log(grid.selectAll("text"), "grid? text")

chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .selectAll("text")
         .style("text-anchor", "left")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

    /*.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value");*/


  //.attr("stroke", "blue")
  //.attr("stroke-width",10)
  
  //.attr()

  
chart
.append("g")
.selectAll("bar")
      .data(data)
    .enter()
      .append("rect")
    .attr("transform",function(d){return "translate(" + x0(d.month) + ",0)"})
  
      .style("fill", function(d){return color(d.cat)})

      .attr("x", function(d) { 
       
        return x1(d.cat); })
      .attr("width", x1.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height- y(d.value); });

      
     var label = chart.append("g")
     .selectAll(".label")
      .data(data)
      .enter()
      
      label.append("rect")
      .attr("class", function(d){
        var classString = d.cat + "_" + d.month;

      
        for(let i = 0; i < d.ids.length; i++){
      
          classString += " label_student_" + d.ids[i] 

        } 
      return classString;//d.cat + " " + "hello"

     }) 
 
      .attr("transform",function(d){return "translate(" + x0(d.month) + ",0)"})
      .style("fill", "gray")
      .attr("x",function(d) { 
         
        return x1(d.cat) - labelW / 2 + x1.rangeBand()/2 })
      .attr("y", function(d){return y(d.value) - 2*space - labelH})
      .attr("width", labelW)
      .attr("height", labelH)
      .attr("opacity", function(d, idx, dataIdx){
       
         if(d.cat === $scope.activeObj.cat){
            return 1;

          }
          else{
            return 0;
          }
        })


      label.append("rect")
          .attr("class", function(d){
        var classString = d.cat + "_" + d.month;

        for(let i = 0; i < d.ids.length; i++){
      
          classString += " label_student_" + d.ids[i] 

        } 
      return classString;//d.cat + " " + "hello"

     })
          .attr("transform", function(d){ 
        
              let yP = y(d.value)  - 2*space - triangleL*Math.sqrt(2)/2
              let xP = x1(d.cat) +x1.rangeBand()/2 + x0(d.month)
              return "rotate(45 " + xP + " " + yP + ")"})
        
          .style("fill", "gray")
            .attr("x",function(d) { 
         
        return x1(d.cat)+ x1.rangeBand()/2 + x0(d.month)})
      .attr("y", function(d){return  y(d.value)  - 2*space - triangleL*Math.sqrt(2)/2})
      .attr("width", triangleL)
      .attr("height", triangleL)
      .attr("opacity", function(d, idx, dataIdx){
       
         if(d.cat === $scope.activeObj.cat){
            return 1;

          }
          else{
            return 0;
          }
        })
    

      label.append("line")
      .attr("transform",function(d){return "translate(" + x0(d.month) + ",0)"})
      .attr("x1", function(d) { 
         
        return x1(d.cat) - labelW / 2 + x1.rangeBand()/2 })
      .attr("x2", function(d){
        return x1(d.cat) + labelW /2 + x1.rangeBand()/2

      })
      .attr("y1", function(d){
        return y(d.value) - 2*space - labelH
      })
      .attr("y2", function(d){
        return y(d.value) - 2*space - labelH
      })
      .attr("class", function(d){
        var classString = d.cat + "_" + d.month;

        for(let i = 0; i < d.ids.length; i++){
      
          classString += " label_student_" + d.ids[i] 

        } 
      return classString;//d.cat + " " + "hello"

     })
      .attr("stroke-opacity",0)
      .attr("stroke-width",10)
      .attr("stroke",function(d){return color(d.cat)})



chart
.append("g")
.selectAll("Clickable_bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("transform",function(d){return "translate(" + x0(d.month) + ",0)"})
      .on('click', function(a,b,c){
       // console.log(a,b,c,"abc in onclick")
           $scope.$emit('graphClick', a, b, c, "goal")    
      })
      .attr("opacity", 0)
      //.style("fill", function(d){return color(d.cat)})

      .attr("x", function(d) { 
    
        return x1(d.cat); })
      .attr("width", x1.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height- y(d.value); });

      

    /* 
            label.append("rect")
        .attr("x", function(d){return x(d.x)})
        .attr("y", function(d){return y(d.y) - 2*space - triangleL*Math.sqrt(2)/2})
       .attr("transform",  function(d){
        let yP = y(d.y)  - 2*space - triangleL*Math.sqrt(2)/2
        return "rotate(45 " + x(d.x) + " " + yP+  ")"})
        .attr("width", triangleL)
        .attr("height", triangleL)
        .attr("fill", "#5d5d5c")
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
        */

      }

      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }


      var updateActive = function(){
    

        if($scope.activeObj.type === "cat"){

            if($scope.activeObj.previousStudent || $scope.activeObj.previousStudent === 0){
              
                  d3.selectAll(".label_student_"+ $scope.activeObj.previousStudent).attr("opacity", 0).attr("stroke-opacity", 0)
              }

              d3.selectAll("." + $scope.activeObj.cat).attr("opacity",1).attr("stroke-opacity",1)
              d3.selectAll("." + $scope.activeObj.previousCat).attr("opacity", 0).attr("stroke-opacity", 0)

            
        }
        else if($scope.activeObj.type === "student"){

            if($scope.activeObj.previousCat){
               d3.selectAll("." + $scope.activeObj.previousCat).attr("opacity", 0).attr("stroke-opacity", 0)
            }

           
            d3.selectAll(".label_student_"+ $scope.activeObj.previousStudent).attr("opacity", 0).attr("stroke-opacity", 0)
            d3.selectAll(".label_student_"+ $scope.activeObj.student).attr("opacity", 1).attr("stroke-opacity", 1)
          


        }

    

      }
    
   

      $scope.$watch('activeObj', updateActive);
      $scope.$on('windowResize',resize);
      $scope.$watch('rawData', update);



      $scope.$on('updateChart', updateActive)  


    }


      return {
      template: '<div class="barchart"></div>',
      replace: true,
    
      scope: {
        //d3Data: '=data',
        //activeStudent: '=active',
        activeObj: '=activeobj',
        //startMonth: '=start',
        //numberOfMonth: '=duration',
        goalData: '=students'
     
      },
      link: link,
      restrict: 'E' // "Make this an html element"
    };
}]) 
// END BAR CHART D3 DIRECTIVE

// BEGIN SCATTER PLOT D3 DIRECTIVE
angular.module('viz').directive('scatterChart', [

  function () {

    var link = function ($scope, $el, $attrs) {
      var margin = {top: 100, right: 100, bottom: 100, left: 100};
      var padding = 20;
      var width = 960 - margin.left - margin.right;//950 - 2* padding;

      var height = 500 - margin.top - margin.bottom;//500  - 2*padding;

      var arrMonthInd = [];

      for(let i = 1; i <= $scope.numberOfMonth; i++){
        arrMonthInd.push(i);
      }


  
      var svg = d3.select($el[0]).append("svg")
        .attr({width: width + margin.left + margin.right, height: height + margin.top + margin.bottom})
        .attr("viewBox", "0 0 " + (width + margin.right + margin.left) + " " + (height + margin.bottom + margin.top));

      var chart = svg.append("g");
      chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      

      chart.append("text").attr("id", "loading")
        .text("Loading...")
        //.attr("transform", "translate(200,250)");

      var update = function () {

        var data = $scope.d3Data;
     


        var mergedData = [].concat.apply([], data);
     
        
       
        var yMax = d3.max(mergedData, function(d){return d.y}) * 1.1
      
     
        console.log($scope, "$scope in Scatter Chart Directive")
        //console.log(mergedData,"mergedData")

        var valueline = d3.svg.line()
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); })
          .interpolate("linear");

        chart.selectAll("*").remove();
      


        if (data.length) chart.select("#loading").remove();

        chart.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var x = d3.scale.linear().domain([0.5, $scope.numberOfMonth + 0.5]).range([0,width]).nice();

        var y = d3.scale.linear().domain([0,yMax + 20]).range([height, 0]).nice();
                 
    


        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .innerTickSize(height)
            .outerTickSize(1)
            .tickPadding(1)
          
            

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .innerTickSize(-(width))
          
            .outerTickSize(1)
            .tickPadding(1)



        var yAxisGrid = yAxis.ticks(7).orient("left")

         xAxis.ticks($scope.numberOfMonth)
        .tickFormat(function(d, i){
          return $scope.monthLabels[i]
        }).orient("bottom")
        
        var xAxisGrid = xAxis.ticks($scope.numberOfMonth)
        .tickFormat(function(d, i){
          return $scope.monthLabels[i]
        })//.tickFormat("").orient("top")
        //.selectAll("text")
        //.attr("opacity", 0)

        
        var selection = chart.selectAll(".series").data(data, function (d, i) { return i })

  
      

      
     
      var annoM =chart.append("g")

      .attr("class", "annotation")
      .selectAll(".annotationMonth")
      .data(arrMonthInd, function(d, i ){ return i})
      .enter()

      annoM.append("rect")

      .attr("x", function(d){ return x(d-0.5)})
      .attr("y", function(d){return 0})
      .attr("width", (width ) / $scope.numberOfMonth)
      .attr("height", height)
      .attr("fill",function(d){
        if(d % 2 === 0){
          return "#ffffff"
        }
        else{
          return "#f9f9f7"

        }
      })
      .attr("stroke", "#e3e2dc")
      .attr("stroke-width", 1)


    

      

 



     chart.append("g")
     .classed('x', true)
     .classed('grid', true)
     .call(xAxisGrid)
     .attr("opacity", 0)


     chart.append("g")
     .classed('y', true)
     .classed('grid', true)
     .call(yAxisGrid)


   chart.append("g")
        .attr("class", "xAxis")
        //.attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        //.attr("stroke", "green")
      
 chart.append("g")
        .attr("class", "yaxis")
        //.attr("transform", "translate("+2*padding+",0)")
        .call(yAxis)
        //.attr("stroke", "#e3e1dc")


        chart.append("g")
      .attr("class", "visibleCircles")

      .selectAll("circleTest")
      .data(mergedData, function(d, i){
      
        return i})
      .enter()
      .append("circle")
     /* .on("click", function(a,b,c){
          
            
                $scope.$emit('graphClick', a, b, c)      
          })
          //.attr("class", "point") */
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


      var SVG2 = selection.enter().append("g")


      var enter1 = SVG2.attr("class", function(d,i){return i})



      SVG2.append("path")
      .attr("class",function(d){

        
      return "display_series" + d[0].id}) //".line_series"
      .attr("stroke", "#ef6640")

      .attr("stroke-width",3)
      .attr("opacity",0)
      .attr("fill", "none")
      .attr("d", function(d){
   
        return valueline(d)
      })  

        var labelW = (width)/9 *0.85 // MAX number of months at one time is 9
        var labelH = labelW * 0.4
        var space = labelH / 4;
        var triangleL = space;

       var label = enter1.selectAll(".label")
       .data(function(d){return d;})
       .enter()

       label.append("rect")
       .attr("x", function(d){ 
          let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)
    
          if(xC - labelW/2 < mL){
            return mL
          }
          else if(xC + labelW/2 > mR){
            return mR - labelW
          }
          else{
            return x(d.x) - labelW / 2
          }
   

        })
       .attr("y", function(d){return y(d.y) - labelH - 2*space})
       .attr("width", labelW)
       .attr("height", labelH)
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
      
        label.append("rect")
        .attr("x", function(d){return x(d.x)})
        .attr("y", function(d){return y(d.y) - 2*space - triangleL*Math.sqrt(2)/2})
       .attr("transform",  function(d){
        let yP = y(d.y)  - 2*space - triangleL*Math.sqrt(2)/2
        return "rotate(45 " + x(d.x) + " " + yP+  ")"})
        .attr("width", triangleL)
        .attr("height", triangleL)
        .attr("fill", "#5d5d5c")
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
       

       label.append("line")
       .attr("x1", function(d){

          let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)
    
          if(xC - labelW/2 < mL){
            return mL
          }
          else if(xC + labelW/2 > mR){
            return mR - labelW
          }
          else{
            return x(d.x) - labelW / 2
          }
   


    })
        .attr("y1", function(d){return y(d.y) - labelH - 2*space})
        .attr("x2", function(d){ 

                    let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)
    
          if(xC - labelW/2 < mL){
            return mL + labelW
          }
          else if(xC + labelW/2 > mR){
            return mR
          }
          else{
            return x(d.x) + labelW / 2
          }
   

        })
        .attr("y2", function(d){ return y(d.y) -labelH - 2*space})
         .attr("class",function(d){
          return "display_series_point" + d.id})

          .attr("stroke-opacity", function(d,idx,dataIdx){
            if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          }
          })

        
      
        .attr("stroke-width", 3)
        .attr("stroke", "#ef6640")



       label.append("text")
       .attr("x", function(d){ 
                  let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)
    
          if(xC - labelW/2 < mL){
            return mL + labelW/2//+ labelW * 0.05
          }
          else if(xC + labelW/2 > mR){
            return mR - labelW/2 //+ labelW*0.05
          }
          else{
            return x(d.x)  //+ labelW*0.05
          }
   


        })
       .attr("y", function(d){return y(d.y) - labelH*0.25- 2* space + labelW * 0.05})
       .attr("text-anchor", "middle")
        .attr("class",function(d){

        
      return "display_series_point" + d.id})
      .text(function (d) { if(d.y || d.y === 0) {return d.y.toString() + " Minutes"}})
         .attr("opacity", function(d, idx, dataIdx){

         if(d.id === $scope.activeObj.student){
            return 1;

          }
          else{
            return 0;
          }
        })
         .attr("font-size", "10px")
         .attr("fill", "#ece2e5")


           label.append("text")
           .attr("text-anchor", "middle")
       .attr("x", function(d){ 
             let xV = d.x
          let mV = Math.round(d.x);
          let xC = x(xV)
          let mL = x(mV - 0.5)
          let mR = x(mV + 0.5)
    
          if(xC - labelW/2 < mL){
            return mL + labelW/2;
          }
          else if(xC + labelW/2 > mR){
            return mR - labelW/2 //labelW + labelW*0.05
          }
          else{
            return x(d.x) //- labelW / 2 + labelW*0.05
          }
   
       })
       .attr("y", function(d){return y(d.y) - 0.6*labelH  - 2*space})
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
         .attr("font-size", "12px")
         .attr("fill", "#ece2e5")


                chart.append("g")
      .attr("class", "invisibleCircles")

      .selectAll("circleTest")
      .data(mergedData, function(d, i){
   
        return i})
      .enter()
      .append("circle")
      .on("click", function(a,b,c){
          
            
                $scope.$emit('graphClick', a, b, c, "student")      
          })
          //.attr("class", "point")
          .attr("class", function(a,b,c){
            return "point_series_invisible" + a.id
          })
        .attr("r", 10)
        /*.attr("fill", function(d, idx, dataIdx){

          if(d.id === $scope.activeObj.student){
            return "#ef6640";

          }
          else{
            return "#7a9ef2";
          }
        }) */
        .attr("opacity", 0)

        .attr("cx", function(d){ return x(d.x);})
        .attr("cy", function(d) { return y(d.y);})


        //chart.enter().exit().remove();
        resize();

      };



      var updateActive = function(){ // FUNCTION THAT IS USED WHEN THE CONTROLLER BROADCASTS AN 'UpdateChart' EVENT
  
        //CIRCLES
        
        d3.selectAll(".point_series" + $scope.activeObj.student).attr("fill","#ef6640")
        d3.selectAll(".point_series" + $scope.activeObj.previousStudent).attr("fill","#7a9ef2")
      

        // CONNECTING LINE

        d3.selectAll(".display_series" + $scope.activeObj.student).attr("opacity", 1)
        d3.selectAll(".display_series" + $scope.activeObj.previousStudent).attr("opacity",0)


        // LABEL RECTANGLES

        d3.selectAll(".display_series_point" + $scope.activeObj.student).attr("opacity",1).attr("stroke-opacity",1)
        d3.selectAll(".display_series_point" + $scope.activeObj.previousStudent).attr("opacity",0).attr("stroke-opacity",0)

      };

      var resize = function() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); 
      }

      // WATCHING & LISTENING IN SCATTER PLOT D3 DIRECTIVE
      $scope.$on('windowResize',resize);
      $scope.$on('updateChart', updateActive)  
      $scope.$watch('d3Data', update);


    };
    return { // OBJECT RETURNED BY SCATTER PLOT D3 DIRECTIVE //previous classes: chart col-sm-12 col-md-12 col-lg-12 col-xl-12
      template: '<div class="scatter-chart "></div>',
      replace: true,
    
      scope: {
        d3Data: '=data',
        activeObj: '=activeobj',
        startMonth: '=start',
        numberOfMonth: '=duration',
        monthLabels: '=labels'
      },
      link: link,
      restrict: 'E' // "Make this an html element"
    };
}]);
// END SCATTER PLOT D3 DIRECTIVE


