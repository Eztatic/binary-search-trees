// Creates node objects using a class
// This contains the value, left node and right node
// property
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Create a tree class to create binary search trees
class Tree {
  // Contains a root node and builds an binary search
  // trees by feeding it an array
  constructor(array) {
    this.root = this.buildTree(this._sortArray(array));
  }

  // The array argument must be sorted first before it
  // builds its tree
  _sortArray(array) {
    return (array = Array.from(new Set(array)).sort((a, b) => a - b));
  }

  // Builds a tree by giving it a sorted array
  // It getting the most middle value of the array and
  // sets it as its root node. This approach continuos
  // to the left and right half of the array excluding
  // the middle value(root node value)
  buildTree(array) {
    if (array.length === 0) return null;

    // Get the middle most value of the array by
    // dividing the length by half which returns the
    // index of the middle most value
    const mid = Math.floor(array.length / 2);
    // Makes the root node from the middle most value
    const root = new Node(array[mid]);

    // Creates the leftNode of the root based on left
    // half of the array.
    root.left = this.buildTree(array.slice(0, mid));
    // Creates the rightNode of the root based on right
    // half of the array.
    root.right = this.buildTree(array.slice(mid + 1));
    // This goes on until no element is left in the array
    // which returns null

    // returns the root when done
    return root;
  }

  // Add a new node on the binary search tree
  // It always ends up as a leaf node
  insert(value) {
    // If the tree is empty the new inserted value
    // will the root node of the BST
    if (this.root === null) {
      this.root = new Node(value);
      return;
    }

    // If tree is not empty, start traversing by the
    // root node to find a place of the new node inserted
    let current = this.root;
    while (current) {
      // If the new node's value is less the current node' value
      // we are traversing in it to check its left Node
      if (value < current.value) {
        // If left node is empty thats where it stays
        if (current.left === null) {
          // the current's left node will be the place for the
          // new node
          current.left = new Node(value);
          return;
        }
        // If the left node is not empty it proceeds to check
        // the next left node
        current = current.left;

        // If the new node's value is greater the current node' value
        // we are traversing in it to check its right Node
      } else if (value > current.value) {
        // If right node is empty thats where it stays
        if (current.right === null) {
          // the current's right node will be the place for the
          // new node
          current.right = new Node(value);
          return;
        }
        // If the right node is not empty it proceeds to check
        // the next right node
        current = current.right;
      } else {
        // If the current node's value and the new node's value is the
        // same it exits the loop as a duplicate was found
        console.log("Duplicate");
        return false;
      }
    }
  }

  // Delete a node in the BST
  deleteItem(value) {
    // Replaces the root node with a BST with a deleted node in it
    this.root = this._delete(this.root, value);
  }

  // a recursive helper function for deleting a node
  _delete(node, value) {
    // If root node is empty it returns null
    if (node === null) return null;

    // We start traversing by checking the value of the current node
    // and the value we want to delete

    // If the value is less than the current's node value it moves
    // to left node
    if (value < node.value) {
      node.left = this._delete(node.left, value);
      // If the value is greater than the current's node value it moves
      // to right node
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      // MATCH FOUND
      // CASE 1: NO CHILD NODES
      // When the current node's value is equal to the value we want to
      // delete and it has no child nodes it return null and structure
      // of the BST stays the same
      // Note: When the current node to be is a leaf node or a node
      // without children nodes, we can simply replace the leaf node
      // with null
      if (node.left === null && node.right === null) {
        return null;
      }

      // CASE 2: ONE CHILD NODES
      // When a current node to be deleted has only one child node,
      // that child node will be its successor or a replacement for
      // the deleted node
      // If the left node is null then right node will be the successor
      // otherwise the left node
      if (node.left === null) {
        return node.right;
      } else if (node.right == null) {
        return node.left;
      }

      // CASE 3: TWO CHILD NODES
      // If the current nodes has two child nodes it finds its
      // successor starting from its right subtree or left subtree.
      // This time we will only try finding its successor from the right
      // subtree. To find the successor in the right subtree we will find
      // the smallest value and that will be the replacement for the deleted
      // node with two child
      // Find the smallest value in the right subtree using the _findMin()
      // method
      // Note: To find the smallest node in the right subtree we keep going
      // left or the left most node because that is where the smallest
      // value is stored.
      let successor = this._findMin(node.right);
      // The current node's value will be replaced by the successor's value
      node.value = successor.value;
      // We can now delete the past successor's node.
      // Note: the successor will always be a leaf node and deleting a
      // leaf node is easy because we can just replace it with a null and
      // not change the structure of the BST
      node.right = this._delete(node.right, successor.value);
    }

    // Return root node with a deleted value
    return node;
  }

  // A helper function to find the minimum in the nodes subtrees
  _findMin(node) {
    // While the left node of the current node is not null we keep
    // on moving the farther to the left
    while (node.left !== null) {
      node = node.left;
    }
    // When the current node has no longer a left node we return it
    return node;
  }

