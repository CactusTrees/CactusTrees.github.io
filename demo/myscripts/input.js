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
    if (d.imports) {
      //if (d.name.indexOf("flare.animate")>-1) {
        var list = "";
        d.imports.forEach(function(i) {
            //if (map[i].name.indexOf("flare.animate")>-1) {
            //  list+="\""+map[i].name+"\""+",";
              imports.push({source: map[d.name], target: map[i]});
            //}  
        });
      //  console.log("{\"name\":\""+d.name+"\",\"size\":500,\"imports\":["+list.substring(0,list.length-1)+"]},");
      //}  
    }  
  });
  return imports;
}

function flatten(root) {
  var i = 0;
  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    if (!node.id) node.id = ++i;
  }
  recurse(root);
};


