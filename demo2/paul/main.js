/* global d3 */

var file = "data/flare_package.json";

var innerRadius = 20;

function getTree(data) {
  return packageHierarchy(data);
}

function getLinksFromNodes(nodes) {
  return packageImports(nodes);
}

var cluster = d3.layout.cluster()
  .size([360, innerRadius])
  .sort(null)
  .value(function(d) { return d.size; });

new Promise(function(resolve) { d3.json(file, resolve); })
  .then(function(classes) {
    var tree = getTree(classes);
    
    nodes = cluster.nodes(tree);
    
    // remove the first element (which is created by the reading process)
   // nodes.splice(0, 1);  
    
    links = getLinksFromNodes(nodes);
    
    linkTree = d3.layout.tree().links(nodes);
    
    tree_nodes = d3.layout.tree().nodes(classes);
    
    
    nodes.forEach(function(d) {
      if (d.depth == 0){
        root = d;
      } 
    });
  
    treeLayout.sort(comparator);
    
    function comparator(a, b) {
      return b.order2 - a.order2;
    }
    
    childDepth1(root); 
    count1 = childCount1(0, root); 
    count2 = childCount2(0, root);  // DFS id of nodes are also set in this function
    root.idDFS = nodeDFSCount++; 
    root.order1 =0;
  
    //Assign id to each node, root id = 0
    nodes.forEach(function(d,i) {
      d.id =i;
    });
  // dfs(root);
  
    setupTree();
    drawNodeAndLink();
    update();
    //addSearchBox();
    setupSliderScale(svg);
    setupSliderRadius(svg);
  })


//===============================================
var brushRadius;
var sliderRadius;
var handleRadius;
var xScaleRadius;

var ySliderRadius = 70;

function setupSliderRadius(svg) {
  xScaleRadius = d3.scale.linear()
    .domain([0.1, 1])
    .range([xSlider, 180])
    .clamp(true);

  brushRadius = d3.svg.brush()
    .x(xScaleRadius)
    .extent([scaleRadius, scaleRadius])
    .on("brush", brushedRadius);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + ySliderRadius + ")")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .call(d3.svg.axis()
      .scale(xScaleRadius)
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
    .attr("y", ySliderRadius)
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text("Scale Children")
    .style("text-anchor","end"); 

  sliderRadius = svg.append("g")
    .attr("class", "slider")
    .call(brushRadius);

  sliderRadius.selectAll(".extent,.resize")
    .remove();

  sliderRadius.select(".background")
    .attr("y",ySliderRadius-5)
    .attr("height", 10);

 handleRadius = sliderRadius.append("circle")
    .attr("class", "handle")
    .attr("transform", "translate(0," + ySliderRadius + ")")
    .attr("r", 6);

  sliderRadius
    .call(brushRadius.event)
    .transition() // gratuitous intro!
    .duration(750)
    .call(brushRadius.event);
}

function brushedRadius() {
  var value = brushRadius.extent()[0];

  if (d3.event.sourceEvent) { // not a programmatic event
    value = xScaleRadius.invert(d3.mouse(this)[0]);
    brushRadius.extent([value, value]);
  }
  handleRadius.attr("cx", xScaleRadius(value));
  scaleRadius =value;
  
  //d3.select("body").style("background-color", d3.hsl(value*20, .8, .8));
 
  // scaleRate = height/(height-minY);
  //scaleCircle = 10-value;
  //handle.attr("cx", xScale(scaleCircle));
  //console.log("scaleCircle1 = "+scaleCircle);

  setupTree();
  update();
}



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


var listSelected1 = {}
 var listSelected2 = {}
 var listSelected3 = {}
 
 function color(d) {
  var minSat = 0;
  var maxSat = 230;
  var step = (maxSat-minSat)/maxDepth;
  var sat = Math.round(maxSat-d.depth*step);
  if (listSelected1[d.name])
    return "#77ff77";
  else if (listSelected2[d.name])
    return "#ffff66";
  else if (listSelected3[d.name])
    return "#ffaaff";
  
  //console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#77f"; // leaf node
}

d3.select('body').selectAll('input').data(Array(20))
  .enter().append('input')
    .attr({ 
      type: 'checkbox',
      id: function(_, i) { return 'checkbox' + i; } 
    })
    .property({ checked: true });
    
