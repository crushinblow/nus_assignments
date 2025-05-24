let name = 'NidaAP' // identified type  - declaration - enclosed with quation is string
let expereicen = 9 //this is a number, no quotation 

console.log("my name is :"+ name)
// concatenate => + symbopl is used. identifie type (e.g. let )is string
let name ="Priya" //re-delcaring is not allowedusing "let"

const PI=3.14// value shd not change at any costs
console.log(" The value of PI : "+PI)

var name = "Nida"//varying 
console.log)"Name:"+name)
var name = "Priya"
console.log)"Name:"+name)

// data type - auto dectec by compiler
let age = 24 //number
let name = "nia" // string
let qualified =true //boolean

//operators - perfrm operatios on vlaue

5 + 10  // + is operator

let result = 5 + 10  //  5 is operator,  whole thing is expresson, 5 and 10 are operands

//arithmetic operator
let sum = 5 + 3
let diff = 5  3 
let mul = 5 * 3
let div = 5 / 3 // get quotient 4%2=0
let mod = 5 % 3  //  get remainder
let value = 5
// increment (++) and decrement (--) => same as value = value +1
vaue++  ++ increment by 1
value-- // decement by 1 => same as value = value 1

let firstName = "Nida"
let lastName = "A{"
let fullname = firstName +" " +lastName

//asignment operator =
// += incerment and assign
// - = decrement and assign
// *= multiply and assign
//= divide and assign
// %= modulo and assign
value +=3  // value = value + 3
value -=4   // value = value -4
number = 5 // single = is assignment  == is equal
value =10
value += number  + 3 //18
console.log ("value += number +3 is "+value)

//relaitonal operator - < > <= >= == !=
console.log(10>10)  // false
console.log(10<10)
console.log(10<=10)
console.log(10==10)
console.log(10!=10)

value1 = 10 // type -> number
value2= "10" // type is string


cpnsole.log("compariosn of v alue 1 and vlaue 2 using == operator: "+ (value1 == value2))
cpnsole.log("compariosn of v alue 1 and vlaue 2 using == operator: "+ (value1 === value2))  // cehck the type too - pther than vlaue , also chk datatype of vlaue e.g dtring and numberic is false

//logical operator ! -> not, and -> && , or -> ||
console.log(!(10==10)) // ! negate 


console.log(typeof(value1)) // number
console.log(typeof(value2)) // strong

//conditional statement
// if, if else, if else if
// in javasxciro, decimenal is also a number
//if nume1 > nume2 - fale
//num1 = 5, num2=10
//if statement
value=5
value2=10
if(value2 > value1){
        console.log ("vaue 2 is grater than value 1")
//nested check if divisbile by 2
        if... // add nested
}

//value 1 is greater than vlaeu 2 or not
if(value1 > value2){
        console.log("value is greater than values2")
} else {
    console/log("value 1 is not greater than value 2")
}

score =95
if(score >=85){
    console.log("very good")
} else if (score <85 && score >=50) {
    console.log("good")
}else {
    console.log ("needs imrpovemnet")
}

//toexecute the baove agai and again
// use functiom declaraiton

function gradeSystem(score){
    if (score >=85){
        console.log("very good")
    }  else if (score <85 && score >=50) {
        console.log("good") 
    }else {
        console.log ("needs imrpovemnet")
    }
}

gradeSysrem(score) //fucntion call with arguemnt

// iteration - loops - foloo and while loop
console.log("hi") //to disaply 10 times

//for(initialize; consdition/ update)

for(let num = 1; num <= 10++){
    console.log(num)  // dispaly 1 to 10
}

//initialise
//while (condition){ 
    //update

let num = 1
while (num<= 10){  // dispaly only the odd numbers
    console.log(num)
    num +=2  // keeps looing -while lpopp if dont knwo how many times to try
}

