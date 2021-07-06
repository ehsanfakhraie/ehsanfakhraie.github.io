const express = require('express');

const SuperUser = require('../models/Superuser');

const {
    authenticateCreateAdmin,
    authenticateAdmin
} = require('../middleware/adminAuth');


const router = new express.Router();


router.post('/', authenticateCreateAdmin, async (req, res) => {
    try {
        req.newAdmin.username = req.body.username;
        req.newAdmin.password = req.body.password;
        await req.newAdmin.save();
        const token = await req.newAdmin.generateAuthToken();
        res.status(201).send({ admin: req.newAdmin, token });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const admin = await SuperUser.findByCredentials(req.body.username, req.body.password);
        const token = await admin.generateAuthToken();
        res.send({ admin, token });
    } catch (err) {
        res.status(401).send({ error: err.message });
    }
});

router.post('/logout', authenticateAdmin, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => token.token !== req.token);
        await req.admin.save();

        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/logoutall', authenticateAdmin, async (req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save();

        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
