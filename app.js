const express = require('express');
const path = require('path');
const cors = require('cors');
const createError = require('http-errors');
const morgan = require('morgan');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();
const prisma = new PrismaClient();

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/img", express.static(__dirname + '/static/img'));
app.use("/node_modules", express.static(__dirname + '/node_modules'));
app.use("/components", express.static(__dirname + '/static/components'));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
    res.sendFile('./static/app.html', { root: __dirname });
});

app.use('/api', require('./routes/order.js'));
app.use('/api', require('./routes/asset.js'));
app.use('/', require('./routes/login.js'));

app.use((req, res, next) => {
    next(createError.NotFound());
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status || 500,
        msg: err.message
    });
});



(async () => {
    const assetsList = [
        {name: 'Продукты/Еда', category: 'Продукты/Еда'},
        {name: 'Ящики для бутылок/Напитки', category: 'Ящики для бутылок/Напитки'},
        {name: 'Оборудование/Материалы', category: 'Оборудование/Материалы'},
        {name: 'Мебель', category: 'Мебель'},
        {name: 'Почта и посылки', category: 'Почта и посылки'},
        {name: 'Книги и документы', category: 'Книги и документы'},
    ];

    assetsList.forEach(async (asset) => {
        let assetRow = {name: asset.name, category: asset.category};

        await prisma.asset.upsert({
            where: { name: asset.name },
            update: assetRow,
            create: assetRow,
        });
    })
})()



app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`);
});