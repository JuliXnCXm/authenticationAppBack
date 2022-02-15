const scopesArray = require("../utils/scopesArray");
const { config } = require("../config/config");
const generateRandomString = require("../utils/generateRandomString");

const OauthOptions = {
    exchangeOptions: {
        github: {
            options: {
                url: "https://api.github.com/user",
                token_type: "token",
                headers: {
                "user-agent": "node.js",
                },
                json: true,
            },
        },
        google: {
            options: {
                url: "https://www.googleapis.com/oauth2/v2/userinfo",
                token_type: "Bearer",
                headers: {
                "user-agent": "node.js",
                },
                json: true,
            },
        },
        twitter: {
            options: {
                url: "https://api.twitter.com/2/users/me",
                token_type: "Bearer",
                headers: {
                "user-agent": "node.js",
                },
                json: true,
            },
        },
        facebook: {
            options: {
                url: "https://api.github.com/user",
                token_type: "token",
                headers: {
                "user-agent": "node.js",
                },
                json: true,
            },
        },
    },
    queryAuth: {
        github: {
            url: "https://github.com/login/oauth/access_token?",
            queryAuthOptions: {
                client_id: config.githubClientId,
                client_secret: config.githubClientSecret,
                redirect_uri: config.githubClientUri,
            },
        },
        google: {
            url: "https://oauth2.googleapis.com/token?",
            queryAuthOptions: {
                client_id: config.googleClientId,
                client_secret: config.googleClientSecret,
                redirect_uri: config.googleClientUri,
                grant_type: "authorization_code",
            },
        },
        twitter: {
            url: "https://graph.facebook.com/v13.0/oauth/access_token?",
            queryAuthOptions: {
                client_id: config.twitterClientId,
                client_secret: config.twitterClientSecret,
                redirect_uri: config.twitterClientUri,
                grant_type: "authorization_code",
            },
        },
        facebook: {
        url: "https://graph.facebook.com/v13.0/oauth/access_token?",
        queryAuthOptions: {
            client_id: config.facebookClientId,
            client_secret: config.facebookClientSecret,
            redirect_uri: config.facebookClientSecret,
            grant_type: "authorization_code",
        },
        },
    },
    queryStrings: {
        github: {
            url: "https://github.com/login/oauth/authorize?",
            params: {
                response_type: "code",
                client_id: config.githubClientId,
                scope: scopesArray.github.join(" "),
                redirect_uri: config.githubClientUri,
                state: generateRandomString(16),
            },
        },
        google: {
            url: "https://accounts.google.com/o/oauth2/v2/auth?",
            params: {
                response_type: "code",
                client_id: config.googleClientId,
                scope: scopesArray.google.join(" "),
                redirect_uri: config.googleClientUri,
                state: generateRandomString(16),
                prompt: "consent",
            },
        },
        twitter: {
            url: "https://twitter.com/i/oauth2/authorize?",
            params: {
                response_type: "code",
                client_id: config.twitterClientId,
                scope: scopesArray.twitter.join(" "),
                redirect_uri: config.twitterClientUri,
                state: generateRandomString(16),
                code_challenge: generateRandomString(128),
                code_challenge_method: "plain",
            },
        },
        facebook: {
            url: "https://www.facebook.com/v13.0/dialog/oauth?",
            params: {
                response_type: "code",
                client_id: config.facebookClientId,
                scope: scopesArray.facebook.join(" "),
                redirect_uri: config.facebookClientUri,
                state: generateRandomString(16),
            },
        },
    },
};


https: module.exports = { OauthOptions };