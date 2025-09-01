/**
 * JavaScript Assignment 5
 * Covers: Variables, Data Types, Control Flow, Functions, and DOM Manipulation
 */


// 1. Variable Declaration and Data Types 
// ======================================

// a) Declare variables
let name;       // String variable for name
let age;        // Number variable for age
let isStudent;  // Boolean variable for student status

// b) Assign values
name = "Alice";     // Assign string value
age = 22;           // Assign number value
isStudent = true;   // Assign boolean value

// c) Log variables and their types
console.log("Name:", name, "Type:", typeof name);
console.log("Age:", age, "Type:", typeof age);
console.log("Is Student:", isStudent, "Type:", typeof isStudent);


// 2. Control Flow Statements
// ==============================================

// a) Conditional Statement (if/else)
console.log("\n2a) Conditional Statement:");

if (age >= 18) {
  console.log(name + " is an adult.");
} else {
  console.log(name + " is a minor.");
}

// b) Iterative Statement (for loop)
console.log("\n2b) Iterative Statement:");

console.log("Counting from 1 to 5:");
for (let i = 1; i <= 5; i++) {
  console.log(i);
}

// 3. Functions 
// ==============================================

// a) Function Declaration
console.log("\n3a) Function Declaration:");

function greet(personName) {
  return "Hello, " + personName + "!";
}

// b) Function Call
const greeting = greet(name);
console.log(greeting);

// 4. Basic DOM Manipulation 
// ==============================================

// a) DOM Element Selection
console.log("\n4a) DOM Manipulation:");

// Wait for DOM to load before manipulating elements
document.addEventListener('DOMContentLoaded', function() {
  // Create a button element (for demonstration)
  const button = document.createElement('button');
  button.id = 'demoButton';
  button.textContent = 'Click Me';
  document.body.appendChild(button);

  // b) Event Listener
  document.getElementById('demoButton').addEventListener('click', function() {
    console.log("Button was clicked!");
    alert("You clicked the button!");
  });
});

console.log("DOM manipulation code will run when the page loads.");