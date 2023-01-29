// Configuration Matrix
let C = [[1, 1, 2]];

// Function Matrix
let F = [
  [1, 1, 0],
  [0.5, 0.5, 0],
  [0, 0, 1],
  [0, 0, 0.5],
];

// Function Location Matrix
let L = [
  [1, 0],
  [1, 0],
  [0, 1],
  [0, 1],
];

// Threshold list
let T = [[4, 4]];

// Synapse list
let syn = [
  [1, 2],
  [2, 1],
];

function computePossible(C) {
  // Initialize active matrix with size of L
  // active is a matrix
  let active = [];
  for (let i = 0; i < L.length; i++) {
    active.push([]);
    for (let j = 0; j < L[i].length; j++) {
      active[i].push(0);
    }
  }

  // Let n be a list with number of elements equal to the number of columns of L
  let n = [];
  for (let i = 0; i < L[0].length; i++) {
    n.push(0);
  }

  // For each neuron in the system
  for (let j = 0; j < L[0].length; j++) {
    // For each function in the system
    for (let i = 0; i < L.length; i++) {
      // make sure the function is in the neuron
      if (L[i][j] == 1) {
        if (checkThreshold(C, i)) {
          active[i][j] = 1;
          n[j] += 1;
        } else {
          active[i][j] = 0;
        }
      }
    }
  }
  return { n, active };
}

function checkThreshold(C, i) {
  // Check if i is in Threshold functions
  for (let j = 0; j < T.length; j++) {
    if (T[j][0] == i + 1) {
      // Check if the threshold is met
      // To check threshold, we need to check the value of T[j][1]. This is the value of the threshold. The function matrix row to be checked is T[j][0].
      // Then, we check for any non-zero values in the function matrix row. and store it in a list.
      // Then the list is checked against the configuration matrix. The value of the configuration matrix element should be higher than T[j][0].
      let nonZero = [];
      for (let k = 0; k < F[i].length; k++) {
        if (F[i][k] != 0) {
          nonZero.push(k);
        }
      }

      for (let k = 0; k < nonZero.length; k++) {
        if (C[0][nonZero[k]] < T[j][1]) {
          return false;
        }
      }
      return true;
    }
  }
  return true;
}
console.log(computePossible(C));
