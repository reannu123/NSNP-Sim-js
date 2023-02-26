class Node {
  constructor(element) {
    this.element = element;
    this.descendants = [];
  }
}
class Graph {
  constructor(Node) {
    this.head = Node;
  }
}

module.exports = {
  Node,
  Graph,
};
