const {Client} = require('pg');
const conn_string = require('./db_config');

async function crud(req_body) {
    let id = parseInt(req_body.id);
    let name = req_body.product_name;
    let price = parseInt(req_body.price);
    let amount = parseInt(req_body.amount);
    let shop = req_body.shop;
    let btn = req_body.btn;
    let crud_result = false;
    // Connect to database
    const client = new Client(conn_string);
    await client.connect();
    if (btn == "Update"){
        // query to update a row
        const query_string = {
            text: `UPDATE products SET product_name = $2, price = $3, amount = $4, shop = $5 WHERE id = $1`,
            values: [id, name, price, amount, shop]
        }
        let query_results = await client.query(query_string);
        console.log("UPDATED");
        console.log(query_results);
    }
    else if (btn == "Delete"){
        // query to delete a row
        const query_string = {
            text: `DELETE FROM products WHERE id = $1;`,
            values: [id]
        }
        let query_results = await client.query(query_string);
        console.log("DELETED");
        console.log(query_results);
    }
    else{
        // query to insert a row
        const query_string = {
            text: `INSERT INTO products VALUES ($1, $2, $3, $4, $5);`,
            values: [id, name, price, amount, shop]
        }
        let query_results = await client.query(query_string);
        console.log("INSERTED");
        console.log(query_results);
    }
    await client.end();
}

module.exports = crud;