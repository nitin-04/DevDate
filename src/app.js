const express = require('express');

const app = express();

app.use("/", (req, res) => {
    res.send("Hello From The Server...")
})

app.use("/test", (req,res)=> {
    res.send("This Is The Test Response From The Server...")
})


app.listen(4444, () => {
    console.log('Server is running on port 4444');
});