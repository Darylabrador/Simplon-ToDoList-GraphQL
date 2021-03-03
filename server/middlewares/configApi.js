/**
 * Set headers API config
 */
module.exports = (req, res, next) => {

    // Set cors configurations
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Do not forget options that's appear first, that can break the request if it's not here
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
}