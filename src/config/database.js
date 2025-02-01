const mongoose = require('mongoose');


const mongooseDB = async () => {
    await mongoose.connect(
        "mongodb+srv://nodejs:5zlen9keFMB2eYp8@nodejs.jjb3a.mongodb.net/"
    );
}

module.exports = mongooseDB; 