// Compute quads of adjacent points [p0, p1, p2, p3].
function quad(points) {
  return d3.range(points.length - 1).map(function(i) {
    var a = [points[i - 1], points[i], points[i + 1], points[i + 2]];
    a.t = (points[i].t + points[i + 1].t) / 2;
    return a;
  });
}

// Compute stroke outline for segment p12.
function lineJoin(p0, p1, p2, p3, width) {
  var u12 = perp(p1, p2),
      r = width / 2,
      a = [p1[0] + u12[0] * r, p1[1] + u12[1] * r],
      b = [p2[0] + u12[0] * r, p2[1] + u12[1] * r],
      c = [p2[0] - u12[0] * r, p2[1] - u12[1] * r],
      d = [p1[0] - u12[0] * r, p1[1] - u12[1] * r];

  if (p0) { // clip ad and dc using average of u01 and u12
    var u01 = perp(p0, p1), e = [p1[0] + u01[0] + u12[0], p1[1] + u01[1] + u12[1]];
    a = lineIntersect(p1, e, a, b);
    d = lineIntersect(p1, e, d, c);
  }

  if (p3) { // clip ab and dc using average of u12 and u23
    var u23 = perp(p2, p3), e = [p2[0] + u23[0] + u12[0], p2[1] + u23[1] + u12[1]];
    b = lineIntersect(p2, e, a, b);
    c = lineIntersect(p2, e, d, c);
  }

  return "M" + a + "L" + b + " " + c + " " + d + "Z";
}

// Compute unit vector perpendicular to p01.
function perp(p0, p1) {
  var u01x = p0[1] - p1[1], u01y = p1[0] - p0[0],
      u01d = Math.sqrt(u01x * u01x + u01y * u01y);
  return [u01x / u01d, u01y / u01d];
}

// Compute intersection of two infinite lines ab and cd.
function lineIntersect(a, b, c, d) {
  var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
      y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
      ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
  return [x1 + ua * x21, y1 + ua * y21];
}


/// Sample the SVG path string "d" uniformly with the specified precision.
function sample(d, precision) {
  var path = document.createElementNS(d3.ns.prefix.svg, "path");
  path.setAttribute("d", d);

  var n = path.getTotalLength(), t = [0], i = 0, dt = precision;
  while ((i += dt) < n) t.push(i);
  t.push(n);

  return t.map(function(t) {
    var p = path.getPointAtLength(t), a = [p.x, p.y];
    a.t = t / n;
    return a;
  });
}

var innerRadius = 10;

function childDepth1(n) {
    if(n.children && n.children.length > 0) {
      n.maxDepth = 0;
      n.children.forEach(function(d) {
        var childrenDeep = childDepth1(d);
        console.log(" childrenDeep="+childrenDeep);
        if (childrenDeep>n.maxDepth)
          n.maxDepth = childrenDeep;
      });
    }
    else{
       n.maxDepth = n.depth;
    }
    return n.maxDepth;
};

function childCount1(level, n) {
    count = 0;
    if(n.children && n.children.length > 0) {
      count += n.children.length;
      n.children.forEach(function(d) {
        count += childCount1(level + 1, d);
      });
      n.childCount1 = count;
    }
    else{
       n.childCount1 = 0;
    }
    return count;
};

function getRadius(d) {
 // console.log("scaleCircle = "+scaleCircle +" scaleRadius="+scaleRadius);
return d._children ? scaleCircle*Math.pow(d.childCount1, scaleRadius)// collapsed package
      : d.children ? scaleCircle*Math.pow(d.childCount1, scaleRadius) // expanded package
      : scaleCircle*0.75;
     // : 1; // leaf node
}

function getBranchingAngle1(radius3, numChild) {
  if (numChild<=2){
    return Math.pow(radius3,2);
  }  
  else
    return Math.pow(radius3,0.9);
 } 
 
// Toggle children on click.
function click(d) {
/*  if (d3.event.defaultPrevented) return; // ignore drag
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  console.log("Clicking on = "+d.name+ " d.depth = "+d.depth);
  
 update();*/
}

