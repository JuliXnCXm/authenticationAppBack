const scopesArray = {
  github: ["user"],
  google: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
  twitter: ["users.read"],
  facebook: [""],
};

module.exports = scopesArray;