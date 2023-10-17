var {Client} = require('pg');
var conn_string = require('./db_config');

async function table_display(table_name, shop_name, shop_id) {
    // Connect to DB
    const client = new Client(conn_string);
    await client.connect();

    // Query to DB and get the products table
    // const query_string_1 = {
    //     text: 'SELECT * FROM $1',
    //     values: [table_name]
    // }

    // const query_string_2 = {
    //     text: `SELECT * FROM ${table_name} WHERE shop = (SELECT shop FROM accounts WHERE user_name = $1)`,
    //     values: [user_name],
    // }
    // const query_result_2 = await client.query(query_string_2);

    let query_string = `SELECT * FROM ${table_name}`;   // All Selected value = 0
    if (shop_id != 0) {
        query_string = {
            text: `SELECT * FROM ${table_name} WHERE shop = (SELECT name FROM shops WHERE  id=$1)`,
            values: [shop_id],
        }
    }
    if (shop_name != 'director'){
        query_string = {
            text: `SELECT * FROM ${table_name} WHERE shop = $1`,
            values: [shop_name],
        }
    }
    const query_result = await client.query(query_string);

    // Generate all cells of table for this data
    // console.log(query_result_1);
    let table_string = ``;
    if (shop_name == 'director') {
        table_string = table_html(query_result)
    }
    else {
        table_string = table_crud(query_result)
    }
    client.end();
    return table_string;
}

function table_crud(db_table){
    let html_string = `<table border = 1> <tr>`;
    const fields_list = [];
    
    // generate the table header
    db_table.fields.forEach ((field) => {
        html_string += `<th> ${field.name} </th>`;
        fields_list.push(field.name);
    });
    // Add CRUD in header
    html_string += `<th> CRUD </th>`;
    html_string += `</tr>`;
    // generate all table rows
    for(let i = 0; i < db_table.rowCount; i++) {
        row = db_table.rows[i];
        html_string += `<tr>`;
        fields_list.forEach((field) => {
            let cell = row[field];
            html_string += `<td>${cell}</td>`;
        });
        // Add 2 button into the CRUD cell
        html_string += `</tr>`;
    }
    // Add an INSERT row
    html_string += `<tr><form action ="/users/crud" method =POST>`;
    fields_list.forEach((field) => {
        html_string += `<td><input type ="text" name =${field}></td>`;
    });
    // Add button Insert 
    html_string += `<td><input type ="submit" name ="btn" value ="Insert"></td></form></tr>`;
    html_string += `</table>`;
    return html_string;
}

function table_html(db_table){
    let html_string = `<table border = 1> <tr>`;
    const fields_list = [];
    
    // generate the table header
    db_table.fields.forEach ((field) => {
        html_string += `<th> ${field.name} </th>`;
        fields_list.push(field.name);
    });
    // Add CRUD in header
    html_string += `</tr>`;
    // generate all table rows
    for(let i = 0; i < db_table.rowCount; i++) {
        row = db_table.rows[i];
        html_string += `<tr>`;
        fields_list.forEach((field) => {
            let cell = row[field];
            html_string += `<td>${cell}</td>`;
        });
        // Add 2 button into the CRUD cell
        html_string += `</tr>`;
    }
    html_string += `</table>`;
    return html_string;
}

module.exports = table_display;









{/* <th> CRUD </th>
<form action ="/users/crud" method =POST></form>
<input type ="text" name =${field} value =>
<td><input type ="submit" name ="btn" value ="Update">`;
        html_string += `<input type ="submit" name ="btn" value ="Delete"></td></form> */}
// Add an INSERT row
// html_string += `<tr><form action ="/users/crud" method =POST>`;
// fields_list.forEach((field) => {
//     html_string += `<td><input type ="text" name =${field}></td>`;
// });
// // Add button Insert 
// html_string += `<td><input type ="submit" name ="btn" value ="Insert"></td></form></tr>`;