function childCount2(level, n) {
    var arr = [];
    if(n.children && n.children.length > 0) {
      n.children.forEach(function(d) {
        arr.push(d);
      });
    }
    arr.sort(function(a,b) { return (a.maxDepth*100+a.childCount1) - (b.maxDepth*100+b.childCount1) } );
    var arr2 = [];
    arr.forEach(function(d, i) {
        d.order1 = i;
        arr2.splice(arr2.length/2,0, d);
    });
    arr2.forEach(function(d, i) {
        d.order2 = i;
        childCount2(level + 1, d);
        d.idDFS = nodeDFSCount++;   // this set DFS id for nodes
    });

};

// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  classes.forEach(function(d) {
    find(d.name, d);
  });
  return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
    if (d.imports) 
      d.imports.forEach(function(i) {
        imports.push({source: map[d.name], target: map[i]});
    });
  });
  return imports;
}

var bundle = d3.layout.bundle();

var lineBundle = d3.svg.line()
      .interpolate("bundle")
      .tension(0.97)
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; });

var width = 1400,
    height = 780,
    root;

/*var force = d3.layout.force()
    .linkDistance(50)
    .charge(-120)
    .gravity(.15)
    .size([width, height])
    .on("tick", tick);*/
     
var svg = d3.select("body").append("svg")
    .attr("id", "SVGmain")
    .attr("width", width)
    .attr("height", height+100);

var relationship_selection = svg.selectAll(".link");
var linkTree_selection = svg.selectAll(".link"),
    node_selection = svg.selectAll(".node1"); // Empty selection at first
  
var nodeEnter;
var nodes
var time = 0;
var newNodes; 


var i = 0,
    duration = 750,
    rootSearch;
var treeSearch;
var diagonal;



var treeLayout = d3.layout.tree().size([ width, height ]);
var scaleCircle = 1;  // The scale to update node size, defined by sliderScale.js
var scaleRate;
var scaleRadius = 0.7;  // The scale betweeb parent and children nodes, defined by sliderRadius.js
 
var maxDepth=1;
var setIntervalFunction;


var nodeDFSCount = 0;  // this global variable is used to set the DFS ids for nodes

//var file = "data/0_RAF_Dot.json";

//var file = "data/1_Activation of Pro-caspase 8 Pathway.json";
//var file = "data/2_ERBB2 Pathway.json";
//var file = "data/3_Signaling to GPCR Pathway.json";




var treeOnly = false;



function setupTree() {
  var disFactor = 2;
  var minY = height*100;   // used to compute the best scale for the input tree
  newNodes = treeLayout(root).map(function(d,i) {
    if (d.depth==0){
       d.treeX = 700; 
       d.treeY = height-getRadius(root)/1;
       d.alpha = -Math.PI/2; 
    }
    if (d.children){
      var totalRadius = 0;
      var totalAngle = Math.PI*1.2;
      var numChild =  d.children.length;
      d.children.forEach(function(child) {
        totalRadius+=getBranchingAngle1(getRadius(child), numChild);
      });  

      var begin=d.alpha-totalAngle/2;
      d.children.forEach(function(child,i2) {
        xC =  d.treeX;
        yC =  d.treeY;
        rC = getRadius(d)+getRadius(child)/disFactor;
        child.treeRC = rC;

        var additional = totalAngle*getBranchingAngle1(getRadius(child), numChild)/totalRadius;
        child.alpha = begin+additional/2;
        child.treeX = xC+rC*Math.cos(child.alpha); 
        child.treeY = yC+rC*Math.sin(child.alpha); 
        
        if (child.treeY-rC<minY) {
          minY = child.treeY-rC;
        };
        if (child.depth>maxDepth){
          maxDepth = child.depth;
        }
        begin +=additional;
      });
    }
    scaleRate = height/(height-minY);
  //  console.log(" minY = "+minY +"  "+scaleRate);
   // console.log("maxDepth = "+maxDepth);
    return d;
  });
  /// Restart the force layout.
  //  force.nodes(newNodes);
  //  force.links(linkTree);
  //  force.start();

    
}  






