require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umkvz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
 

    const usersCollections = client.db("userCollection").collection("users");

    

    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await usersCollections.insertOne(data);
      res.send(result);
    });

    app.post("/googleusers", async (req, res) => {
      const data = req.body;
      const email = data.email;
    //   console.log(data.email);
      const query = { email: email };
      const exitingEmail = await usersCollections.findOne(query);

      if (!exitingEmail) {
        const result = await usersCollections.insertOne(data);
        res.send(result);
      }
    });

    app.post("/addcampaign", async (req, res) => {
      const data = req.body;
      const result = await usersCollections.insertOne(data);
      res.send(result);
    });

    app.get("/mycampaigns/:email", async (req, res) => {
      const email = req.params.email;
    //   console.log(email);
      const query = { email: email };
      const result = await usersCollections.find(query).toArray();
      res.send(result);
    });

    app.delete("/mycampaigns/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.deleteOne(query);
      res.send(result);
    });

    app.get("/mycampaignupdate/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await usersCollections.findOne(query);
      res.send(result);
    });

    app.put("/updatecampaigndata/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      const updateData = {
        $set: {
          photo: data.photo,
          deadline: data.deadline,
          amount: data.amount,
          title: data.title,
          campaign: data.campaign,
          description: data.description,
        },
      };

      const result = await usersCollections.updateOne(
        filter,
        updateData,
        options
      );
      res.send(result);
    });

    app.get('/allusers',async(req,res)=>{
        const result=await usersCollections.find().toArray()
        res.send(result)
    })

    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, (req, res) => {
  console.log("server in running on port:", port);
});
