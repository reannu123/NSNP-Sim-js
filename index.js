// n = number of functions
// m = number of variables
// g = number of neurons
// q = number of spiking vectors

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
let T = [];

// Synapse list
let syn = [
  [1, 2],
  [2, 1],
];

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
function computePossible(C) {
  // Initialize active matrix with size of L
  // active is a matrix
  // let n be a list with number of elements equal to the number of columns of F
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
function getFunctions(m, active) {
  let functions = [];
  for (let i = 0; i < active.length; i++) {
    if (active[i][m] == 1) {
      functions.push(i);
    }
  }
  return functions;
}

// Algorithm 1: Spiking Matrix
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
   
    console.log("\nNeuron ",m) 
    console.log("n",n)
    console.log("Functions ", functions)

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
      i=0;
      j=0;
      while(i<functions.length){
        while(j<q){
          S[j][functions[i]] = 1;
          console.log("S",S)
          j++;
        }
        i++;
      }
      // let i = 0;
      // let p = q / n[m];
      // console.log("n[m]", n[m])
      // console.log("Q", q)
      // for (let j = 0; j < functions.length; j++) {
      //   let k = 0;
      //   while (k < p) {
          
      //     console.log("i", i)
      //     console.log("K",k)
      //     console.log("P",p)
      //     S[i][functions[j]] = 1;
      //     console.log("S",S)

      //     k++;
      //     i++;
      //   }
      // }
    }
    
    // q = q / n[m];
  }
  return S;
}
console.log("Configuration Matrix: ", C);
console.log("Function Matrix: ", F);
console.log("Function Location Matrix: ", L);
console.log("Threshold List: ", T);
console.log("Synapse List: ", syn);
console.log("Spiking Matrix: ", generateSM(C));
