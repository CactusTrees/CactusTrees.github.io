
//===============================================
var brush;
var slider;
var handle;
var xScale;
var xSlider = 70;
var ySlider = 25;

function setupSliderScale(svg) {
  xScale = d3.scale.linear()
    .domain([0.001, height/Math.pow(nodes.length,0.8)])
    .range([xSlider, 180])
    .clamp(true);

  brush = d3.svg.brush()
    .x(xScale)
    .extent([scaleRate, scaleRate])
    .on("brush", brushed);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + ySlider + ")")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .call(d3.svg.axis()
      .scale(xScale)
      .ticks(4)
      .orient("bottom")
      .tickFormat(function(d) { return d; })
      .tickSize(0)
      .tickPadding(5))
  .select(".domain")
  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
    .attr("class", "halo");

  svg.append("text")
    .attr("class", "sliderText")
    .attr("x", xSlider-5)
    .attr("y", ySlider)
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Scale Tree")
    .style("text-anchor","end"); 

  slider = svg.append("g")
    .attr("class", "slider")
    .call(brush);

  slider.selectAll(".extent,.resize")
    .remove();

  slider.select(".background")
    .attr("y",ySlider-5)
    .attr("height", 10);

 handle = slider.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + ySlider + ")")
    .attr("r", 6);

  slider
    .call(brush.event)
    .transition() // gratuitous intro!
    .duration(750)
    .call(brush.event);
}

function brushed() {
  var value = brush.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = xScale.invert(d3.mouse(this)[0]);
    brush.extent([value, value]);
  }
  handle.attr("cx", xScale(value));
  //console.log(value);
  scaleCircle =value;
  setupTree();
  update();

}
