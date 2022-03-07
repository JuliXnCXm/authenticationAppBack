const { Schema, model } = require("mongoose");

//create schema
const photoSchema = Schema(
    {
        photoname: {
        type: String,
        },
        path: {
        type: String,
        },
        mimetype: {
        type: String,
        },
        photourl: {
        type: String,
        },
        user_id: {
            type: String,
        },
        createdAt: Date,
        updatedAt: Date
    },
    {
        collection: "photos",
    }
);

module.exports = model("Photo", photoSchema);
