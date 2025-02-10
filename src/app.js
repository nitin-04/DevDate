const express = require('express');
const mongooseDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json()); //middleware-convert json data that comes from the postman 



app.post("/signup", async (req, res) => {

    console.log(req.body);

    const user = new User(req.body);
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
    })
    .catch((err) => {
        console.error("connection cannot be established");
    });




