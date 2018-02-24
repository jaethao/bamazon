var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host:"localhost",
  port: 3306,
  user:"root",
  password:"J@d3dhere",
  database:"bamazon"
})

connection.connect(function(err){
  if (err) throw err;
  console.log("Welcome to Bamazon!");
  table();
})

var table = function() {
  connection.query("SELECT * FROM products", function(err,res){
    for(var i = 0; i<res.length; i++){
      console.log(res[i].itemid+" - "+res[i].productname+" - "+res[i].price+" - "+res[i].
    stockquantity+"\n");
    }
    askCustomer(res);
  })
}

var askCustomer = function(res){
  inquirer.prompt([{
    type: "input",
    name: "choice",
    message: "What would you like to buy? [Q to quit]"
  }]).then(function(answer){
    var correct = false;
    if(answer.choice.toUpperCase() == "Q"){
      process.exit();
    }
    for(var i = 0; i<res.length; i++){
      if(res[i].productname == answer.choice){
        correct = true;
        var product = answer.choice;
        var id = i;
        inquirer.prompt({
          type: "input",
          name: "qty",
          message: "How many would you like to buy?",
          validate: function(value){
            if(isNaN(value) == false){
              return true;
            } else {
              return false;
            }
          }
        }).then(function(answer){
          if((res[id].stockquantity-answer.qty)>0){
            connection.query("UPDATE products SET stockquantity='"+
          (res[id].stockquantity-answer.qty)+"' WHERE productname='"+product
        +"'", function(err,res2){
          console.log("Purchased!");
          table();
        })
      } else {
        console.log("Insufficient quantity!");
        askCustomer(res);
      }
        })
      }
      if(i == res.length && correct == false){
        console.log("Not a valid selection!");
        askCustomer(res);
      }
    }
  })
}
