const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello From Node');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egkdk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const run = async () => {
    try{
        await client.connect();
        const InventoryCollection = client.db("carhouse").collection("cars");
        
        app.get('/inventory', async(req, res) => {
            const query = {};
            const cursor = InventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await InventoryCollection.findOne(query);
            res.send(result);
        })

        app.put('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const updateCar = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateCar.quantity
                },
            };
            const result = await InventoryCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
       
    }


    finally{
        //await client.close(); or empty
    }
}
run().catch(console.dir)





app.listen(port, () => {
    console.log("Listening On: ", port);
})



