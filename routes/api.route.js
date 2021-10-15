const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { json } = require('express');
const nodemailer = require("nodemailer");

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

function sendOrderMail(email, orderData, assetsList) {
    console.log(assetsList)
    const msg = `
    ID поездки: ${orderData.id}
    Статус: ${orderData.status}
    Из: ${orderData.from}
    В: ${orderData.to}
    Дата начала: ${orderData.start_time}
    Ожидаемое время в часах: ${orderData.expected_duration}

    Список предметов:
    ${assetsList}
    `
    console.log(msg)
    return true;
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

        console.log(order)

        if (order == null || "email" in order == false || "id" in order == false || order.email === null || order.id === null) {
            res.status(404).send({ 'msg': ":(" });
        } else if (order.email === email && order.id === Number(id)) {
            res.json({'booking_info': order, 'assets_list': orderAssets});
        } else {
            res.status(400).send({ 'msg': ":(" });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.post('/order', async (req, res, next) => {
    try {
        console.log(req.body)
        const order = await prisma.order.create({
            data: req.body.booking_info,
        });

        for (const asset in req.body.assets_list) {
            let orderAssetRow = {order_id: parseInt(order.id), asset_id: parseInt(asset), count: parseInt(req.body.assets_list[asset])};
            
            await prisma.orderAsset.create({
                data: orderAssetRow,
            });
        }
        sendOrderMail(order.email, order, req.body.assets_list);
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
        const order = await prisma.order.update({
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



// router.get('/user', async (req, res, next) => {
//     try {
//         const users = await prisma.user.findMany({});
//         res.json(users);
//     } catch (error) {
//         next(error);
//     }
// });

// router.get('/user/:id', async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const user = await prisma.user.findUnique({
//             where: {
//                 id: Number(id)
//             }
//         });
//         res.json(user);
//     } catch (error) {
//         next(error);
//     }
// });

// router.post('/user', async (req, res, next) => {
//     try {
//         const user = await prisma.user.create({
//             data: req.body,
//         });
//         res.json(user);
//     } catch (error) {
//         next(error);
//     }
// });

// router.put('/user/:id', async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const user = await prisma.user.update({
//             where: {
//                 id: Number(id)
//             },
//             data: req.body
//         });
//         res.json(user);
//     } catch (error) {
//         next(error);
//     }
// });

// router.delete('/user/:id', async (req, res, next) => {
//     try {
//         const id = req.params.id;
//         const user = await prisma.user.delete({
//             where: {
//                 id: Number(id)
//             }
//         });
//         res.json(user);
//     } catch (error) {
//         next(error);
//     }
// });



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