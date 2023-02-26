class Node {
  constructor(element) {
    this.element = element;
    this.descendants = [];
    this.parent = null;
  }
  addChild(element) {
    this.descendants.push(element);
  }
}
class Graph {
  constructor(node) {
    this.head = node;
  }
}

function printGraph(graph) {
  let queue = [];
  queue.push(graph.head);
  while (queue.length > 0) {
    let node = queue.shift();
    console.log(node.element);
    for (let i = 0; i < node.descendants.length; i++) {
      queue.push(node.descendants[i]);
    }
  }
  return queue;
}

function printAncestry(node) {
  // For each descendant, print the element and the descendants
  console.log("ELEMENT:", node.element, "DESCENDANTS:", node.descendants);

  for (let i = 0; i < node.descendants.length; i++) {
    printAncestry(node.descendants[i]);
  }
}

module.exports = {
  Node,
  Graph,
  printGraph,
  printAncestry,
};
