const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require ('cors');
const app = express();
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const port = process.env.PORT || 5000 git init;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ge4ap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
  try{
    await client.connect();
    const database = client.db("travelservices")
    const serviceCollection = database.collection('services')
    const orderCollection = database.collection('order')


    app.get('/allservices', async(req,res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })

    app.get('/singleproducts/:id', async(req,res) => {
      const id = req.params.id;
      const qurey = { _id:ObjectId(id) };
      const service = await serviceCollection.findOne(qurey)
      console.log("Load with id",id);
      res.send(service)

    })

    app.get('/myOrder/:email',async (req,res) => {
      const email = req.params.email;
      const qurey = {email:req.params.email}
      const service = await orderCollection.find(qurey).toArray();
      res.send(service)
      console.log(service);
    })
    // service added 
    app.post('/addservices', async(req,res) => {
      const service = req.body;
      console.log("Hit The Post",service)
      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result)
    })

   

    // order post

    app.post("/orderconfirm",async(req,res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.json(result)
    })


    app.delete('/deleteorder/:id' , async(req,res) => {
      const id =req.params.id;
      const qurey = {_id:ObjectId(id)}
      const result = await orderCollection.deleteOne(qurey)
      console.log(result);
      res.json(result)
    })

    // get order

  }
  finally{
    // await client.close()
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})