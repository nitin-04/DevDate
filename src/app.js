const express = require('express');
const mongooseDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post("/signup", async (req, res) => {

    const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'password123'
    })
    try{
        await user.save();
        res.send("User Added Successfully..!")
    }
    catch(err){
        res.status(400).send("Error saving user: " + err.message);
    };
});




mongooseDB()
    .then(() => {
        console.log("connection Established Successfully")
        app.listen(4444, () => {
            console.log('Server is running on port 4444');
        });
    }).
    catch((err) => {
        console.error("connection cannot be established");
    })




