const router = require('express').Router();
const { json } = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post('/login', async (req, res, next) => {
    const adminUsername = 'admin';
    const adminPassword = 'admpwd';
    const secretKey = "secret";

    if (req.body.login == adminUsername && req.body.password == adminPassword) {
        const token = jwt.sign(
            {
                username: adminUsername,
            },
            secretKey,
            {
                expiresIn: '7d'
            }
        );

        const lastSession = await prisma.session.upsert({
            where: { token: token },
            update: { token: token, last_login: new Date() },
            create: { token: token, last_login: new Date() },
        });

        res.status(200).send({ 'msg': "login", "token": token });
    } else {
        res.status(401).send({ 'msg': "invalid_credentials" });
    }
});

module.exports = {
    verifyToken: (req, res, next) => {
        try {
            const token = req.body.token;
            const decoded = jwt.verify(
                token,
                secretKey
            );
            // req.userData = decoded;

            next();
        } catch (err) {
            return res.status(401).send({ 'msg': "invalid_credentials" });
        }
    }
}

module.exports = router;