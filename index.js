const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
var cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
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

        //Update 
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

        //Delete
        app.delete('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await InventoryCollection.deleteOne(query)
            res.send(result)
        })


        //Post
        app.post('/addmycar', async(req, res) => {
            const addCar = req.body;
            const result = await InventoryCollection.insertOne(addCar);
            res.send(result);
        })

        //Get - My Car
        app.get('/addmycar', verifyJWT, async(req, res) => {
            //const authHeader = req.headers.authorization;  //1st checking
            //console.log(authHeader);

            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if(email == decodedEmail){
            const query = { email: email };
            const cursor = InventoryCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        }
        else{
            res.status(403).send({message: 'Forbidden access'})
        }
        })

        //JWT
        app.post('/login', async(req, res) => {
            const user = req.body;
            console.log(user);
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({accessToken});
        })

        function verifyJWT(req, res, next){
            const authHeader = req.headers.authorization;
            if(!authHeader){
                return res.status(401).send({message: 'UnAuth Access'})
            }
            
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if(err){
                    return res.status(403).send({message: "Forbiden Access"})
                }
                console.log('decoded', decoded);
                req.decoded = decoded;
            })

            console.log("Inside VJWT",authHeader);
            next();

        }
       
    }

    finally{
        //await client.close(); or empty
    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log("Listening On: ", port);
})



