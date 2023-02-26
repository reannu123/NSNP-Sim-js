// n = number of functions
// m = number of variables
// g = number of neurons
// q = number of spiking vectors

function addMatrix(A, B) {
  console.log("A: ", A);
  console.log("B: ", B);
  let C = [];
  for (let i = 0; i < A.length; i++) {
    C.push([]);
    for (let j = 0; j < A[i].length; j++) {
      C[i].push(A[i][j] + B[i][j]);
    }
  }
  console.log("C: ", C, "\n");
  return C;
}

function multiplyMatrix(A, B) {
  let C = [];
  for (let i = 0; i < A.length; i++) {
    C.push([]);
    for (let j = 0; j < B[0].length; j++) {
      C[i].push(0);
      for (let k = 0; k < B.length; k++) {
        C[i][j] = C[i][j] + A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

// Helper Functions
function computeCombination(n) {
  let combination = 1;
  for (let i = 0; i < n.length; i++) {
    if (n[i] != 0) {
      combination *= n[i];
    }
  }
  return combination;
}

// Computes for possible functions that can be activated
function computePossible(C) {
  // Initialize active matrix with size of Function Location matrix
  // let n be a list with number of elements equal to the number of neurons
  let n = [];
  for (let i = 0; i < L[0].length; i++) {
    n.push(0);
  }

  let active = [];
  for (let i = 0; i < L.length; i++) {
    active.push([]);
    for (let j = 0; j < L[i].length; j++) {
      active[i].push(0);
    }
  }

  // For each neuron in the system
  for (let j = 0; j < L[0].length; j++) {
    let count = 0;
    // For each function in the system
    for (let i = 0; i < L.length; i++) {
      // make sure the function is in the neuron
      if (L[i][j] == 1) {
        if (checkThreshold(C, i)) {
          active[i][j] = 1;
          count += 1;
        } else {
          active[i][j] = 0;
        }
      }
    }
    n[j] = count;
  }
  // console.log(active);
  return { n, active };
}

// Checks for configuration C if function i has a threshold that is met
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
        if (C[nonZero[k]] < T[j][1]) {
          return false;
        }
      }
      return true;
    }
  }
  return true;
}

function getFunctions(m, active) {
  let functions = [];
  for (let i = 0; i < active.length; i++) {
    if (active[i][m] == 1) {
      functions.push(i);
    }
  }
  return functions;
}

function getNeuronFromFunction(i) {
  for (let j = 0; j < L[i].length; j++) {
    if (L[i][j] == 1) {
      return j;
    }
  }
}

function getNeuronFromVariable(j) {
  return VL[j];
}

function checkActiveVars(S) {
  // console.log("CHECK ACTIVE VARS: \nS: ", S, "\nF: ", F, "\n");
  let V = [];
  for (let i = 0; i < S.length; i++) {
    V.push([]);
    for (let j = 0; j < S[i].length; j++) {
      if (S[i][j] == 1) {
        // It means function j is active
        // Check for every active function which variable is active
        for (let k = 0; k < F[j].length; k++) {
          if (F[j][k] != 0) {
            if (V[i].length < k + 1) {
              V[i].push(0);
            } else {
              V[i][k] = 0;
            }
          } else {
            if (V[i].length < k + 1) {
              V[i].push(1);
            } else {
              if (V[i][k] != 0) {
                V[i][k] = 1;
              }
            }
          }
        }
      }
    }
  }
  return V;
}

