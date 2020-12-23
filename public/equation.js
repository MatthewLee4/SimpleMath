// //.random gives us a number between 0 and 1
// //.floor will round the number up
// //multiply by range so that the number we get isn't between 0 and 1

// let getRandomNumber1 = function(start, range) { 
//     let getRandom = Math.floor((Math.random() * range) + start); 
//     while (getRandom > range) {     //this loop will give us a number that is not greater than the range
//         getRandom = Math.floor((Math.random() * range) + start)
//     }
//     return getRandom;
// }
// var x = getRandomNumber1(1, 10); //set the range for what number you want



// let getRandomNumber2 = function(start, range) { 
//     let getRandom = Math.floor((Math.random() * range) + start); 
//     while (getRandom > range) {     //this loop will give us a number that is not greater than the range
//         getRandom = Math.floor((Math.random() * range) + start)
//     }
//     return getRandom;
// }
// var y = getRandomNumber2(1, 10); //set the range for what number you want
