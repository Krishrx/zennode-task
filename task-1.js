const readline = require('readline'); //import readline to handle user inputs from cmd.

//we'll store products in array of objects so in future we can add additional fields.
const products = [
    { name: 'Product A', price: '$20' },
    { name: 'Product B', price: '$40' },
    { name: 'Product C', price: '$50' }
]

const currUser = [];
let totalUnits = 0;
let giftAmount = 0;
let shippingAmount = 0;
let subTotal = 0;
let discountString = '';
let discountAmount = 0;

main(products); //starting point

async function main(products) {
    show(products); //shows available products so that user gets an idea.
    for (const product of products) {
        let q = await getQuantityForProducts(product.name); //get quantity from user
        let isGift = await isGiftWrappedUp(product.name); // user opt for gift wrapper
        let productTotalAmount = parseInt(product.price.substring(1)) * q;
        currUser.push({ name: product.name, price: product.price, quantity: q, isWrapped: isGift , totalAmount:"$"+productTotalAmount }); //we'll add each product purchase by user in an array so the we could print in invoice.
        if (isGift === 'y') giftAmount += q;
        totalUnits += q;
        subTotal += productTotalAmount;
        if (q>=10 && (productTotalAmount*5/100)>discountAmount) {
            discountAmount = (productTotalAmount * 5 / 100);
            discountString = "bulk_5_discount";
        }
        if (totalUnits >= 30) {
            let amt = 0;
            currUser.forEach((p) => {
                if (p.quantity > 15) {
                    let sq = p.quantity - 15;
                    amt += (parseInt(p.price.substring(1)) * sq) / 2;
                }
            })
            if (amt > discountAmount) {
                discountAmount = amt;
                discountString = "tiered_50_discount";
            }
        }
    }
    if (subTotal >= 200 && 10 > discountAmount) {
        discountAmount = 10;
        discountString = "flat_10_discount";
    }
    if (totalUnits >= 20 && (subTotal * 10 / 100) > discountAmount) {
        discountAmount = (subTotal * 10 / 100);
        discountString = "bulk_10_discount";
    }
    shippingAmount = (totalUnits <= 10)?5:Math.ceil(totalUnits / 10) * 5; //if totalUnits is <= 10 we'll consider the shippment charge as $5.
    //console.log(currUser);
    console.log('--------------------------------------------------------');
    showUserPurchase(currUser); //print out all products we bought above.
    console.log(`Sub Total : ${'$'+subTotal}`);
    console.log(`Discount Name : ${discountString === '' ? 'Not Applicable' : discountString}\nDiscount Amount : ${'$'+discountAmount}`);
    console.log(`Shipping Fee : ${'$' + shippingAmount}\nGift Wrap Fee : ${'$' + giftAmount}`);
    console.log(`Total Amount : ${"$"+(subTotal-discountAmount+shippingAmount+giftAmount)}`);
    console.log('--------------------------------------------------------');
}
/*
 In both getQuantityForProducts() & isGiftWrappedUp() methods we'll be using recursion so that if user enters something apart from desired value we'll keep on prompting.
*/

function getQuantityForProducts(productName) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`Enter the required quantity for ${productName}: `, (ans) => {
            let qNum = parseInt(ans);

            if(isNaN(qNum)) {
                console.log("Kindly, Enter numbers");
                rl.close();
                resolve(getQuantityForProducts(productName));
            }
            else {
                rl.close();
                resolve(qNum);
            }
        });
    });
}

function isGiftWrappedUp(productName) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(`Do you need ${productName} to be wrapped in gift (y/n) : `, (ans) => {
            let c = ans.toLowerCase();

            if (c != 'y' && c != 'n') {
                console.log("Kindly, Enter y or n");
                rl.close();
                resolve(isGiftWrappedUp(productName));
            }
            else {
                rl.close();
                resolve(c);
            }
        });
    });
}


function show(products) {
    console.log("Availabe products and its price.");
    console.log('---------------------');
    console.log(`Product Name | Price`);
    console.log('---------------------');
    products.forEach((product) => {
        console.log(`${product.name}    | ${product.price}`);
    })
}

function showUserPurchase(currUser) {
    console.log("                  Invoice                  ");
    console.log('--------------------------------------------------------');
    console.log(`Product Name | Quantity | Unit Price | Total Price`);
    console.log('--------------------------------------------------------');
    currUser.forEach((p) => {
        console.log(`${p.name}    | ${p.quantity}      | ${p.price}         | ${p.totalAmount}        `);
    })
}