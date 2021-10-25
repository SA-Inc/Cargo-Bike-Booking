const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();

const prisma = new PrismaClient();



function differenceBetweenTwoDateHoursMinutes(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    let diffInMilliSeconds = Math.abs(date2 - date1) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    return [days, hours, minutes];
}

function renamePlace(place) {
    if (place == 'Pushkin') {
        return 'Корпус на Пушкина';
    }

    if (place == 'Furmanov') {
        return 'Корпус на Фурманова';
    }
}

function renameStatus(status) {
    switch(status) {
        case 'created':
            return 'Создан';
        case 'prepare':
            return 'В подготовке';
        case 'process':
            return 'В пути';
        case 'delivered':
            return 'Доставлен';
        case 'canceled':
            return 'Отменен';
      }
}

async function sendOrderMail(email, orderData, assetsList) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    let assetsListMsg = '';

    assetsList.forEach((asset) => {
        assetsListMsg += `${asset.asset.name} - ${asset.count} ед.\n`
    });

    const msg = `Здравствуйте. Спасибо за использование системы Cargo Bike. Ваши данные поездки доступны ниже:\n\nID поездки: ${orderData.id}\nСтатус: ${renameStatus(orderData.status)}\nИз: ${renamePlace(orderData.from)}\nВ: ${renamePlace(orderData.to)}\nДата начала: ${orderData.start_time}\nОжидаемое время в часах: ${orderData.expected_duration}\n\nСписок предметов:\n${assetsListMsg}`
    
    let info = await transporter.sendMail({
        from: 'LogCentre@dku.kz',
        to: email,
        subject: `Поездка ${orderData.id} - ${renameStatus(orderData.status)}`,
        text: msg,
    });
}

router.get('/order', async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
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

router.get('/order/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await prisma.order.findUnique({
            where: {
                id: Number(id)
            }
        });
        const orderAssets = await prisma.orderAsset.findMany({
            where: {
                order_id: Number(id)
            }
        });

        res.json({'booking_info': order, 'assets_list': orderAssets});
    } catch (error) {
        next(error);
    }
});

router.get('/check_order/:id/:email', async (req, res, next) => {
    try {
        const id = req.params.id;
        const email = req.params.email;

        const order = await prisma.order.findUnique({
            where: {
                id: Number(id)
            }
        });

        const orderAssets = await prisma.orderAsset.findMany({
            where: {
                order_id: Number(id)
            }
        });

        if (order == null || "email" in order == false || "id" in order == false || order.email === null || order.id === null) {
            res.status(404).send({ 'msg': "not_found" });
        } else if (order.email === email && order.id === Number(id)) {
            res.json({'booking_info': order, 'assets_list': orderAssets});
        } else {
            res.status(400).send({ 'msg': "not_found" });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.post('/order', async (req, res, next) => {
    try {
        let assetIdArray = [];

        const order = await prisma.order.create({
            data: req.body.booking_info,
        });

        for (const asset in req.body.assets_list) {
            let orderAssetRow = {order_id: parseInt(order.id), asset_id: parseInt(asset), count: parseInt(req.body.assets_list[asset])};
            assetIdArray.push(parseInt(asset));

            await prisma.orderAsset.create({
                data: orderAssetRow,
            });
        }

        const orderAssets = await prisma.orderAsset.findMany({
            where: {
                order_id: order.id
            },
            include: {
                asset: true,
            },
        });

        sendOrderMail(order.email, order, orderAssets);

        res.json(order);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.put('/order/:id', async (req, res, next) => {

    if (req.body.status == 'delivered') {
        req.body.actual_duration = differenceBetweenTwoDateHoursMinutes(req.body.end_time, req.body.start_time)[1];
    } else {
        req.body.actual_duration = null;
    }

    try {
        const id = req.params.id;

        const oldOrderState = await prisma.order.findUnique({
            where: {
                id: Number(id)
            }
        });

        const order = await prisma.order.update({
            where: {
                id: Number(id)
            },
            data: req.body
        });

        const orderAssets = await prisma.orderAsset.findMany({
            where: {
                order_id: order.id
            },
            include: {
                asset: true,
            },
        });

        if (oldOrderState.status != order.status) {
            sendOrderMail(order.email, order, orderAssets);
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
});

router.delete('/order/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        await prisma.orderAsset.deleteMany({
            where: {
                order_id: Number(id)
            }
        });

        const order = await prisma.order.delete({
            where: {
                id: Number(id)
            }
        });

        res.json(order);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.put('/order_feedback/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await prisma.order.update({
            where: {
                id: Number(id)
            },
            data: {
                star_rating: req.body.star_rating,
                feedback: req.body.feedback,
            },
        });
        res.json(order);
    } catch (error) {
        next(error);
    }
});



module.exports = router;