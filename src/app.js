const express = require('express');
const mongooseDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


app.use(express.json()); //middleware-convert json data that comes from the postman 
app.use(cookieParser());


app.post("/signup", async (req, res) => {
    try {
        //Validation of the Data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        // console.log(passwordHash)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Successfully..!")
    }
    catch (err) {
        res.status(400).send("ERROR : " + err.message);
    };
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials. Please try again")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (isPasswordValid) {

            const token = await jwt.sign({ _id: user.id }, "DEV@Date$2025", { expiresIn: "1d" });
            // console.log(token);
            //Add the token to the cookies and return the response
            res.cookie("token", token);
            res.send("Login Successfully...")
        }
        else {
            throw new Error("Invalid Credentials")
        }
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }


})


app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch (err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

//Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId: userEmail });
        if (!user) {
            res.status(404).send("User emalID not found")
        }
        else {
            res.send(user);
        }
    }
    catch {
        res.status(404).send("User emalID not found")
    }
})


//Feed API - GET/ feed -- get all the users from Database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(404).send("Error getting feed");
    }
})

//Delete User from the Database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).send("User ID not found")
        }
        else {
            res.send("User deleted Successfully..!")
        }
    }

    catch {
        res.status(404).send("Error deleting user");
    }
})

//Update user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "about",
            "skills",
            "gender",
            "age",

        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k));

        if (!isUpdateAllowed) {
            throw new Error("Update Not Allowed");
        }

        if (data?.skills.length > 12) {
            throw new Error("Skills can't exceed 12");
        }


        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true })
        res.send("User updated successfully..")
    }
    catch (err) {
        res.status(404).send("UPDATE FAILED:" + err.message)
    }
})

mongooseDB()
    .then(() => {
        console.log("connection Established Successfully...")
        app.listen(4444, () => {
            console.log('Server is running on port 4444');
        });
    })
    .catch((err) => {
        console.error("connection cannot be established");
    });




