const mongoose = require('mongoose');
require('dotenv').config();


const mongooseDB = async () => {
    await (
        mongoose.connect(process.env.MONGO_URL)
    );
};

module.exports = mongooseDB; 
