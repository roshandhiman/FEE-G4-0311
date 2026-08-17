console.clear();
const prompt = require("prompt-sync")();

console.log("=== ROSHAN INVENTORY MANAGEMENT SYSTEM ===");
console.log();

let stock = [];

function addStock() {
    let item_code = Number(prompt("Enter item code : "));
    let item_name = prompt("Enter item name : ");
    let item_price = Number(prompt("Enter item price : "));
    let item_quantity = Number(prompt("Enter item quantity : "));

    let item = {
        code: item_code,
        item: item_name,
        price: item_price,
        quantity: item_quantity
    };

    stock.push(item);

    console.log("\nRoshan inventory updated successfully.");
    console.log();
}

while (true) {
    addStock();
    let loop = prompt("Add more items? (0 for no / 1 for yes) : ");
    loop = parseInt(loop);
    if (loop === 0) break;
}

console.log("\nInventory entry completed.");
console.log("\nUpdated stock in Roshan store:");
console.log(stock);
console.log();

for (let element of stock) {
    console.log("Item:", element.item);
}

stock.forEach((element) => {
    console.log(`Price of ${element.item}: $${element.price}`);
});