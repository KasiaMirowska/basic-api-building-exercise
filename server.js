const app = require('./index');
const knex = require('knex');
const DB_URL="postgresql://kamirska@localhost/bookstore";

const db = knex({
    client: 'pg',
    connection: DB_URL
})
app.set('db', db)
app.listen(8000, () => {
    console.log('listening on port 8000')
})
