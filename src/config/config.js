require('dotenv').config()

const config = {
    port: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    url: process.env.DB_URL,
    dbName: process.env.DB_NAME,
    privateKey: process.env.PRIVATE_KEY,
};

module.exports = { config };