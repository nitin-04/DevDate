const mongoose = require('mongoose');

const connectionRequestschema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,

            required: true
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignore", "interested", "accepted", "rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {
        timestamps: true,
    }
);


connectionRequestschema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestschema.pre("save", function (next) {
    const connectionRequest = this;

    //Check if the connection request fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    };
    next();
})


const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestschema
);

module.exports = ConnectionRequestModel;