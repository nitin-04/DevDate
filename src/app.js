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


app.listen(4444, () => {
    console.log('Server is running on port 4444');
});