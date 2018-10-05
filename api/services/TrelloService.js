const OAuth = require('oauth').OAuth;

module.exports = {

    getCards : (token, model) => {

        const url = `https://api.trello.com/1/cards/${model}`

        const oauth = new OAuth(
            sails.config.custom.trelloRequestURL, 
            sails.config.custom.trelloAccessURL, 
            process.env.TRELLO_KEY, 
            process.env.TRELLO_OAUTH_SECRET, 
            "1.0A", 
            sails.config.custom.trelloLoginCallback, 
            "HMAC-SHA1"
        );

        return new Promise((resolve, reject)=>{
            oauth.getProtectedResource(url, "GET", token.oauth.accessToken, token.oauth.accessTokenSecret, function(error, data, response){
                if (error) {
                    return reject(error);
                }else{
                    return resolve(data)
                }
            });
        })
    }

}