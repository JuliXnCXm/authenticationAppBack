require('dotenv').config()

const config = {
  port: process.env.PORT || 3000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  url: process.env.DB_URL,
  dbName: process.env.DB_NAME,
  privateKey: process.env.PRIVATE_KEY,
  clientSideUrl: process.env.CLIENT_SIDE_URL,
  //GITHUB
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubClientUri: process.env.GITHUB_CLIENT_URI,
  //GOOGLE
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleClientUri: process.env.GOOGLE_CLIENT_URI,
  //FACEBOOK
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  facebookClientUri: process.env.FACEBOOK_CLIENT_URI,
  //TWITTER
  twitterClientId: process.env.TWITTER_CLIENT_ID,
  twitterClientSecret: process.env.TWITTER_CLIENT_SECRET,
  twitterClientUri: process.env.TWITTER_CLIENT_URI,
  twitterApiKey: process.env.TWITTER_API_KEY,
  twitterApiSecret: process.env.TWITTER_API_SECRET,
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
};

module.exports = { config };