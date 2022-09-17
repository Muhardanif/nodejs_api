const { response } = require('express');
const express = require('express');
const app = express();

const admin = require("firebase-admin");
const credentials = require("./serviceAccountKeyBAS.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/create', async(req, res) => {
    try{
        const dataInput = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        const usersRef = await db.collection("users").add(dataInput);
        res.send(response);
    } catch(error) {
        res.send(error);
    }
});

app.get('/read/all', async(req, res) => {
    try{
        const usersRef = db.collection("CustomerData");
        // const usersRef = db.collection("users");
        const response = await usersRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });

        res.send(responseArr);
    } catch(error) {
        res.send(error);
    }
});

app.get('/read/:id', async(req, res) => {
    try{
        const usersRef = db.collection("users").doc(req.params.id);
        const response = await usersRef.get();
        res.send(response.data());
    } catch(error) {
        res.send(error);
    }
});

app.post('/update/:id', async(req, res) => {
    try{
        const dataUpdate = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };

        const usersRef = await db.collection("users").doc(req.params.id).update(dataUpdate);
        
        res.send(usersRef);
    } catch(error) {
        res.send(error);
    }
});

app.delete('/delete/:id', async(req, res) => {
    try{
        const response = await db.collection("users").doc(req.params.id).delete();
        
        res.send(response);
    } catch(error) {
        res.send(error);
    }
});

// set port and listen for our request

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port");
  });
