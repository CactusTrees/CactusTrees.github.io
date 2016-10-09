var diameter = 1000,
    radius = diameter / 2,
    innerRadius = radius - 120;

  // Add color legend
 var listSelected1 = {}
 var listSelected2 = {}
 var listSelected3 = {}
 var listSelected4 = {}
  
  
  /*listSelected1["Signaling by GPCR.Gastrin-CREB signalling pathway via PKC and MAPK"] =1;
  listSelected2["Signaling by GPCR.GPCR downstream signaling.G-protein beta:gamma signalling"] =1;
  listSelected3["Signaling by GPCR.Opioid Signalling.Opioid dissociates from MOR"] =1;
  listSelected4["Signaling by GPCR.Opioid Signalling.Opioid binds MOR"] =1;
  */
  //listSelected3["Signaling by GPCR.Opioid Signalling.DARPP-32 events.cAMP induces dissociation of inactive PKA tetramers"] =1;
  //listSelected3["Signaling by GPCR.Opioid Signalling.DARPP-32 events.PKA phosphorylates DARPP-32 on Thr34"] =1;


  // HIV
  //listSelected1["HIV Life Cycle.Late Phase of HIV Life Cycle.Assembly Of The HIV Virion.Packaging of HIV virion on the host cell plasma membrane"] =1;
  //listSelected2["HIV Life Cycle.Early Phase of HIV Life Cycle.Integration of provirus.Formation of Pre-Integration Complex (PIC)"] =1;
  


  // Example for Steve
  //listSelected1["flare.PI3K/AKT activation"] =1;
  //listSelected2["flare.Activation of TRKA receptors"] =1;
  listSelected1["Signalling to ERKs.Signalling to p38 via RIT and RIN.RAF/MAP kinase cascade.ERK activation.ERK1 activation.MEK1 binds ERK-1"] =1;
  listSelected3["Signalling to ERKs.Signalling to p38 via RIT and RIN.TRKA recruits RIT and RIN"] =1;
  listSelected4["Signalling to ERKs.Signalling to p38 via RIT and RIN.RIT/RIN are activated"] =1;  
  
  // RAF
  //listSelected1["flare.ERK activation.ERK2 activation"] = 1;
  //listSelected2["flare.MEK activation.RAF phosphorylates MEK"] = 1;
  //listSelected3["flare.MEK activation"] = 1;


  // Ativation of Pro-Caspase 8 
  //listSelected1["flare.Apoptotic factor-mediated response.SMAC-mediated apoptotic response.SMAC-mediated dissociation of IAP:caspase complexes"] = 1;;
  //listSelected2["flare.Release of apoptotic factors from the mitochondria"] = 1;
  listSelected3["flare.Apoptotic factor-mediated response.Cytochrome c-mediated apoptotic response.Formation of apoptosome"]=1;
  
  //ERBB2
  //listSelected1["flare.PI3K events in ERBB2 signaling.PIP3 activates AKT signaling"] = 1;
  //listSelected2["flare.SHC1 events in ERBB2 signaling.RAF/MAP kinase cascade.ERK activation.ERK1 activation"] = 1;
  //listSelected3["flare.GRB2 events in ERBB2 signaling"] = 1;
  
  // GPCR
  //listSelected1["Signaling by GPCR.Opioid Signalling.G-protein mediated events.PLC beta mediated events.Ca-dependent events.CaM pathway"] = 1;
  //listSelected2["Signaling by GPCR.GPCR downstream signaling.G alpha (q) signalling events.Effects of PIP2 hydrolysis"] = 1;
  //listSelected1["flare.Signaling by GPCR.Opioid Signalling.G-protein mediated events.PLC beta mediated events.Ca-dependent events.CaM pathway"] = 1;;
  //listSelected2["flare.Signaling by GPCR.GPCR downstream signaling.G alpha (q) signalling events.Effects of PIP2 hydrolysis"] = 1;
  //listSelected3["Signaling by GPCR.GPCR downstream signaling.G alpha (q) signalling events"] = 1;
  
  // Flare
  //listSelected1["flare.query.methods"] = 1;
  //listSelected2["flare.vis.operator.layout"] = 1;
  //listSelected3["flare.vis.operator.layout"] = 1;
  
  
  // Carnivora
  //listSelected1["carnivora.0.0.0.0.0.0.0.0.0.0.0"] = 1;
  //listSelected2["carnivora.0.0.0.1.0.0.0"] = 1;
  //listSelected3["carnivora.0.0.0.0.0.0.1.0.0"] = 1;
  

