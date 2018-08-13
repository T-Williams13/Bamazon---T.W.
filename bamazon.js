var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "CatDog!1",
  database: "bamazon_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  display();

});


function display() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    console.log('Welcome to BAMazon');
    console.log('----------------------------------------------------------------------------------------------------');
    for (var i = 0; i < results.length; i++) {
      console.log("ID: " + results[i].item_id + " | " + "Product: " + results[i].product_name + " | " + "Department: " + results[i].department_name + " | " + "Price: " + results[i].price + " | " + "QTY: " + results[i].stock_quantity);
      console.log('--------------------------------------------------------------------------------------------------')
    }
    console.log(" ");
    start();
  });
}


function start() {
  inquirer
    .prompt([{
        name: "id",
        type: "input",
        message: "What is the ID of the item you would like to purchase?",
      },
      {
        name: "stock_quantity",
        type: "input",
        message: "How many of these items would you like to purchase?"
      }
    ])
    .then(function (answer) {
      checkExists(answer);
    })
}

function checkExists(answer) {
  connection.query("SELECT * FROM products", function (err, results) {
    var stockItem = {};
      if (err) throw err;
      for(var i = 0; i < results.length; i++){
        if (answer.id == results[i].item_id){
          stockItem = results[i];
        }
        }
      if (Object.keys(stockItem).length === 0 && stockItem.constructor === Object) {
        // fillOrder();
        console.log("Object is empty or User put in wrong ID");
      } else {
        checkStock(stockItem, answer.stock_quantity);
      }

    });

function checkStock(stockItem, userQuantity){
  if (stockItem.stock_quantity < userQuantity){
    console.log("Insufficient quantity!")
start();
  }else{
    console.log("There's enough!")
    fillOrder(stockItem, userQuantity)
  }
}
}


    function fillOrder(stockItem, userQuantity) {
      console.log('StockItem:', stockItem);
      console.log('userQuantity:', userQuantity)
      var newQuantity = stockItem.stock_quantity - parseInt(userQuantity);
  connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        item_id: stockItem.item_id
      }
    ],
    function(error) {
      if (error) throw error;
      console.log("Item updated in database!")
    }
    
  );
}
