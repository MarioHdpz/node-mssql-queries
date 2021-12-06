require('dotenv').config();

var Connection = require('tedious').Connection;  
var config = {  
    server: process.env.HOST,  //update me
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER, //update me
            password: process.env.PASSWORD  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: process.env.DB  //update me
    }
}; 
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed. 
    if (err) {
        console.log(err);
        return
    }
    console.log("Connected");  
    executeStatement();  
});  

connection.connect();

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

function executeStatement() {
    const query = [...process.argv].pop();
    request = new Request(query, function(err) {  
        if (err) {
            console.log(err);
        }
    });
    request.on('row', function(columns) {
        console.log("=======================================")
        columns.forEach(function(column) {  
            let val = "NULL"
            if (column.value !== null) {  
                val = column.value;  
            }
            console.log(`${column.metadata.colName}: ${val}`)
        });
    });  

    request.on('done', function(rowCount, more) {  
        console.log(rowCount);  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}

