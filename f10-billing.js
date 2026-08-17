console.clear();
const prompt = require("prompt-sync")();

const store = "ROSHAN SUPERMART & ELECTRONICS";
console.log("==========================================");
console.log(`        ${store}`);
console.log("==========================================");
console.log();

let items = ["Roshan Laptop Pro", "Roshan Wireless Mouse", "Roshan Mechanical Keyboard"];
let prices = [65000, 1500, 4500];

console.log("Current Catalog Items:", items);
console.log("Catalog Count:", items.length);
console.log();

items.push("Roshan Gaming Monitor", "Roshan HD Webcam");
prices.push(18000, 3200);

items.pop();
prices.pop();

console.log("------------------------------------------");
console.log("           ROSHAN BILLING COUNTER         ");
console.log("------------------------------------------");
console.log("S.No.\tItem Name\t\t\tPrice (INR)");
for (let i = 0; i < items.length; i++) {
    console.log(`${i + 1}\t${items[i].padEnd(28, " ")}\t${prices[i]}`);
}
console.log();

let serialnumber = Number(prompt("Enter Item No. to purchase : "));
console.log();

if (serialnumber < 1 || serialnumber > items.length) {
    console.log("Invalid Item Number selected!");
    return;
}

let quantity = Number(prompt("Enter Quantity : "));
console.log();

let price = prices[serialnumber - 1];
let cost = price * quantity;
let discount = 0;

if (cost >= 5000) {
    discount = cost * 0.05;
} else if (cost >= 2000) {
    discount = cost * 0.02;
} else {
    discount = cost * 0.01;
}

console.log("==========================================");
console.log("Selected Item :", items[serialnumber - 1]);
console.log("Gross Total   :", cost);
console.log("Discount      :", discount);
console.log("Net Payable   :", cost - discount);
console.log("==========================================");
console.log("Thank you for shopping with Roshan Supermart!");
console.log();