function drawColorLegend() {
  var xx = width-100;
  var y1 = 5;
  var y2 = 18;
  var rr = 5;

  svg.append("line")
    .attr("class", "nodeLegend")
    .attr("x1", xx-20)
    .attr("y1", y1)
    .attr("x2", xx)
    .attr("y2", y1)
    .style("stroke", "#880088");

  svg.append("circle")
    .attr("class", "nodeLegend")
    .attr("cx", xx)
    .attr("cy", y1)
    .attr("r", rr)
    .style("fill", "#880088");
  
  svg.append("text")
    .attr("class", "nodeLegend")
    .attr("x", xx+10)
    .attr("y", y1+1)
    .text("Source node")
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .style("text-anchor", "left")
    .style("fill", "#880088");

  svg.append("line")
    .attr("class", "nodeLegend")
    .attr("x1", xx-20)
    .attr("y1", y2)
    .attr("x2", xx)
    .attr("y2", y2)
    .style("stroke", "#008800");
      
  svg.append("circle")
    .attr("class", "nodeLegend")
    .attr("cx", width-100)
    .attr("cy", y2)
    .attr("r", rr)
    .style("fill", "#008800");  

  svg.append("text")
    .attr("class", "nodeLegend")
    .attr("x", xx+10)
    .attr("y", y2+1)
    .text("Target node")
    .attr("dy", ".21em")
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .style("text-anchor", "left")
    .style("fill", "#008800");  
}

function removeColorLegend() {
  svg.selectAll(".nodeLegend").remove();
}

function color(d) {
  if (d.name=="animate")
    return "#ccc";
  if (d.name=="animate.interpolate")
    return "#aaa";

  var minSat = 50;
  var maxSat = 245;
  var step = (maxSat-minSat)/maxDepth;
  var sat = Math.round(maxSat-d.depth*step);
  if (listSelected1[d.name] || listSelected2[d.name])
    //return "#77ff77";
    return "#77ff77";
  else if (listSelected3[d.name])// || listSelected4[d.name])
  //  return "#ffff66";
  return "#ff00ff";
  
  //return "#000";
  else if (listSelected4[d.name])// || listSelected4[d.name])
    return "#ff00ff";
  //return "#000";
  
  //console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#8383BB"; // leaf node
}

function colorFaded(d) {
  var minSat = 0;
  var maxSat = 180;
  var step = (maxSat-minSat)/(maxDepth);
  var sat = Math.round(maxSat-d.depth*step);
 
  console.log("maxDepth = "+maxDepth+"  sat="+sat+" d.depth = "+d.depth+" step="+step);
  return d._children ? "rgb("+sat+", "+sat+", "+sat+")"  // collapsed package
    : d.children ? "rgb("+sat+", "+sat+", "+sat+")" // expanded package
    : "#aaaacc"; // leaf node
}


function getBranchingAngle1(radius3, numChild) {
  if (numChild<=4){
    return Math.pow(radius3,2);
  }  
  else
    return Math.pow(radius3,0.75);
} 

function getRadius(d) {
  // console.log("scaleCircle = "+scaleCircle +" scaleRadius="+scaleRadius);
  return d._children ? scaleCircle*Math.pow(d.childCount1, scaleRadius)// collapsed package
      : d.children ? scaleCircle*Math.pow(d.childCount1, scaleRadius) // expanded package
      : scaleCircle*1;
     // : 1; // leaf node
}


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

function childDepth1(n) {
    if(n.children && n.children.length > 0) {
      n.maxDepth = 0;
      n.children.forEach(function(d) {
        var childrenDeep = childDepth1(d);
        if (childrenDeep>n.maxDepth)
          n.maxDepth = childrenDeep;
      });
    }
    else{
       n.maxDepth = n.depth;
    }
    //console.log("maxDepth="+n.maxDepth);
       
    return n.maxDepth;
};



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

//d3.select(self.frameElement).style("height", diameter + "px");

/*
function tick(event) {
  link_selection.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; }); 
  var force_influence = 0.9;
  node_selection
    .each(function(d) {
      d.x += (d.treeX - d.x) * (force_influence); //*event.alpha;
      d.y += (d.treeY - d.y) * (force_influence); //*event.alpha;
    });
 // circles.attr("cx", function(d) { return d.x; })
  //    .attr("cy", function(d) { return d.y; });  
  
}*/


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

/*
function collide(alpha) {
  var quadtree = d3.geom.quadtree(tree_nodes);
  return function(d) {
    quadtree.visit(function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== d) && (quad.point !== d.parent) && (quad.point.parent !== d)) {
         var rb = getRadius(d) + getRadius(quad.point),
        nx1 = d.x - rb,
        nx2 = d.x + rb,
        ny1 = d.y - rb,
        ny2 = d.y + rb;

        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y);
          if (l < rb) {
          l = (l - rb) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}
*/
