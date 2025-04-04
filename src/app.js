const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));


app.use('/user', userRoutes);


module.exports = app;
