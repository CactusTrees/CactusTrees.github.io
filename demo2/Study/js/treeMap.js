var width, height,
  treemap,
  svg, cluster,
  maxDepth, numLeaf, link, bundle, links, treeOnly;

function treeMap(file, container) {
  // fit visualization to container
  width = parseInt(container.style('width'), 10);
  height = parseInt(container.style('height'), 10);

/*
  // fit container to visualization
  width = 670,
  height = 670;

  container.style("height", height + "px");
  container.style("width", width + "px");
*/

  treemap = d3.layout.treemap()
      .padding(17)
      .size([width, height])
      .value(function(d) { return d.size; });

  svg = container.append("svg")
//  svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height+200)
      .append("g")
      .attr("transform", "translate(-.5,-.5)");
  cluster = d3.layout.cluster()
      .size([360, 360])
      .sort(null)
      .value(function(d) { return 1; });

  maxDepth=0, numLeaf=0;
  link = svg.selectAll(".link");
  bundle = d3.layout.bundle();
  //links;
  treeOnly = false;

  d3.json(file, function(error, classes) {

    nodes = cluster.nodes(packageHierarchy(classes));
    nodes.splice(0, 1);  // remove the first element (which is created by the reading process)
    nodes.forEach(function(d) { 
          if (d.depth>maxDepth)
              maxDepth = d.depth;
          if (!d.children)
              numLeaf++;
          
      });

    var padding = width/(maxDepth*8);
    treemap.padding(padding);


    var cell = svg.data([nodes[0]]).selectAll("g")
        .data(treemap.nodes)
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    cell.append("rect")
        .attr("width", function(d) { return d.dx; })
        .attr("height", function(d) { return d.dy; })
        //.style("fill", function(d) { return d.children ? color(d.name) : null; })
        .style("fill", function(d) { 
           return color(d); 
      });

    /*    
    cell.append("text")
        .attr("x", function(d) { return d.dx / 2; })
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.children ? null : d.key; });
     */

    var nodes2 = [];
    for (var i=0; i<nodes.length;i++){
      var nod = nodes[i];
      nod.x = nod.x ;
      nod.y = nod.y;
      nodes2.push(nod);
    }

    links = packageImports(nodes2);
    var _line = d3.svg.line()
      .interpolate("bundle")
      .tension(0.98)
      .x(function(d) { return d.x +d.dx / 2})
      .y(function(d) { return d.y +d.dy / 2})

    if (!treeOnly){
      link = link
          .data(bundle(links))
        .enter().append("path")
          .attr("class", "link")
          .attr("d", function(d) {
            return _line(d)
          })
    }    
    
  /*
     svg.append("text")
          .attr("class", "nodeLegend")
          .attr("x", width/2)
          .attr("y", height+25)
          .text("Treemap")
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .style("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-weight", "bold");

        var filename2 = file.split("/");
        svg.append("text")
          .attr("class", "nodeLegend")
          .attr("x", width/2)
          .attr("y", height+50)
          .text("Data: "+filename2[filename2.length-1])
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "18px")
          .style("text-anchor", "middle")
          .style("fill", "#000");
      */
  });
}