function drawNodeAndLink() {
// Update links of hierarchy.
  linkTree_selection = linkTree_selection.data(linkTree, function(d) { return d.target.id; });
  linkTree_selection.exit().remove();
  linkTree_selection.enter().append("line")
      .attr("class", "linkTree");

  // Update nodes.
  svg.selectAll(".node1").remove();
  node_selection = svg.selectAll(".node1").data(nodes);
  nodeEnter = node_selection.enter().append("g")
    .attr("class", "nodeG")
    .on("click", click);
 //   .call(force.drag);
  

  // Draw nodes *****************************************************
  nodeEnter.append("circle")
    .attr("class", "node1")
    .attr("id", function(d) { return d.idDFS; })
    .attr("r", getRadius)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .style("stroke", function(d) { 
        if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name])
                return "#000";
      })        
      .style("stroke-width", function(d) { 
        if (listSelected1[d.name] || listSelected2[d.name] || listSelected3[d.name] )
                return 1;        
    }); 

 nodeEnter.append("image")
    .attr("class", "nodeImage3")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("height", getRadius)
    .attr("width", getRadius)
    .attr("fill", "#ff0000")
    .attr("xlink:href", function(d) { 
    var nodeName = d.key;
    
    /*  // LOAD image from google
    var url = "https://www.google.com/search?q="+nodeName+"&es_sm=91&source=lnms&tbm=isch&sa=X&ved=0CAcQ_AUoAWoVChMIjdeehPSAxwIVgigeCh3dNQJ3&biw=1432&bih=761";
    if (nodeName!="0" && nodeName!="1"){
      resolver.resolve(url, function( result ){
          if (result) {
            d.image =  result.image ;
            //  $('body').css('background-image', 'url(' + result.image + ')');
          } else {
            d.image = "http://www.fnordware.com/superpng/pngtest8rgba.png";  
          }
      });
    }  */
  });
  

  nodeEnter.append("text")
    .attr("class", "nodeText")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .style("text-anchor", "middle")
    .text(function(d) {   
      if (d.key=="0" || d.key=="1")
            return "";
      else 
        return d.key; });

   nodeEnter.on('mouseover', mouseovered)
      .on("mouseout", mouseouted);

}


function update() {
    d3.selectAll(".node1").each(function(d) {
        d.x = (d.treeX ); //*event.alpha;
        d.y = d.treeY ; })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", getRadius)
      .style("fill", function(d) { 
        var defs = svg.append("defs").attr("id", "imgdefs")
        var catpattern = defs.append("pattern")
                                .attr("id", "catpattern"+d.key)
                                .attr("height", 1)
                                .attr("width", 1)
                                .attr("x", "0")
                                .attr("y", "0")

        catpattern.append("image")
             .attr("class", "nodeImage2")
             .attr("x", -getRadius(d)*0.25)
             .attr("y", -getRadius(d)*0.25)
             .attr("height", getRadius(d)*2.5)
             .attr("width", getRadius(d)*2.5)
             .attr("xlink:href", d.image )

         if (d.key=="0" || d.key=="1" || d.depth<1 || !document.getElementById("checkbox12").checked)
            return color(d);
         else{
             return "url(#catpattern"+d.key+")"; 
         }
   });

    d3.selectAll(".nodeText")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y; })
      .text(function(d) {   
        if (d.key=="0" || d.key=="1" || !document.getElementById("checkbox11").checked)
              return "";
        else 
          return d.key; 
      });
