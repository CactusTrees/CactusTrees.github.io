var width, height,
  svg,
  partition,
  nodes, links, bundle, maxDepth, numLeaf,
  treeOnly;

function icicle(file, container) {
  // fit visualization to container
  width = parseInt(container.style('width'), 10);
  height = parseInt(container.style('height'), 10);

/*
  // fit container to visualization
  width = 750,
  height = 750;

  container.style("height", height + "px");
  container.style("width", width + "px");
*/

//  svg = d3.select("body").append("svg")
  svg = container.append('svg')
    .attr("width", width+300)
    .attr("height", height);

  partition = d3.layout.partition()
    .size([width, height])
    .value(function(d) { return d.size; });

//var nodes, links;    
  bundle = d3.layout.bundle();
  maxDepth=0, numLeaf=0;

  treeOnly = false;

  d3.json(file, function(error, classes) {
    if (error) throw error;

    //debugger;
    var root = packageHierarchy(classes);
    nodes = partition.nodes(root);
    nodes.forEach(function(d) {
      d.x = /*50+*/d.x+d.dx/2;
      d.y = -d.dy+d.y;
    });

   nodes.forEach(function(d) { 
        if (d.depth>maxDepth)
            maxDepth = d.depth;
        if (!d.children)
            numLeaf++;
    });

    svg.selectAll(".node")
        .data(nodes)
        .enter().append("rect")
        .attr("class", "node")
        .attr("x", function(d) { return d.x-d.dx/2; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d) { return d.dy; })
        .style("fill", function(d) { 
          if (d.depth==0)
            return "#fff"
          return color(d); })
        .style("stroke", function(d) { 
          if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name] )
                  return "#000";
        })        
        .style("stroke-width", function(d) { 
          if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                  return 1;        
      });

        /*
    svg.selectAll(".label")
        .data(nodes.filter(function(d) { return d.dx > 6; }))
      .enter().append("text")
        .attr("class", "label")
        .attr("dy", ".35em")
        .attr("transform", function(d) { return "translate(" + (d.x + d.dx / 2) + "," + (d.y + d.dy / 2) + ")rotate(90)"; })
        .text(function(d) { return d.name; });*/

      if (!treeOnly){
        links = packageImports(nodes);

        var _line = d3.svg.line()
        .interpolate("bundle")
        .tension(0.97)
        .x(function(d) { return d.x })
        .y(function(d) { return d.y })

        link = svg.selectAll("path.link")
          .data(bundle(links))
        .enter().append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return _line(d)
          });
      }  
  /*
        svg.append("text")
          .attr("class", "nodeLegend")
          .attr("x", width/2+40)
          .attr("y", height-70)
          .text("Icicle plot")
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .style("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-weight", "bold");

        var filename2 = file.split("/");
        svg.append("text")
          .attr("class", "nodeLegend")
          .attr("x", width/2+40)
          .attr("y", height-45)
          .text("Data: "+filename2[filename2.length-1])
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "18px")
          .style("text-anchor", "middle")
          .style("fill", "#000");
          //.style("font-weight", "bold");*/
     
  });
}