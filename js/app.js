angular.module('viz', []);

angular.module('viz').factory('lastfm', ['$http', function ($http) {

  // GET YOUR API KEY. IT'S FREE AT http://www.last.fm/api
  var apiKey = 'c9a308b7993780c2d0891ac9e4ba5b79';

  return {
    topTags: function () {
      var url = 'http://ws.audioscrobbler.com/2.0/';
      return $http.get(url, {
        params: {
          method: 'chart.gettoptags', 
          api_key: apiKey,
          format:'json'
        }
      });
    },
    topArtists: function (tag) {
      var url = 'http://ws.audioscrobbler.com/2.0/';
      return $http.get(url, {
        params: {
          method: 'tag.gettopartists',
          api_key: apiKey,
          tag: tag,
          format:'json'
        }
      });
    }
  };
}]);

angular.module('viz').controller('lastfmCtrl', ['$scope','$window','lastfm',

  function ($scope, $window, lastfm) {
    $scope.tagsize = 'reach';
    $scope.toptags = [];
    $scope.currtag = '';
    $scope.artists = [];
    $scope.d3Data = [[{x: 5, y:67, active: false}, {x:25, y: 96, active: false}, {x:45, y:50, active: false}, {x:65, y: 49, active: false}, {x:85, y:47, active: false}], [{x: 5, y: 28, active: false}, {x: 25, y: 39, active: false}, {x: 45, y: 99, active: false}, {x: 65, y: 77, active: false}, {x: 85, y: 69, active: false}]]
    $scope.activeStudent = 0;


    $window.addEventListener('resize', function () {
      $scope.$broadcast('windowResize');
    });


    $scope.$on('graphClick', function(){

      console.log($scope.d3Data[arguments[3]], "dataset?")
      var studentDataset = $scope.d3Data[arguments[3]];
    
      if($scope.activeStudent === arguments[3]){
        $scope.activeStudent = undefined;
      }
      else{

        $scope.activeStudent = arguments[3]

      }
    })
      
    lastfm.topTags()
      .success(function (res) {
        if (res.error) {
          throw new Error(res.message);
        } else {
          $scope.toptags = res.tags.tag.map(function (t) {
            t.reach    = +t.reach;
            t.taggings = +t.taggings;
            return t;
          });
        }
      });
  }
]);

angular.module('viz').directive('toptagChart', ['lastfm', 

  function (lastfm) {

    var link = function ($scope, $el, $attrs) {
      var diameter = 500;

      var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(2.5);

      var svg = d3.select($el[0]).append("svg")
        .attr({width: diameter, height: diameter})
        .attr("viewBox", "0 0 " + diameter + " " + diameter);

      var chart = svg.append("g");

      chart.append("text").attr("id", "loading")
        .text("Loading...")
        .attr("transform", "translate(200,250)");

      var update = function () {
        var data = $scope.toptags.map(function (d) {
          d.value = d[$scope.tagsize];
          return d;
        });

        bubble.nodes({children: data});

        if (data.length) chart.select("#loading").remove();

        var selection = chart.selectAll(".node")
          .data(data);

        var enter = selection.enter()
          .append("g").attr("class", "node")
          .attr("transform", function (d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
          });

        enter.append("circle")
          .attr("r", function (d) { return d.r; })
          .style("fill", '#547980')
          .on("click", function (d) {
            svg.selectAll("circle").style("fill", '#547980');
            d3.select(this).style("fill", "#9DE0AD");

            lastfm.topArtists(d.name)
              .success(function (res) {
                if (res.error) {
                  throw new Error(res.message);
                } else {
                 $scope.currtag = d.name;
                  var artists = res.topartists.artist.map(function (a) {
                    a.genre = d.name;
                    a.arank = +a['@attr'].rank;
                    return a;
                  });
                  $scope.artists = artists;
                }
              });
          });

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
      };

      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }

      $scope.$on('windowResize',resize);
      $scope.$watch('tagsize', update);
      $scope.$watch('toptags', update);

    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
      link: link, 
      restrict: 'E' 
    };
}]);

