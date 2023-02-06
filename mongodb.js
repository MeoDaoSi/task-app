const {MongoClient} = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const databaseName = 'task_manager';

async function main(){
    // await client.connect()
    const db = client.db(databaseName);
    // const result = await db.collection('users').insertOne({
    //     name: "Tinhle",
    //     age: 20
    // })
    // console.log(result.acknowledged);
    const result = await db.collection('users').insertMany([
        { name: "ton ngo no", age: 1256 },
        { name: "ton hanh gia", age: 2566 },
        { name: "gia hanh ton", age: 2415 }
    ], { ordered: true })
    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)