// Algorithm 1: Spiking Matrix
// Consists of vectors containing functions that will spike
function generateSM(C) {
  let possible = computePossible(C);
  let n = possible.n; // Number of functions
  let active = possible.active;
  let q = computeCombination(n); // Number of spiking vectors

  // Initialize matrix spiking matrix with size of combination x n
  let S = [];
  for (let i = 0; i < q; i++) {
    S.push([]);
    for (let j = 0; j < F.length; j++) {
      S[i].push(0);
    }
  }

  // for each neuron m find the number of possible spiking vectors
  for (let m = 0; m < L[0].length; m++) {
    let functions = getFunctions(m, active);

    // console.log("\nNeuron ", m);
    // console.log("n", n);
    // console.log("Functions ", functions);

    // For each neuron, if the number of functions is 0, then set all the values of the spiking vector to 0
    if (n[m] == 0) {
      //for each element in functions, and for each row in S, set the value of S to 0
      for (let j = 0; j < functions.length; j++) {
        for (let k = 0; k < S.length; k++) {
          S[k][functions[j]] = 0;
        }
      }
    }
    // If the number of functions is 1, then set all the values of the spiking vector to 1
    else {
      let i = 0;
      let p = n[m] / q;
      // console.log("\nn[m]: ", n[m]);
      // console.log("Q: ", q);
      // console.log("P: ", p);
      // console.log("\n");
      for (let j = 0; j < functions.length; j++) {
        //correct
        let k = 0;
        while (k < p) {
          // console.log("i", i);
          // console.log("j", j);
          // console.log("K", k);
          // console.log("P", p);
          S[i][functions[j]] = 1;
          // console.log("S", S);

          k++;
          i++;
        }
      }
    }

    q = n[m] / q;
  }
  return S;
}

// Algorithm 2: Production Matrix
// consists of the effects of each function in changing of variable values
function generatePM(C) {
  let P = [];
  for (let i = 0; i < F.length; i++) {
    P.push([]);
    for (let j = 0; j < F[i].length; j++) {
      P[i].push(0);
    }
  }

  for (let i = 0; i < F.length; i++) {
    let sum = 0;
    for (let j = 0; j < F[0].length; j++) {
      sum = sum + F[i][j] * C[j];
    }

    let m = getNeuronFromFunction(i) + 1;
    // console.log(m);

    for (let j = 0; j < F[0].length; j++) {
      let target = [m, getNeuronFromVariable(j)];
      if (syn.find((x) => arrayEquals(x, target))) {
        if (checkThreshold(C, i)) {
          P[i][j] = sum;
        }
      } else {
      }
    }
  }
  return P;
}

// Algorithm 3: Computation Graph
// Generates computation graph from a given initial configuration
function generateConfigurations(C, maxDepth) {
  let unexploredStates = C;
  let exploredStates = [];
  let graph = require("./graphType");
  let computationHistory = new graph.Graph(new graph.Node(C[0]));

  let depth = 0;

  while (depth < maxDepth) {
    let nextstates = [];
    for (let i = 0; i < unexploredStates.length; i++) {
      // console.log("Unexplored State: ", unexploredStates[i]);
      let S = generateSM(unexploredStates[i]);
      S = S_debug;
      let P = generatePM(unexploredStates[i]);
      let V = checkActiveVars(S);
      let NG = multiplyMatrix(S, P);
      let C_next = addMatrix(V, NG);
      for (let j = 0; j < C_next.length; j++) {
        // For each configuration in C_next, check if it is already in ExploredStates
        // If it is not, add it to the nextstates array
        if (!exploredStates.find((x) => arrayEquals(x, C_next[j]))) {
          nextstates.push(C_next[j]);
        }
        console.log("nextstates: ", nextstates);
        // Add unexplored states[i] to explored states
      }
      exploredStates.push(unexploredStates[i]);
      // remove unexplored states[i] from unexplored states
      unexploredStates.splice(i, 1);
    }
    // Add nextstates to unexplored states
    unexploredStates.push(...nextstates);

    depth++;
  }
  // console.log(computationHistory);
  console.log("Explored States: ", exploredStates);
}

// Configuration Matrix
let C = [[1, 1, 2]];

// Variable Location
let VL = [1, 1, 2];

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

// Hard-coded Spiking Matrix
let S_debug = [
  [1, 0, 1, 0],
  [0, 1, 1, 0],
];

generateConfigurations(C, (maxDepth = 2));
