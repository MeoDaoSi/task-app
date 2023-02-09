const {MongoClient, ObjectId} = require('mongodb');

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const databaseName = 'task_manager';

async function main(){
    // await client.connect()

    const db = client.db(databaseName);
    // console.log(result.acknowledged);
    // const result = await db.collection('users').insertMany([
    //     { name: "ton ngo no", age: 1256 },
    //     { name: "ton hanh gia", age: 2566 },
    //     { name: "gia hanh ton", age: 2415 }
    // ], { ordered: true })
    // const result = await db.collection('users').find({name : 'ton ngo no'}).toArray();
    const update = await db.collection('users').updateOne({ name : 'ton ngo no'},{ $set : { name : 'tinh'}})
    console.log(update);
    return 'done.';
}

main()
    .then( data => console.log(data) )
    .catch(console.error)