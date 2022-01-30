const joi = require('joi');
const {Schema, model, Collection} = require('mongoose');

const UserSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi
    .string()
    .regex(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$'))
    .required(),
});

const createUser = new Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    createdAt: Date
}, {Collection: 'users'});

const User = model('User', createUser);

module.exports =
{   UserSchema,
    User};