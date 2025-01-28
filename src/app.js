const express = require('express');

const app = express();

// This will only handle the GET requests
app.get("/", (req, res) => {
    res.send("Hello From The Server Through GET...")
})

// This will only handle the POST requests
app.post("/", (req, res) => {
    res.send("Hello From The Server Through POST...")
})

// This will handle all requests (GET, POST, PUT, DELETE)
app.use("/", (req, res) => {
    res.send("Hello From The Server...")
})

// This will handle all requests (GET, POST, PUT, DELETE) for the /test path
app.use("/test", (req,res)=> {
    res.send("This Is The Test Response From The Server...")
})

// only one response can be sent in a single request even if the next() is called
app.use("/test1", (req,res, next) =>{
    // res.send("This Is The Test1 Response From The Server...")
    next(); //next() is called to pass the control to the next middleware
},
(req,res, next) =>{
    // res.send("This Is The Test2 Response From The Server...")
    next()
},

(req,res) =>{
    res.send("This Is The Test3 Response From The Server...") //actual request handler response
},
(req,res) =>{
    res.send("This Is The Test4 Response From The Server...")
}
);












app.listen(4444, () => {
    console.log('Server is running on port 4444');
});