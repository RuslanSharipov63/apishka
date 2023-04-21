const express = require('express');
const { connectToDb, getDb } = require('./db');

const PORT = 3000;

const app = express(); /* инициализация создания приложения или сервера */

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(PORT, (error) => {
            error ? console.log(error) : console.log(`Listening port ${PORT}`);
        })
        db = getDb();
    } else {
        console.log(`DB connection error ${err}`)
    }
})