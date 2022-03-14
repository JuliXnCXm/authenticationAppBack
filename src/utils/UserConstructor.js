UserConstructor = (objUser, provider, hash) => {
    let userObj = {
        name: "",
        lastname: "",
        email: "",
        password: "",
        picture: "",
        provider: provider,
        description: "",
        phone: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    switch (provider) {
        case "google":
            userObj.name = objUser.name;
            userObj.lastname = objUser.family_name;
            userObj.email = objUser.email;
            userObj.picture = objUser.picture;
            break;
        case "facebook":
            userObj.name = objUser.name;
            userObj.email = objUser.email;
            userObj.picture = objUser.picture.data.url;
            break;

        case "twitter":
            userObj.name = objUser.name;
            userObj.lastname = objUser.username;
            userObj.email = `lorem@gmail.com`;
            userObj.description = objUser.description;
            userObj.picture = objUser.profile_image_url;
            break;

        case "github":
            userObj.name = objUser.name;
            userObj.lastname = objUser.login;
            userObj.email = objUser.email;
            userObj.description = objUser.bio;
            userObj.picture = objUser.avatar_url;
            break;

        case "local":
            userObj.name = objUser.name;
            userObj.lastname = objUser.lastname;
            userObj.email = objUser.email;
            userObj.picture = objUser.picture;
            userObj.password = hash;
            userObj.provider = objUser.provider;
            userObj.description = objUser.description;
            userObj.phone = objUser.phone;
            break;
    }
    return userObj;
};

module.exports = UserConstructor;
