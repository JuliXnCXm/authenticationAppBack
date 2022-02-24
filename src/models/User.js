const joi = require('joi');
const {Schema, model, Collection} = require('mongoose');

const UserSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().regex(new RegExp("^[a-zA-Z0-9]{8,32}$")).required(),
    name: joi.string().required(),
    lastname: joi.string(),
    provider: joi.string().required(),
    description: joi.string().optional().allow("").min(10).max(10),
    phone: joi.number().optional().allow("").min(10).max(10),
    createdAt: joi.date(),
    picture: joi.string(),
    updatedAt: joi.date(),
});

const createUser = new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    provider: {
        type: String,
    },
    description: {
        type: String,
    },
    phone: {
        type: Number,
    },
    picture: {
        type: String,
    },
    createdAt: Date.now(),
    updatedAt: Date.now()
}, {Collection: 'users'});

const User = model('User', createUser);

module.exports = {
    UserSchema,
    User
};