const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const jwt = require('jsonwebtoken');

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqrjy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('DB Connected');

        const productCollection = client.db("warehouse").collection("grocery");
        // const orderCollection = client.db("warehouse").collection("orders");

        app.get('/service', async (req, res) => {
            const email = req.query.email;
            const query = {email};
            const cursor = productCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        // Add Product
        app.post('/service', async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        //Delete a Product
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        })



        // app.get("/orderList", async (req, res) => {
        //     const tokenInfo = req.headers.authorization;

        //     console.log(tokenInfo)
        //     const [email, accessToken] = tokenInfo.split(" ")
        //     // console.log(email, accessToken)

        //     const decoded = verifyToken(accessToken)

        //     if (email === decoded.email) {
        //         const orders = await productCollection.find({email:email}).toArray();
        //         res.send(orders);
        //     }
        //     else {
        //         res.send({ success: 'UnAuthorized Access' })
        //     }

        // })




        app.post("/login", (req, res) => {
            const email = req.body;

            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);

            res.send({ token })
        })







        // // Add Product

        // app.post("/uploadPd", async (req, res) => {
        //     const product = req.body;

        //     const tokenInfo = req.headers.authorization;
        //     // console.log(tokenInfo)
        //     const [email, accessToken] = tokenInfo.split(" ")
        //     // console.log(email, accessToken)

        //     const decoded = verifyToken(accessToken)

        //     if (email === decoded.email) {
        //         const result = await productCollection.insertOne(product);
        //         res.send({ success: 'Product Upload Successfully' })
        //     }
        //     else {
        //         res.send({ success: 'UnAuthorized Access' })
        //     }
        // })

        // // Get Products
        // app.get("/products", async (req, res) => {
        //     const products = await productCollection.find({}).toArray();
        //     res.send(products);
        // })



        // update product
        // app.put('/products/:id', async(req, res) =>{
        //     const id = req.params.id;
        //     const updatedProduct = req.body;
        //     const filter = {_id: ObjectId(id)};
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             name: updatedProduct.name,
        //             price: updatedProduct.price
        //         }
        //     };
        //     const result = await productCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);

        // })

        // //Delete a Product
        // app.delete('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productCollection.deleteOne(query);
        //     res.send(result);
        // })







        // app.post("/addOrder", async (req, res) => {
        //     const orderInfo = req.body;

        //     const result = await orderCollection.insertOne(orderInfo);
        //     res.send({ success: 'order complete' })
        // })






    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Simple Grocery Warehouse')
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// verify token function
// function verifyToken(token) {
//     let email;
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             email = 'Invalid email'
//         }
//         if (decoded) {
//             console.log(decoded)
//             email = decoded
//         }
//     });
//     return email;
// }