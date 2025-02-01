const express = require('express');
const mongooseDB = require('./config/database');
const app = express();

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




