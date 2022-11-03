const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
const port = process.env.PORT || 5000;




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kfc3dzw.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const connectionDb = async () => {
    try {
        const database = client.db('carDoctor').collection('services');
        const orderDatabase = client.db('carDoctor').collection('orders');

        app.get('/services', async (req, res) => {
            const cursor = database.find({});
            const services = await cursor.toArray();
            res.send(services);
            console.log(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = await database.findOne({_id: ObjectId(id)});
            res.send(cursor);
            console.log(cursor);
        })

        //order api---->
        app.post('/orders', async(req,res) => {
            const orders = req.body;
            const result = await orderDatabase.insertOne(orders);
            res.send(result);
            console.log(result);
        })

        app.delete('/orders/:id', async(req,res) =>{
            const id = req.params.id;
            const result = await orderDatabase.deleteOne({_id: ObjectId(id)});
            res.send(result);
            console.log(result);
        })

        app.patch('/orders/:id', async (req,res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = {_id: ObjectId(id)};
            const updateDoc = {
                $set: {
                    status: status
                }
            }
            const result = await orderDatabase.updateOne(query, updateDoc);
            res.send(result);
            console.log(result);
        })

        app.get('/orders', async (req,res) => {
            let query = {};
            const email = req.query.email;
            console.log(email);
            if(email) {
                query = {email};
            }

            const cursor = orderDatabase.find(query);
            const orders = await cursor.toArray();
            res.send(orders)
        })


    } finally {}
}

connectionDb().catch((err) => console.error(err));

app.get('/', (req, res) => {
    res.send('Server up and running');
})
console.log(process.env.DB_USER);

app.listen(port, (r) => {
    console.log('Server is running');
})