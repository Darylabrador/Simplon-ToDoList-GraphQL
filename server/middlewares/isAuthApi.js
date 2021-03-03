/**
 * Check if we can decode the JWT
 */

const dotenv = require('dotenv').config();
const jwt    = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // get Authorization header
    const authorizationHeader = req.get('Authorization');

    // check if we have the authorization Header
    if(!authorizationHeader) {
        return res.status(401).json({
            success: false,
            message: 'Action impossible',
        });
    }

    // Try to decode the token Bearer using the secret to know if it's authorized actions
    const token = authorizationHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: 'Action impossible',
        });
    }

    req.userId = decodedToken.userId;
    next();
}