const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");
const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "gender", "skills", "about"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message: "Data Fetched successfully",
            data: connectionRequests,
        });

    }
    catch (err) {
        request.status(400).send("ERROR: " + err.message);
    }


});


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ],
        })
            .populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data });
    }
    catch (err) {
        response.status(400).send({ message: err.message });
    }
});


userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],

        }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.send(users);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = userRouter;