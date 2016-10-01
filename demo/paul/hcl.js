/* global d3, ccl */

window.ccl = window.ccl || {};

ccl.hcl = function() {
  var size = [1,1];
  var radiusScale = 0.9;
  var leafSize = 1;
  var branchingRange = Math.PI * 1.2;
  
  function _hcl(root) {
    var treeLayout = d3.layout.hierarchy();
    
    treeLayout(root); // Set a depth value for each node
    setMaxDepth(root); // Find the maximum descendant depth
    descendants(root); // count the descendants of each node
    orderChildren(root); // Recursively sort children
    
    // Set the sort function
    treeLayout.sort(function(a, b) {
      if (typeof b.order == 'undefined') throw 'no order';
      return b.order - a.order;
    });
    
    var nodes = treeLayout(root); // Re-sort the nodes
    
    (function setRadius(node) {
      node.radius = getRadius(node);
      if (node.children) node.children.forEach(setRadius);
    }(root));
    
    (function setBranching(node) {
      var children = node.children;
      if (children) {
        var numChild = children.length;
        children.forEach(function(child) {
          child.branchingAngle = getBranchingAngle(child.radius, numChild);
          setBranching(child);
        });
        node.angleSum = children
          .map(function(c) { return c.branchingAngle; })
          .reduce(function(a, b) { return a + b; });
      }
    }(root));
    
    nodes.forEach(function(d) {
      if (d.depth === 0) {
         d.treeX = 0; 
         d.treeY = 0;
         d.alpha = 0;
      }
      if (d.children){
        var angleSum = d.angleSum;
        var begin = d.alpha - branchingRange / 2;
        
        d.children.forEach(function(child) {
          var parent = child.parent;
          var radius = parent.radius + child.radius/2;
  
          var angle = child.branchingAngle;
          var additional = branchingRange * angle / angleSum;
          
          child.alpha = begin + additional/2;
          child.treeX = parent.treeX + radius * Math.sin(child.alpha); 
          child.treeY = parent.treeY - radius * Math.cos(child.alpha); 
  
          begin += additional;
        });
      }
    });
    
    return nodes;
  }
  
  function getRadius(d) {
    return d.children ? Math.pow(d.numDescendants, radiusScale) : leafSize;
  }
  
  function orderChildren(n) {
    var arr = n.children || [];
    // Sort small to large
    arr.sort(function(a,b) { 
      if (isUndefined(a.maxDepth)) throw 'no maxDepth';
      if (isUndefined(a.numDescendants)) throw 'no numDescendants';
      return (a.maxDepth + a.numDescendants) - (b.maxDepth + b.numDescendants); 
    });
    var arr2 = [];
    arr.forEach(function(d) {
        arr2.splice(arr2.length/2, 0, d);
    });
    arr2.forEach(function(d, i) {
        d.order = i;
        orderChildren(d);
    });
  }
  
  function descendants(node) {
    var children = node.children;
    if (children && children.length > 0) {
      var ds = children
        .map(function(child) {
          return descendants(child);
        })
        .reduce(function(a,b) { 
          return a + b; 
        });
      return node.numDescendants = ds + children.length;
    } else {
      return node.numDescendants = 0;
    }
  }
  
  function setMaxDepth(node) {
    var children = node.children;
    if (children && children.length > 0) {
      var depths = children.map(setMaxDepth);
      return node.maxDepth = Math.max.apply(null, depths);
    } else {
      if (typeof node.depth == 'undefined') throw "no depth";
      return node.maxDepth = node.depth;
    }
  }
  
  function getBranchingAngle(radius, numChild) {
    if (numChild <= 2) return Math.pow(radius, 2);
    return Math.pow(radius, 0.9);
  } 
   
  var isUndefined = function(d) { return typeof d === 'undefined'; };
  
  _hcl.radiusScale = function(x) {
    if (!arguments.length) return size;
    radiusScale = x;
    return _hcl;
  };
  
  _hcl.leafSize = function(x) {
    if (!arguments.length) return size;
    leafSize = x;
    return _hcl;
  };
  
  _hcl.branchingRange = function(x) {
    if (!arguments.length) return size;
    branchingRange = x;
    return _hcl;
  };
  
  
  return _hcl;
};


  // _hcl.size = function(x) {
  //   if (!arguments.length) return size;
  //   size = x;
  //   return _hcl;
  // };
    
    // (function scaleNodes(nodes) {
    //   var xExtent = d3.extent(nodes, function(d) { return d.treeX; });
    //   var yExtent = d3.extent(nodes, function(d) { return d.treeY; });
    //   console.log(xExtent, yExtent);

    //   var ratio = [xExtent, yExtent]
    //     .map(function(e) { return e[1] - e[0]; })
    //     .reduce(function(x, y) { return x/y; });
        
    //   size[1] -= root.radius
        
    //   var range = [-1, 1]
    //     .map(function(d) { return d * size[1]*ratio/2; })
    //     .map(function(d) { return d + size[0]/2; });

    //   var x = d3.scale.linear()
    //     .domain(xExtent)
    //     .range([0, size[1]*ratio]);
        
    //   var y = d3.scale.linear()
    //     .domain(yExtent)
    //     .range([0, size[1]]);
      
    //   // nodes.forEach(function(node) {
    //   //   node.treeX = x(node.treeX);
    //   //   node.treeY = y(node.treeY);
    //   // });
    // }(nodes));