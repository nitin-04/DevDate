const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("No token, authorization denied");
        };

        const decodedObj = await jwt.verify(token, "DEV@Date$2025");

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).send("ERROR: " + err.message);
    }
}


module.exports = { userAuth };


// //error handling
// auth.get("/getUserData", (req, res) => {

//     try {
//         throw new Error("Error");
//         res.send("User Data Send through Try")
//     }
//     catch (err) {
//         res.status(500).send("Some Error Occurred but catch");
//     }
// });

// //Global error handling middleware
// //if error happen anywhere in the url that don't have any specific catch handling
// // parameter sequence err-req-res-next  always
// auth.use("/", (err, req, res, next) => {
//     if (err) {
//         res.status(500).send("Some Error Occurred");
//     }
// });

// auth.listen(1234);