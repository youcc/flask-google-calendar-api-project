d3.select("#study").on("click", function() { make_graph("Study Time"); });
d3.select("#outsidereading").on("click", function() { make_graph("Outside Reading"); });
d3.select("#birthday").on("click", function() { make_graph("Birthdays"); });

var width = 2400,
    height = 610;

var svg = d3.select("body").append("svg")
               .attr("width", width)
               .attr("height", height)

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>event:</strong> <span style='color:#2ca25f' class='spanClass'>" + d.event_name + "</span>" +
                     "<strong>date:</strong> <span style='color:#2ca25f' class='spanClass'>" + d.date + "</span>";
            })

svg.call(tip); //http://bl.ocks.org/Caged/6476579

function make_graph(event_type) {
  url = "http://127.0.0.1:5000/api/".concat(event_type)
  d3.json(url, function(error, data) {
  	
    console.log(event_type.concat("is loaded!"))
    console.log(data['json_list'])
  	
    var dataset = data['json_list']
    var barwidth = width / dataset.length;

    // Reference: http://bost.ocks.org/mike/bar/3/
    var x = d3.scale.linear()
              .domain([0, dataset.length])
              .range([0, width]);

    var y = d3.scale.linear()
              .domain([0, d3.max(dataset, function(d) { return d.duration; })])
              .range([height - 10, 0]);

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .ticks(25)
                  .orient("bottom");

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .ticks(10)
                  .orient("left");

    svg.append("g")
          .attr("class", "xaxis")
          .attr("transform", "translate(50," + (height - 20) + ")")
          .transition()
          .duration(750)
          .call(xAxis)

    svg.append("g")
          .attr("class", "yaxis")
          .attr("transform", "translate(50, 0)")
          .transition()
          .duration(750)
          .call(yAxis);

    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .transition()
       .duration(2000)
       .attr("transform", function(d, i) {
            return "translate(" + (i * barwidth + 50) + ",0)"; })    
       .attr("y", function(d) { return y(d.duration); })
       .attr("height", function(d) { return height - y(d.duration - 10); })
       .attr("width", barwidth - 1)
       .attr("fill", "#fdae6b")

    svg.selectAll(".bar")
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide);
  });
}