  // Traverse the BST and returns the node if found otherwise returns
  // false
  find(value) {
    // Start traversing at the root node
    let node = this.root;

    // While node is not null continue
    while (node) {
      // If current node's value is equal to user value
      // return node
      if (node.value === value) {
        return node;
      }

      // If value is not equal to current value
      // checks wether it searches to the left or
      // right subtree of the node
      if (value < node.value) {
        node = node.left;
      } else if (value > node.value) {
        node = node.right;
      }
    }

    // If no value found return false
    return false;
  }

  // A Breadth first search in BST
  // A callback will be the parameter as you can alter nodes
  // as the function traverses the tree
  levelOrder(callback) {
    // If argument is a parameter return an error
    if (typeof callback !== "function") {
      throw new Error("Callback function not found");
    }

    // Create a queue for storing nodes to be traversed
    // by level order
    let queue = [this.root];

    // While queue is not empty continue traversing
    while (queue.length !== 0) {
      // Start by removing and storing the first value
      // in the queue
      const node = queue.shift();
      // Apply the callback to the current node
      callback(node);
      // Check its children, if not null push to queue
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  // Depth first search
  // A. Pre-order
  preOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function not found");
    }

    // Base Case
    // If node is null stop the recursion
    if (node === null) return;

    // Recursive case
    // Node -> Left -> Right
    callback(node);
    this.preOrder(callback, node.left);
    this.preOrder(callback, node.right);
  }

  // B. In-order
  inOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function not found");
    }

    // Base Case
    // If it reaches past leaf node return
    if (node === null) return;

    // Recursive case
    // Left -> Node -> Right
    this.inOrder(callback, node.left);
    callback(node);
    this.inOrder(callback, node.right);
  }

  // C. Post-order
  postOrder(callback, node = this.root) {
    if (typeof callback !== "function") {
      throw new Error("Callback function not found");
    }

    // Base Case
    // If it reaches past leaf node return
    if (node === null) return;

    // Recursive case
    // Left -> Right -> Node
    this.postOrder(callback, node.left);
    this.postOrder(callback, node.right);
    callback(node);
  }

  // Find the height of the node
  height(node) {
    // If node is null stop
    if (node === null) return -1;

    // Get the height of the left subtree of the node
    // Add one for every time it goes left
    const leftHeight = this.height(node.left) + 1;
    // Get the height of the right subtree of the node
    // Add one for every time it goes right
    const rightHeight = this.height(node.right) + 1;
    // Compare the left and right subtree and the highest
    // value is the height, if left and right height is
    // equal then it return either
    return Math.max(leftHeight, rightHeight);
  }

  // Find the depth of the BST
  depth(node) {
    // Start traversing by the root node
    let currentNode = this.root;
    // Depth will increase as it goes to a children of a node
    // until the node is found
    let depth = 0;

    // While currentNode is not past a leaf node it loops
    while (currentNode !== null) {
      // If node is found return depth
      if (node.value === currentNode.value) {
        return depth;
      }

      // If node's value is not equal to current node's value
      // it goes to the next child and increases the depth
      if (node.value < currentNode.value) {
        currentNode = currentNode.left;
      } else if (node.value > currentNode.value) {
        currentNode = currentNode.right;
      }
      // Increment depth by 1
      depth++;
    }

    // Return -1 if node not found
    return -1;
  }

  // Check if tree is balanced
  // The depth of the subtree of the root must be equal or not have a
  // difference in the depth with more than 1
  isBalanced() {
    // Get the height of the left subtree of the root node
    const leftHeight = this.height(this.root.left);
    // Get the height of the right subtree of the root node
    const rightHeight = this.height(this.root.right);

    // If the difference of the heights is -1, 0, or 1 it is balanced
    // otherwise not balanced
    return Math.abs(leftHeight - rightHeight) <= 1 ? true : false;
  }

  // Rebalance an unbalanced tree
  rebalance() {
    // Create an array to add node values from the current BST
    const array = [];
    // In-order traversing was used because it automatically sorts
    // the node values which will be pushed in the array while traversing
    this.inOrder((node) => {
      array.push(node.value);
    });
    // On the new array replace the BST root node by rebuilding the
    // tree based on the new array
    this.root = this.buildTree(array);
    // Return the new root node
    return this.root;
  }

  // Print the node in the BST in the console to easily visualize the BST
  prettyPrint(node, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }
}

// TEST
const arr = [10, 20, 30, 40, 50, 60, 70];
const test = new Tree(arr);
// test.deleteItem(40);
// test.prettyPrint(test.root);
// console.log(test.find(10));
// test.levelOrder((node) => {
//   console.log(node.value);
// });

test.insert(4);
test.insert(3);
test.insert(2);
test.insert(1);
test.prettyPrint(test.root);

// test.inOrder((node) => {
//   console.log(node.value);
// });

// console.log(test.isBalanced());

test.rebalance();
test.prettyPrint(test.root);
