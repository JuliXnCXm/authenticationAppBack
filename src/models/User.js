const joi = require('joi');
const {Schema, model, Collection} = require('mongoose');

const UserSchema = joi.object().keys({
  email: joi.string().email().required(),
  password: joi
    .string()
    .regex(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/))
    .required(),
  name: joi.string().required(),
  lastname: joi.string(),
  provider: joi.string().required(),
  description: joi.string(),
  phone: joi.number(),
  createdAt: joi.date().required(),
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
    createdAt: Date,
    updatedAt: Date
}, {Collection: 'users'});

const User = model('User', createUser);

module.exports = {
    UserSchema,
    User
};