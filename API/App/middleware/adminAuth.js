const SuperUser = require('../models/Superuser');
const jwt = require('jsonwebtoken');

async function authenticateCreateAdmin(req, res, next) {
    try {
        if ((await SuperUser.find()).length === 0) {
            const token = req.header('Authorization').replace('Bearer ', '');
            if (token === `${process.env.SUPER_TOKEN_SIGN}`) {
                const admin = new SuperUser();
                req.newAdmin = admin;
                next();
            } else {
                throw new Error();
            }
        } else {
            await authenticateAdmin(req, res, () => {
                const admin = new SuperUser();
                req.newAdmin = admin;
                next();
            });
        }
    } catch (err) {
        res.status(401).send({ error: err });
    }
}
async function authCheckAdmin(req) {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, `${process.env.SIGN_TOKEN}`);
        const admin = await SuperUser.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!admin) {
            return false;
        }

        // eslint-disable-next-line require-atomic-updates
        req.token = token;
        // eslint-disable-next-line require-atomic-updates
        req.admin = admin;

        return true;
    } catch (err) {
        return false;
    }
}

async function authenticateAdmin(req, res, next) {
    if (await authCheckAdmin(req)) {
        next();
    } else {
        res.status(401).send({ error: 'Please authenticate as admin' });
    }
}

module.exports = {
    authenticateCreateAdmin,
    authenticateAdmin,
};