/*
    d3.selectAll(".nodeImage3").each(function(d) {
         })
     .attr("x", function(d) { return d.x; })
     .attr("y", function(d) { return d.y; })
     .attr("height", getRadius)
     .attr("width", getRadius)
     .attr("xlink:href", function(d) { return d.image; });*/
      
    linkTree_selection.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return Math.round(d.source.y); })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return Math.round(d.target.y); });

  // Draw relationship links *******************************************************
  var displayLinks;
  if (!document.getElementById("checkbox4").checked 
    && !document.getElementById("checkbox5").checked){
      displayLinks = new Array(0);
  }  
  else if (document.getElementById("checkbox4").checked 
    && document.getElementById("checkbox5").checked){
     displayLinks = links;
  }
  else{
    var count1 = 0;
    for (var i=0; i< links.length;i++){
      if (links[i].source.parent == links[i].target.parent)
        count1++;
    } 
    if (document.getElementById("checkbox4").checked){
      displayLinks = new Array(count1);
      var count2 =0;
      for (var i=0; i< links.length;i++){
        if (links[i].source.parent == links[i].target.parent){
          displayLinks[count2] = links[i];  
          count2++;
        }
      } 
    } 
    else if (document.getElementById("checkbox5").checked){
      displayLinks = new Array(links.length-count1);
      var count2 =0;
      for (var i=0; i< links.length;i++){
        if (links[i].source.parent != links[i].target.parent){
          displayLinks[count2] = links[i];  
          count2++;
        }
      } 
    } 
    else{
      console.log("ERROR: THe program should never get here!!!");
    }
  }

  if (document.getElementById("checkbox3").checked){ //directed
    var aa = bundle(links);
    svg.selectAll("path.link").remove();
    for (var i=0; i< aa.length;i++){
      var points =  new Array(aa[i].length);;
      for (var j=0; j< aa[i].length;j++){
        var a = new Array(2);
        a[0] = aa[i][j].treeX;
        a[1] = aa[i][j].treeY;
        points[j] = a;
      }  
      //console.log(points);
      var color2 = d3.interpolateLab("#008000", "#c83a22");
      var line2 = d3.svg.line()
          .interpolate("basis");

      svg.selectAll("path"+i)
          .data(quad(sample(line2(points), 10)))
        .enter().append("path")
          .style("fill", function(d) { return color2(d.t); })
          .style("stroke", function(d) { return color2(d.t); })
          .attr("class", "link")
          .attr("d", function(d) { return lineJoin(d[0], d[1], d[2], d[3], 0.1); });
    }
  }
  else {  // Update Undirected links of relationships
    svg.selectAll("path.link").remove();
    relationship_selection 
        .data(bundle(displayLinks))
      .enter().append("path")
        .attr("class", "link")
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr("d", lineBundle);
  }
}

// Collision ***********************************************************
var currentNode=1;
function startCollisionTimer() {
  setIntervalFunction = setInterval(function () {
    console.log("currentNode**** "+currentNode);
    // Compute collision
    var results = getCollisionOfSubtree(nodes[currentNode],0);
    var sumOverlapWithGreaterDFSid=results[1];
    var sumOverlapWithSmallerDFSid=results[0];
     
    //console.log("current="+currentNode+"  Smaller = "+sumOverlapWithSmallerDFSid
    //  +"  Greater = "+sumOverlapWithGreaterDFSid);
   

    d3.selectAll(".node1").each(function(d) {
        if (d.parent && d.treeRC){
          if (d.id==currentNode){
            if (sumOverlapWithGreaterDFSid>sumOverlapWithSmallerDFSid)
              d.alpha += 0.05;
            if (sumOverlapWithGreaterDFSid<sumOverlapWithSmallerDFSid)
              d.alpha -= 0.05;
          }  
          d.treeX = d.parent.treeX+d.treeRC*Math.cos(d.alpha); 
          d.treeY = d.parent.treeY+d.treeRC*Math.sin(d.alpha); 
          d.x = d.treeX; 
          d.y = d.treeY; 
        }
      })
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", getRadius)
      .style("fill", color)
      ;

    currentNode++;
    if (currentNode==nodes.length)
      currentNode=1;
    while (!nodes[currentNode].children){   // skip all leaf nodes
      currentNode++;
      if (currentNode==nodes.length)
        currentNode=1;
    }
  }, 1);
} 

function getCollisionOfSubtree(node1, deep) {
  var results = getCollisionOfNode(node1);
  if (node1.children && deep<0) {  // do not go more than 10 levels
    for (var i=0; i<node1.children.length; i++){
      var results2 = getCollisionOfSubtree(node1.children[i],deep+1)
      results[0] += results2[0];
      results[1] += results2[1];
    }
  }
  return results;
}


