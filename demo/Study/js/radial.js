var diameter, radius, innerRadius,
    cluster,
    bundle,
    line,
    svg,
    g1,
    link, node,
    maxDepth;

var nodes, links, linkTree;
var linkTree_selection;

function radial(file, container) {
  // fit visualization to container
  diameter = parseInt(container.style('height'), 10),
  radius = diameter / 2,
  innerRadius = radius - 120;

/*
  // fit container to visualization
  diameter = 750,
  radius = diameter / 2,
  innerRadius = radius - 20;

  container.style("height", diameter + "px");
  container.style("width", diameter + "px");
*/

  cluster = d3.layout.cluster()
      .size([360, innerRadius])
      .sort(null)
      .value(function(d) { return d.size; });

  bundle = d3.layout.bundle();

  line = d3.svg.line()
      .interpolate("bundle")
      .tension(0.97)
      //.radius(function(d) { return d.y; })
      //.angle(function(d) { return d.x / 180 * Math.PI; });
      .x(function(d) { return d.x })
      .y(function(d) { return d.y });

//  svg = d3.select("body").append("svg")
  svg = container.append("svg")
      .attr("width", diameter)
      .attr("height", diameter+100)
      .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  g1 = svg.append('g');

  link = g1.append("g").selectAll(".link"),
  node = g1.append("g").selectAll(".node");

  maxDepth = 0;

  d3.json(file, function(error, classes) {
   nodes = cluster.nodes(packageHierarchy(classes));

    var a = [];
    nodes.forEach(function(d) {
      if (!d.children)
        a.push(d);
    });

    a.sort(function (a, b) {
      if (a.x < b.x) {
        return 1;
      }
      else if (a.x > b.x) {
        return -1;
      }
      else 
        return 0;
    });  

    var gapX = (radius)/(a.length+1);
    for (var i=0;i<a.length;i++){
      a[i].x = i*gapX;
    }

    // compute a balance tree
    var balance = false;
    nodes.forEach(function(d) {
      if (!d.children){
         d.fromLeaf = 0;       
      }        
    });

    while (!balance){
      balance = true;     
      nodes.forEach(function(d) {
        if (d.children){
          var isAllChildrenComputed = true;
          var sum = 0;
          var num = 0;
          fLeaf = -100;
          for (var i=0; i<d.children.length;i++){
              var nod = d.children[i];
              if (nod.children && !nod.numLeaf){
                  isAllChildrenComputed = false;
              }  
              if (!nod.children){
                num++;
                sum += nod.x;
                if (fLeaf<0)
                 fLeaf = 0;
              }  
              else{
                if (nod.fromLeaf>fLeaf)
                   fLeaf = nod.fromLeaf;
                num+=nod.numLeaf;
                sum += nod.x*nod.numLeaf;
              }  
             
          }
          if (d.children && isAllChildrenComputed){
              if (!d.numLeaf){
                d.numLeaf = num;
                d.x = sum/d.numLeaf;
                d.fromLeaf = fLeaf+1;
              //  console.log(d.x+" "+d.name+"  "+d.fromLeaf);
              }
          }
          else {
              balance = false;
          }
        }

      }); 
    }

    var maxX = 0;

    nodes.forEach(function(d) {
      if (d.x>maxX)
        maxX = d.x;
    }); 
    nodes.forEach(function(d) {
      d.y = maxX;
    }); 

    maxDepth = nodes[0].fromLeaf;


    var numLevelFromLeaf = nodes[0].fromLeaf;
    var gap = radius*0.6/(numLevelFromLeaf);


    nodes.forEach(function(d) { 
      d.r2 = radius*0.6+d.fromLeaf*gap*0.6;
      if (d.children)
        d.r2 = radius*0.6+(d.fromLeaf-0.6)*gap*0.6;

      var start = 2*Math.PI*(d.x/(d.y+maxX/nodes[0].numLeaf));
      var xx1 = (radius*0.6-d.fromLeaf*gap)*Math.cos(start);
      var yy1 = (radius*0.6-d.fromLeaf*gap)*Math.sin(start);
      var xx2 = (d.r2)*Math.cos(start);
      var yy2 = (d.r2)*Math.sin(start);
      d.x = xx1;
      d.y = yy1; 
      d.x2 = xx2;
      d.y2 = yy2;  
    });
    nodes[0].x = 0;
    nodes[0].y = 0;
    nodes[1].x = 0;
    nodes[1].y = 0;

    var nodes2 = [];
    for (var i =0; i<nodes.length;i++){
      if (nodes[i].children && nodes[i].depth>0)
        nodes2.push(nodes[i]);
    }

    links = packageImports(nodes);
  /*  linkTree = d3.layout.tree().links(nodes);
     linkTree_selection = svg.selectAll(".linkTree").data(linkTree).enter(); 
     linkTree_selection.append("line")
        .attr("class", "linkTree")
        .attr("stroke", "#00ff00")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return Math.round(d.source.y); })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return Math.round(d.target.y); });
  */

    var nodeEnter = svg.selectAll("g.node").data(nodes)
          .enter().append("circle")
          .attr("class",  function(d) { return d.children ? "node" : "leaf node"; })
          .attr("cx", function(d) { return d.x2})
          .attr("cy", function(d) { return d.y2})
          .style("fill", function(d) { 
            if (d.depth==0)
              return "#fff"
            return color(d); })
          .attr("r", function(d) { 
            if (d.children)
              return (0)
            else 
              return 30/Math.sqrt(nodes.length);})
          //.attr("transform", function(d) { return "rotate(" + (d.x-90) + ")translate(" + (d.y) + ")"; })
          ;

      link = link
          .data(bundle(links))
          .enter().append("path")
          .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
          .attr("class", "link")
          .attr("d", line);

        

    var arcMin = radius*0.6;
        

    var drawArc = d3.svg.arc()
        .innerRadius(function(d, i) {
          return d.r2 ;
        })
        .outerRadius(function(d, i) {
          return d.r2 + gap*0.6-0.4;
        })
        .startAngle( function(d, i) { 
          var alpha = d.numLeaf/ nodes[0].numLeaf;
          var start = Math.atan(d.y2/d.x2)-(alpha/2)*Math.PI*2-Math.PI/2;
          if (-d.x2<0) start+=Math.PI;
            

          return start;
         })
        .endAngle(function(d, i) {
          var alpha = d.numLeaf/ (nodes[0].numLeaf);
          
          var result =   Math.atan(d.y2/d.x2)+(alpha/2)*Math.PI*2-Math.PI/2;
          if (-d.x2<0) result+=Math.PI;
         
          return result;
          
        });


    linkArcs = svg.append("g").selectAll("path")
          .data(nodes2)
          .enter().append("path")
          .attr("class", "linkArc")
          .style("fill", function(d, i) {
             return color(d);
          })
          .style("stroke", function(d, i) {
             if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                  return "#000";
              return "#eeeeee";
          
          })
          .style("stroke-width", 1)
          .style("stroke-opacity", 0.8)
          .style("fill-opacity", 1)
         // .attr("d", linkArc)
          .attr("d", drawArc) ; 
        

  /*
      svg.append("text")
          .attr("class", "nodeLegend3")
          .attr("x", 0)
          .attr("y", diameter/2)
          .text("Radial Layout")
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "20px")
          .style("text-anchor", "middle")
          .style("fill", "#000")
          .style("font-weight", "bold");

        var filename2 = file.split("/");
        svg.append("text")
          .attr("class", "nodeLegend3")
          .attr("x", 0)
          .attr("y", diameter/2+25)
          .text("Data: "+filename2[filename2.length-1])
          .attr("dy", ".21em")
          .attr("font-family", "sans-serif")
          .attr("font-size", "18px")
          .style("text-anchor", "middle")
          .style("fill", "#000");
          //.style("font-weight", "bold");  
          
  */

  });//close d3.json()
/*
  mouseovered = function(d) {
    node
        .each(function(n) { n.target = n.source = false; });

    link
        .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
        .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
        .filter(function(l) { return l.target === d || l.source === d; })
        .each(function() { this.parentNode.appendChild(this); });

    node
        .classed("node--target", function(n) { return n.target; })
        .classed("node--source", function(n) { return n.source; });
  };

  mouseouted = function(d) {
    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
  };
  */
}