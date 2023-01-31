const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4hum0hz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next()
    })
}


async function run() {
    try {
        // const bookingsCollection = client.db('doctorsPortal').collection('bookings');
        // const blogsCollection = client.db('BookResale').collection('blogs');
        // const booksCollection =client.db('BookResale').collection('books');
        

        const usersCollection = client.db('realStateDatabase').collection('user');
        const propertyCollection = client.db('realStateDatabase').client('property');


        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail }
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next()
        }

        //Property

        app.post('/property', async(req,res)=>{
            const property=req.body;
            const result = await propertyCollection.insertOne(property);
            res.send(result);
        })
        

        //Users

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })


        app.get('/users',async(req,res)=>{
            const role=req.query.role;
            const query={role:role}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })






        //Admin and Seller Find

        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.get('/users/seller/:email',async(req,res)=>{
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });  
        })






        // const verifyAdmin = async (req, res, next) => {
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail }
        //     const user = await usersCollection.findOne(query);

        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next()
        // }
        

        // app.delete('/users',async(req,res)=>{
        //     const id=req.query.id;
        //     const query={_id:ObjectId(id)}
        //     const result = await usersCollection.deleteOne(query);
        //     res.send(result);
        // })

        // app.get('/jwt', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const user = await usersCollection.findOne(query);
        //     if (user) {
        //         const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
        //         return res.send({ accessToken: token })
        //     }
        //     res.status(403).send({ accessToken: 'forbidden' })
        // })
       

        
   

        //for checking admin
        

        // app.get('/users/seller/:email',async(req,res)=>{
        //     const email = req.params.email;
        //     const query = { email }
        //     const user = await usersCollection.findOne(query);
        //     res.send({ isSeller: user?.role === 'seller' });  
        // })

        // app.post('/booking',async(req,res)=>{
        //     const bookingBook=req.body;
        //     const result = await bookingCollection.insertOne(bookingBook)
        //     res.send(result)
        // })
        // app.get('/booking',async(req,res)=>{
        //     const email = req.query.email;
        //     const query={userEmail:email}
        //     const result = await bookingCollection.find(query).toArray()
        //     res.send(result)
        // })

            
        // app.put('/advertise/:id',async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             advertise: 'advertise'
        //         }
        //     }
        //     const result = await booksCollection.updateOne(filter, updatedDoc, options);
        //     res.send(result);
        // });

        app.get('/',(req,res)=>{
            res.send('App Connected');
        })


        
    }
    finally {

    }


}
run().catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('This is home page')
})

app.listen(port, () => {
    console.log(`app is listening ${port}`)
})