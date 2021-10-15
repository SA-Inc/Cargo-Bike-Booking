const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const nodemailer = require("nodemailer");

const prisma = new PrismaClient();

router.get('/asset', async (req, res, next) => {
    try {
        const orders = await prisma.asset.findMany({
            orderBy: [
                {
                  id: 'desc',
                }
            ],
        });
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

router.get('/asset/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await prisma.asset.findUnique({
            where: {
                id: Number(id)
            }
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.post('/asset', async (req, res, next) => {
    try {
        const order = await prisma.asset.create({
            data: req.body,
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.put('/asset/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await prisma.asset.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.delete('/asset/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await prisma.asset.delete({
            where: {
                id: Number(id)
            }
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
});



module.exports = router;