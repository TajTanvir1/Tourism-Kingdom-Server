const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
   origin:["http://localhost:5173","https://a10-tourism-kingdom.web.app"]
}));

app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5peoxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
      // await client.connect();

      const spotCollection = client.db('spotDB').collection('spot');
      const countryCollection = client.db('spotDB').collection('countryDetails');

      app.get('/spot', async (req, res) => {
         const cursor = spotCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      })

      app.get('/countryDetails', async (req, res) => {
         const cursor = countryCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      })

      app.get('/spot/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await spotCollection.findOne(query);
         res.send(result)
      })

      app.put('/spot/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) }
         const option = { upsert: true }
         const updatedDetails = req.body;
         const details = {
            $set: {
               image: updatedDetails.image,
               spotName: updatedDetails.spotName,
               countryName: updatedDetails.countryName,
               location: updatedDetails.location,
               averageCost: updatedDetails.averageCost,
               seasonality: updatedDetails.seasonality,
               travelTime: updatedDetails.travelTime,
               totalVisitor: updatedDetails.totalVisitor,
               shortDescription: updatedDetails.shortDescription,

            }
         }
         const result = await spotCollection.updateOne(filter, details, option);
         res.send(result)
      })

      app.get('/myList/:email', async (req, res) => {
         const id = req.params.email;
         // const query = {email: new ObjectId(id)}
         const result = await spotCollection.find({ email: req.params.email}).toArray();
         res.send(result);
      })

      app.get('/spot/:countryName', async (req, res) => {
         const countryName = req.params.countryName;
         const result = await spotCollection.find({ countryName: req.params.countryName }).toArray();
         res.send(result);
      })


      app.post('/spot', async (req, res) => {
         const spotDetails = req.body;
         console.log(spotDetails);
         const result = await spotCollection.insertOne(spotDetails);
         res.send(result);
      })

      app.delete('/spot/:id', async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) }
         const result = await spotCollection.deleteOne(query);
         res.send(result);
      })


      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);



app.get('/', (req, res) => {
   res.send('Tourism Server is Running')
})

app.listen(port, () => {
   console.log(`Tourism Server is is running on port ${port}`)
})