/**
 * Check if we can decode the JWT
 */

const dotenv = require('dotenv').config();
const jwt    = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // get Authorization header
    const authorizationHeader = req.get('Authorization');

    // check if we have the authorization Header
    if (!authorizationHeader) {
        req.isAuth = false;
        return next();
    }

    const token = authorizationHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        req.isAuth = false;
        return next();
    }

    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}