angular.module('viz').directive('artistsChart', ['$window', 

  function ($window) {

    var link = function ($scope, $el, $attrs) {
      var csize = [500, 500], radius = 22;

      var svg = d3.select($el[0]).append("svg")
        .attr({width: csize[0], height: csize[1]})
        .attr("viewBox", "0 0 " + csize[0] + " " + csize[1]);

      var chart = svg.append("g");

      var coords = function (position) {
        var x, y;
        x = ((position - 1) % 5) * 100;
        y = (Math.ceil(position / 5)) * 45;
        return {x: x, y: y};
      }

      var transform = function (d) {
        var c = coords(d.arank);
        return "translate(" + (c.x + radius + 30) + "," + c.y + ")"; 
      };

      chart.selectAll(".number")
        .data(d3.range(1,51)).enter()
        .append("text")
          .attr("class", "number")
          .style("text-anchor", "middle")
          .text(function (d) { return d; })
          .attr("transform", function (d) {
            var c = coords(d);
            return "translate(" + (c.x + radius + 30) + "," + (c.y + 12) + ")";
          }); 

      var update = function () {
        console.log("did I get into the update function")
        var data = $scope.artists.map(function (d) {
          d.value = 10;
          return d;
        });

        var selection = chart.selectAll(".node")
          .data(data, function (d) { return d.name; });

        selection.style("opacity", 1)

        selection.transition().duration(2000)
          .attr("transform", transform);

        selection.selectAll("circle")
          .style("fill", "#45ADA8")

        var enter = selection.enter()
          .append("g")
            .attr("class", "node")
            .style("opacity", 0)
            .attr("transform", transform); 

        enter.append("circle")
          .attr("r", radius)
          .style("fill", "#594F4F")
          .on("click", function (d) {
            $window.open(d.url, "_blank");
          });

        enter.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function (d) { return d.name.slice(0,21); });

        enter.transition().duration(2000)
          .style("opacity", 1)

        selection.exit().transition().duration(1000)
          .attr("transform", function (d) {
            return "translate(" + 1000 + "," + 1000 + ")"; 
          }).remove();

        resize();
      };

      function resize() {
        svg.attr("width", $el[0].clientWidth);
        svg.attr("height", $el[0].clientWidth); //It's a square
      }

      $scope.$on('windowResize',resize);
      $scope.$watch('artists', update);
    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
      scope: {artists: '='},
      link: link, 
      restrict: 'E'
    };
}]);


angular.module('viz').directive('scatterChart', ['lastfm', 

  function (lastfm) {

    var link = function ($scope, $el, $attrs) {
      var diameter = 500;
/*
      var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(2.5); */

      var svg = d3.select($el[0]).append("svg")
        .attr({width: diameter, height: diameter})
        .attr("viewBox", "0 0 " + diameter + " " + diameter);

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
        console.log(data, "data in app.js")
        console.log(diameter)
        /*

        var data = $scope.toptags.map(function (d) {
          d.value = d[$scope.tagsize];
          return d;
        });

        
        bubble.nodes({children: data});
        */


        if (data.length) chart.select("#loading").remove();

        var x = d3.scale.linear().domain([0,100]).range([0,diameter])//.range([0,width])//.domain([0,width])
                  console.log(x, "x")

        var y = d3.scale.linear().domain([0,100]).range([diameter, 0])//.range([height,0]//.range([height, 0])
                 
            console.log(y, "y")


        var selection = chart.selectAll(".series")
          .data(data, function (d, i) { return i })

          console.log(selection, "selection")


          /*
        var selection = chart.selectAll(".node")
          .data(data);
*/
      var SVG2 = selection.enter().append("g")

      SVG2.append("path")
      .attr("class","line")
      .attr("stroke", "black")
      .attr("stroke-width", function(d, idx){
        console.log("stroke-width - dataIdx", idx)
        console.log($scope.activeStudent, "scope.activeStudent")
        if(idx === $scope.activeStudent){
            return 3;
        }
        else{
            return 0;
        }

      } )
      .attr("fill", "none")
      .attr("d", function(d){
        console.log(d, "d in linemaking")
        return valueline(d)
      })  

      var enter1 = SVG2.attr("class", function(d,i){return i})

      var enter2 = enter1.selectAll(".point")
      .data(function(d){return d;})


/*
        var enter = selection.enter()
          .append("g").attr("class", "node")
          .attr("transform", function (d) { 
            return "translate(" + d.x + "," + d.y + ")"; 
          }); */



          var enter3 = enter2.enter()


          enter3.append("circle")
          .on("click", function(a,b,c){
            console.log(a,b,c, "a,b,c")
          //  $scope.tagsize = "Apple"
            console.log($scope.tagsize, "tagsize?")
           // $scope.d3Data.push([{x: 33, y:50}])

            //$scope.d3Data =[[{x:33, y:50}, {x:67, y: 78}], [{x: 60, y: 70}, {x: 45, y: 50 }]]
             console.log($scope.d3Data, "d3Data")
             //var enterSelection = selection.enter();
             //console.log(enterSelection, "enterSelection")
             console.log(d3, "d3")
             //console.log($scope.$$listeners.test, "scope is there a broadcast?")
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
        enter.append("circle")
          .attr("r", function (d) { return d.r; })
          .style("fill", '#547980')
          .on("click", function (d) {
            svg.selectAll("circle").style("fill", '#547980');
            d3.select(this).style("fill", "#9DE0AD");

            lastfm.topArtists(d.name)
              .success(function (res) {
                if (res.error) {
                  throw new Error(res.message);
                } else {
                 $scope.currtag = d.name;
                  var artists = res.topartists.artist.map(function (a) {
                    a.genre = d.name;
                    a.arank = +a['@attr'].rank;
                    return a;
                  });
                  $scope.artists = artists;
                }
              });
          }); */
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

        console.log(enter1, 'enter1')
        console.log(enter2, "enter2")
/*
           selection.transition().duration(2000)
          .style("opacity", 1) */
          console.log(selection, "selection")
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
      $scope.$watch('tagsize', update);
      $scope.$watch('toptags', update);


    };
    return {
      template: '<div class="chart col-sm-12 col-md-12 col-lg-12 col-xl-12"></div>',
      replace: true,
      link: link, 
      restrict: 'E' 
    };
}]);