function getCollisionOfNode(node1) {
  var results = new Array(2);
  var x1 = node1.x; 
  var y1 = node1.y; 
  var r1 = getRadius(node1);
  var sumOverlapWithGreaterDFSid=0;
  var sumOverlapWithSmallerDFSid=0;
  for (var i=0; i<nodes.length;i++){
    if (nodes[i]==node1 || nodes[i]==node1.parent || isAChildOf(nodes[i], node1)) continue;
    var x2 = nodes[i].x; 
    var y2 = nodes[i].y; 
    var r2 = getRadius(nodes[i]); 
    var dis = (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
    dis = Math.sqrt(dis);
    if (dis<r1+r2){
      if (nodes[i].idDFS>node1.idDFS)
        sumOverlapWithGreaterDFSid += (r1+r2)-dis;
      else 
        sumOverlapWithSmallerDFSid += (r1+r2)-dis;
    }   
  }
  results[0] = sumOverlapWithSmallerDFSid;
  results[1] = sumOverlapWithGreaterDFSid;
  return results;
}

function isAChildOf(node1, node2) {
  if (!node2.children) return false;
  for (var i=0; i<node2.children.length;i++){
    if (node1==node2.children[i])
      return true;
  } 
  return false;
}



// Fisheye Lensing ************************************************
var fisheye = d3.fisheye.circular()
      .radius(200);

svg.on("mousemove", function() {
  //  force.stop();



  if (document.getElementById("checkbox2").checked)
     fisheye.focus(d3.mouse(this));
  d3.selectAll(".node1").each(function(d) { d.fisheye = fisheye(d); })
      .attr("cx", function(d) { return d.fisheye.x; })
      .attr("cy", function(d) { return Math.round(d.fisheye.y); });
     // .attr("r", function(d) { return d.fisheye.z * 8; });
  linkTree_selection.attr("x1", function(d) { return d.source.fisheye.x; })
      .attr("y1", function(d) { return Math.round(d.source.fisheye.y); })
      .attr("x2", function(d) { return d.target.fisheye.x; })
      .attr("y2", function(d) { return Math.round(d.target.fisheye.y); });
   

  node_selection
    .each(function(d) {
      d.x = d.fisheye.x; //*event.alpha;
      d.y = d.fisheye.y; //*event.alpha;
    });
d3.selectAll(".nodeText")
      .attr("x", function(d) { return d.x; })
      .attr("y", function(d) { return d.y-getRadius(d)-2; }); 


  
 if (!document.getElementById("checkbox3").checked){  // no lensing on directed relationships
   svg.selectAll("path.link")
      .each(function(d) { })
      .attr("d", lineBundle); 
  }    
  var force_influence = 0.5;
  node_selection
    .each(function(d) {
      d.x += (d.treeX - d.x) * (force_influence); //*event.alpha;
      d.y += (d.treeY - d.y) * (force_influence); //*event.alpha;
    });
});

function mouseovered(d) {

  if (!d.children){
    node_selection
       .each(function(n) { n.target = n.source = false; });
    svg.selectAll("path.link")
      .classed("link--faded", function(l) { if (l) return true;  })
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
      .filter(function(l) { return l.target === d || l.source === d; })
      .each(function() { this.parentNode.appendChild(this); });
     ;
     
     d3.selectAll(".node1")
       .style("fill-opacity" , function(n) {   
        if (n.key=="0" || n.key=="1" || n.depth<1  || !document.getElementById("checkbox12").checked)
          return 1;
        else{
           if (n==d)
              return 1;
            if (n.target) 
              return 1;
            else if (n.source)
              return 1;
            else
              return 0.15;
        }  
          
      });
           
      drawColorLegend();  
  }    
  else{
    svg.append("text")
      .attr("class", "nodeTextBrushing")
      .attr("x", d.x)
      .attr("y", d.y)
      .text(""+d.name)
      .attr("dy", ".21em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .style("text-anchor", "middle")
      .style("fill", "#000")
      .style("font-weight", "bold");
   } 
   console.log(d.name);
  //.classed("node--target", function(n) {   return n.target; })
  //.classed("node--source", function(n) { return n.source; });  
}

function mouseouted(d) {
  svg.selectAll("path.link")
      .classed("link--faded", false)
      .classed("link--target", false)
      .classed("link--source", false);

  d3.selectAll(".node1")
      .attr("r", function(d){ 
        return getRadius(d);
       })
      .style("fill" , function(n) {   
          if (n.key=="0" || n.key=="1" || n.depth<1  || !document.getElementById("checkbox12").checked)
            return color(n);
          else
            return "url(#catpattern"+n.key+")"; 
       })
      .style("fill-opacity", 1);

  removeColorLegend();    
  svg.selectAll(".nodeTextBrushing").remove();  
  
  //node_selection
  //    .classed("node--target", false)
  //    .classed("node--source", false);
}



