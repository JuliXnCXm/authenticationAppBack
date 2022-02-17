const scopesArray = {
  github: ["user"],
  google: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
  twitter: ["users.read", "tweet.read"],
  facebook: ["public_profile", "email"],
};

module.exports = scopesArray;