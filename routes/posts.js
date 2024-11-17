const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin1db");

const postSchema = mongoose.Schema({
    title: String,
    description: String,
    imageurl: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    imagetext:{
        type: String,
    },
    image: {
        type: String,
    },
    likes:{
        type: Array,
        default: []
    },
    createdAt:{
        type: Date,
        dafault: Date.now()
    }
})

module.exports = mongoose.model("post", postSchema)