var width, height,
    svg,
    pack,
    nodes, links,
    maxDepth, numLeaf,
    bundle,
    treeOnly,
    root;


function circlePacking(file, container) {
  // fit visualization to container
  width = parseInt(container.style('width'), 10);
  height = parseInt(container.style('height'), 10);

/*
  // fit container to visualization
  width = 700,
  height = 700;

  container.style("height", height + "px");
  container.style("width", width + "px");
*/

  //var svg = d3.select("body").append("svg")
  svg = container.append("svg")
      .attr("width", width)
      .attr("height", height+100);

  pack = hierarchy.pack()
      .size([width, height]);

//  nodes, links; 
  maxDepth=0, numLeaf=0;

  bundle = d3.layout.bundle();

  treeOnly = false;
//  root;

  d3.json(file, function(error, classes) {
    if (error) throw error;

    root = packageHierarchy(classes);
    root = {
          "name":"AAAAA", "children": [
              {"name":"BBB", value:"10"},
              {"name":"CCC", value:"10" }
          ]
      }

    pack.nodes(root);
    nodes = pack.nodes(root);
  //nodes.splice(0, 1);  // remove the first element (which is created by the reading process)
  //nodes[0].depth=0;
   

    svg.selectAll(".node")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { 
  console.log("r="+d.r);
          return d.r; })
        .style("fill", function(d) { 
          return color(d); })
        .style("stroke", function(d) { 
          if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                  return "#000";
          else{
              return "#fff";
          }      
        })        
        .style("stroke-width", function(d) { 
          if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                  return 1;   
          else
                  return 0.25;   
                      
      });

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
          .attr("x", width/2)
          .attr("y", height+25)
          .text("Circle packing")
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
          //.style("font-weight", "bold");*/
  });

}