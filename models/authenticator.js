// Query for username and password in DB for authenticating
const {Client} = require('pg');
const conn_string = require('./db_config');

async function authen(uname, pword){
    let auth = false;
    let shop = "";
    const client = new Client(conn_string);
    await client.connect();
    const query_string = {
        text: 'SELECT * FROM accounts WHERE user_name = $1 AND pass_word = $2',
        values: [uname, pword],
    }

    // console.log(await client.query(query_string))
    const query_result = await client.query(query_string)
    console.log(query_result)
    if(query_result.rowCount == 1){
        auth = true;  
        shop = query_result.rows[0].shop;
    }
    await client.end();
    return {"auth": auth, "shop": shop};
}

module.exports = authen;
