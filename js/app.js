/**
 * Created by Iaroslav Zhbankov on 29.01.2017.
 */
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', false);
xhr.send();
if (xhr.status != 200) {
    alert(xhr.status + ': ' + xhr.statusText);
} else {
    var response = JSON.parse(xhr.responseText);
}

/*function secondsToMinutes(time){
 var minutes = Math.floor(time / 60);
 var seconds = time - minutes * 60;
 return minutes + ":" + seconds;
 }*/

var firstVal = response[0].Seconds;
var data = response.map(function (item, index) {
    item.Seconds = item.Seconds - firstVal;
    return item;
});
console.log(data);
var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup x
var xValue = function (d) {
        return d.Seconds;
    }, // data -> value
    xScale = d3.scale.linear().range([width, 0]), // value -> display
    xMap = function (d) {
        return xScale(xValue(d));
    }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function (d) {
        return d.Place;
    }, // data -> value
    yScale = d3.scale.linear().range([0, height]), // value -> display
    yMap = function (d) {
        return yScale(yValue(d));
    }, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function (d) {
        if (d.Doping == '') {
            return "No doping allegations";
        } else {
            return "Riders with doping allegations";
        }
    },
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select(".graph").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// don't want dots overlapping axis, so add in buffer to data domain
xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

// x-axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width/2+150)
    .attr("y", 50)
    .style("text-anchor", "end")
    .text("Seconds Behind Fastest Time");

// y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Ranking");

// draw dots
svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("r", 3.5)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", function (d) {
        return color(cValue(d));
    })
    .on("mouseover", function (d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9)
            .style("text-align", "center");
        tooltip.html(d.Name + ": " + d.Nationality + "<div> Year:" + d.Year
            + ", Time: " + d.Time + "</div><br>" + "<div>" + d.Doping + "</div>")
            .style("left", (850) + "px")
            .style("top", (350) + "px");
    })
    .on("mouseout", function (d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

// draw legend
var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
    });

// draw legend colored rectangles
legend.append("circle")
    .attr("r", 3.5)
    .attr("cx", width-220)
    .attr("cy", height/2-5)
    .style("fill", color);

// draw legend text
legend.append("text")
    .attr("x", width - 200)
    .attr("y", height/2)
    .style("text-anchor", "start")
    .text(function (d) {
        return d;
    });
