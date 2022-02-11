const { localStorage } = require('../storage/LocalStorage');

const addAuthorizationHeader = function(req){

    const accessToken = localStorage.getItem('accessToken');
    if(typeof accessToken === undefined || accessToken === null)
        return req;
    
    req.headers.authorization = accessToken;

    return req;
}

module.exports = {
    addAuthorizationHeader
}