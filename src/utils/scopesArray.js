const scopesArray = {
  github: ["user"],
  google: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
  twitter: ["tweet.read", "users.read"],
  facebook: ["public_profile"],
};

module.exports = scopesArray;