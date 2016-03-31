var diameter, radius, innerRadius,
  cluster,
  svg,
  g1,link,node,bundle,
  line,nodes,links,
  maxDepth,numLeaf,
  linkTree,
  linkTree_selection,
  treeOnly;

function classical(file, container) {
  // fit visualization to container
  diameter = parseInt(container.style('height'), 10),
  radius = diameter / 2,
  innerRadius = radius - 120;

/*
  // fit container to visualization

  diameter = 750,
  radius = diameter / 2,
  innerRadius = radius - 120;

  container.style("height", diameter + "px");
  container.style("width", diameter + "px");
*/

  cluster = d3.layout.cluster()
    .size([360, innerRadius])
    .sort(null)
    .value(function(d) { return d.size; });

//  svg = d3.select("#tree-container").append("svg");
 
  g1 = svg.append('g');
  link = g1.append("g").selectAll(".link"),
  node = g1.append("g").selectAll(".node");
  bundle = d3.layout.bundle();

//  line;
//  nodes;
//  links;
  maxDepth=0, numLeaf=0;

//  linkTree;
//  linkTree_selection;

  treeOnly = false;

  d3.json(file, function(error, classes) {
    svg = container.append('svg')
//  svg = d3.select("#tree-container").append("svg")
      .attr("width", diameter)
      .attr("height", diameter+300).append('g');
      
     var tree = d3.layout.tree().size([diameter,diameter]);
      nodes = tree(packageHierarchy(classes));
      nodes.forEach(function(d) { 
          if (d.depth>maxDepth)
              maxDepth = d.depth;
          if (!d.children)
              numLeaf++;
      });
      var sub_y = nodes[1].y;
      nodes.forEach(function(d) { 
          d.y = d.y-sub_y+20;
      }); 

     /// Hierarchical links
      linkTree = d3.layout.tree().links(nodes);
      linkTree_selection = svg.selectAll(".linkTree").data(linkTree).enter(); 
      linkTree_selection.append("line")
        .attr("class", "linkTree")
        .attr("stroke", function(d) { 
              if (d.source.name=="")
                  return "#ff0000";
              else
                  return color(d.source);
          })
        .attr("stroke-width", function(d) { 
              if (d.source.name=="")
                  return 0;           // remove root link
              else{
                  if (treeOnly)
                    return 1;
                  else
                    return 0.6;
              }    
          })
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return Math.round(d.source.y); })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return Math.round(d.target.y); });


     links = packageImports(nodes);

     // debugger
      
     var _line = d3.svg.line()
      .interpolate("bundle")
      .tension(0.97)
      .x(function(d) { return d.x })
      .y(function(d) { return d.y })

    
       svg.append("g").selectAll(".node").data(nodes).enter()
          .append("circle")
          .attr({
              r: function(d) { 
                  if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                      return diameter*2/numLeaf;
                  return diameter*0.5/numLeaf; },
              cx: function(d) { return d.x },
              cy: function(d) { return d.y }
          })
       .style("fill", function(d) { 
          if (d.depth==0)
              return "#fff";// Disable root node
          return color(d); 
      })
       .style("stroke", function(d) { 
          if (listSelected1[d.name] || listSelected2[d.name]|| listSelected3[d.name] || d.depth<=1)
                  return "#000";
      })
       .style("stroke-width",  function(d){ 
        if (d.depth<=1) return 2 ;
           else return 1.5 ; })
        ;
   node = svg.append("g").selectAll(".node");
      link = svg.append("g").selectAll(".link");
     
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
          .attr("x", diameter/2)
          .attr("y", diameter-50)
          .text("Reingold–Tilford Tree")
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .style("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-weight", "bold");

        var filename2 = file.split("/");
        svg.append("text")
          .attr("class", "nodeLegend")
          .attr("x", diameter/2)
          .attr("y", diameter-25)
          .text("Data: "+filename2[filename2.length-1])
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "18px")
          .style("text-anchor", "middle")
          .style("fill", "#000");
          //.style("font-weight", "bold");  */
  });
}