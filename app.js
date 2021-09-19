const express = require('express');
const path = require('path');
const cors = require('cors');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use("/js", express.static(__dirname + '/static/js'));
app.use("/css", express.static(__dirname + '/static/css'));
app.use("/components", express.static(__dirname + '/static/components'));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
    res.sendFile('./static/app.html', { root: __dirname });
});

app.use('/api', require('./routes/api.route'));

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

app.listen(PORT, () => {
    console.log(`Started at http://localhost:${PORT}`);
});