// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const mongoUri = "mongodb+srv://UDP_SCP:udpscp@db.m2r6zwa.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB URI

app.get('/getStreetRankings', async (req, res) => {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const collection = client.db("streets").collection("weighted-metrics");
        const streetRankings = await collection.find({}).toArray();
        res.json(streetRankings);
    } catch (error) {
        res.status(500).send('Error fetching street rankings');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});