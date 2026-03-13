function checkVariable(input) {
    switch (typeof input) {
        case "string":
            return "string";

        case "number":
            return "number";

        case "boolean":
            return "boolean";

        case "bigint":
            return "bigint";

        case "undefined":
            return "undefined";

        case "object":
            return "object";

        default:
            return "unknown type";
    }
}
// const readline = require("readline");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// rl.question("Enter any datatype: ", function(input) {
//   console.log(checkVariable(input))
//   rl.close();
// });

const prompt = require("prompt-sync")();

let name = prompt("Enter any datatype:");
if (!isNaN(name)) {
    name = Number(name);

}
if (name == "true") {
    name = name == "true"


} else if (name == "false") {
    name = name == "false"
}

console.log(checkVariable(name));



function generateIDs(count) {

    const ids = [0, 1, 2, 3, 4, 5, 6, 7];
    const result = [];

    for (let i = 0; i <= count; i++) {

        if (i === 5) {
            continue;
        }

        const id = `ID-${ids[i]}`;
        result.push(id);
    }

    return result;
}

console.log(generateIDs(7));


// try
function calculateTotal(...numbers) {
    try {
        if (!numbers.every(num => typeof num === "number")) {
            throw new TypeError("Invalid input: All arguments must be numbers");
        }


        return numbers.reduce((sum, num) => sum + num, 0);
    } catch (error) {
        console.log(error.message);
    }
    //
    // if (!numbers.every(num => typeof num === "number")) {
    //     throw new TypeError("Invalid input: All arguments must be numbers");
    // }
    // return numbers.reduce((sum, num) => sum + num, 0);
}

console.log("Sum:", calculateTotal(5, 10, 15));
console.log("Sum:", calculateTotal("1", "7", "3", "4"));
// try {
//     console.log("Sum:", calculateTotal(5, 10, 15));
//     console.log("Sum:", calculateTotal("1", "7", "3", "4"));
// } catch (error) {
//     console.log(error.message);
// }


// function getScorers(playerList) {

//     let topScorers = [];

//     for (let i = 0; i < playerList.length; i++) {
//         let player = playerList[i];

//         if (player.score > 8) {
//             topScorers.push(player.name);
            
//         }
        
//     }
//     return topScorers.join(",");


    
// }

function getTopScorers(playerList) {
    return playerList
        .filter(player => player.score > 8)       
        .map(player => player.name)               
        .join(', ');                              
}
const playerList =[
    {"name": "Jona", "score": 10},
    {"name": "rocky", "score": 9},
    {"name": "kyle", "score": 5},
    {"name": "kai", "score": 6},
    {"name": "junel", "score": 9},

    {"name": "judy", "score": 7},
    {"name": "shella", "score": 6},
    {"name": "nicole", "score": 5},
    {"name": "jennie", "score": 5},
    {"name": "julius", "score": 1}
]

console.log(getTopScorers(playerList));

class Item {

    #discount = 0.1;

    constructor(name, price) {
        this.name =name;
        this.price = price;

    }
    get finalPrice() {
        return this.price - (this.price * this.#discount);

    }
}

const item1 = new Item("laptop", 1000);

console.log("item: ", item1.name);
console.log("Final Price: ", item1.finalPrice);
