// n = number of functions
// m = number of variables
// g = number of neurons
// q = number of spiking vectors

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

let generateSM = require("../NSNP-Sim-js/generateSM").generateSM;
let generatePM = require("../NSNP-Sim-js/generatePM").generatePM;
let generateConfigurations =
  require("../NSNP-Sim-js/generateConfiguration").generateConfigurations;
console.log("Spiking Matrix: ", generateSM(C[0], L, F, T));
console.log("Production Matrix: ", generatePM(C[0], F, L, VL, syn, T));
console.log(
  "State Configurations: ",
  generateConfigurations(C, 2, L, F, T, VL, syn)
);
// generateConfigurations(C, (maxDepth = 2));
