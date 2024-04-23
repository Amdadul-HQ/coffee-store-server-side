const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express()

app.use(cors());
app.use(express.json())


// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2unx4b.mongodb.net/`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2unx4b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



    const database = client.db("coffeeDB");
    const coffeeCollection = database.collection("coffee");

    app.get('/coffee',async (req,res)=>{
     const cursor = coffeeCollection.find()
     const result = await cursor.toArray();
     res.send(result)
    })

    app.get('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {
        _id : new ObjectId(id)
      }
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.post('/coffee',async (req,res)=>{
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })

    app.put('/coffee/:id',async (req,res)=>{
       const id  = req.params.id;
       console.log(id);
       const updateCoffee = req.body
       const filter = {
        _id : new ObjectId(id)
       }
       const options = { upsert: true };
       const coffee ={
        $set:{
          coffeeName:updateCoffee.coffeeName,
          chefName:updateCoffee.chefName,
          supplier:updateCoffee.supplier,
          taste:updateCoffee.taste,
          categoryName:updateCoffee.categoryName,
          price:updateCoffee.price,
          photo:updateCoffee.photo
        }
       }
       const result = await coffeeCollection.updateOne(filter,coffee,options)
       res.send(result)
    })

    app.delete('/coffee/:id',async (req,res)=>{
      const id = req.params.id;
      const query ={
        _id: new ObjectId(id)
      }
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })
    // user data base
    
    const userCollection = database.collection("user")

    app.post('/user',async(req,res)=>{
      const newUser = req.body
      console.log(req.body);
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    app.get('/user',async(req,res)=>{
      const cursor = userCollection.find()
      const users = await cursor.toArray()
      res.send(users)
    })

    app.patch('/user',async(req,res)=>{
      const user = req.body
      const filter = {
        email: user.email
      }
      const updateUser = {
        $set:{
          lastSignInTime: user.lastSignInTime
        }
      }
      const result = await userCollection.updateOne(filter,updateUser)
      res.send(result)
      
    })

    app.delete('/user/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {
        _id :new ObjectId(id)
      }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('Coffee Store is running')
})

app.listen(port,()=>{
    console.log(`Coffee Store in running on :${port} PORT`);
})