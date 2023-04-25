const express = require('express');
const mongoose = require('mongoose');


const PORT = 3000;
const URL = 'mongodb://localhost:27017/moviebox';

const app = express(); /* инициализация создания приложения или сервера */
app.use(express.json()); /* регистрируем миддлвар для вытягивания параметров из body, чтобы добавлять данные */

mongoose
    .connect(URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.log(`DB connection error ${err}`))

 app.listen(PORT, (error) => {
            error ? console.log(error) : console.log(`Listening port ${PORT}`);
        })

let db;

const handleError = (res, error) => {
    res.status(500).json({ error })
}

app.get('/movies', (req, res) => {
    const movies = [];
    db
        .collection('movies')
        .find() /* но здесь в отличие от прогаммы, мы не получаем коллекции, мы получаем специальный объект курсор у которого есть ряд методов, например hasNext который показывает при переборе имеются ли еще там документы, метод next  извлекается текущий документ и перемещает курсос к следующему документу в наборе. также как альтернативу можно использовать для перебора метод forEach. также mongodb не запрашивет весь объем документоы, так как если их много то замедлит работу сайта, поэтому данные возвращаются так называемыми патчами,то есть пакетами или крупами. значение по умолчанию такого патча - 101 документ. но на практике даже такое количество ограничивают пагинацей по 20-50 элементов*/
        .sort({ title: 1 })
        .forEach((movie) => movies.push(movie))
        .then(() => {
            res
                .status(200)
                .json(movies)
        })
        .catch(() => handleError(res, 'Something goes wrong..'))
})


app.get('/movies/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db
            .collection('movies')
            .findOne({ _id: ObjectId(req.params.id) })
            .then((doc) => {
                res
                    .status(200)
                    .json(doc)
            })
            .catch(() => handleError(res, 'Something goes wrong...'))

    } else {
        handleError(res, 'Wrong id...')
    }


})

/* удаление документа */

app.delete('/movies/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db
            .collection('movies')
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                res
                    .status(200)
                    .json(result)
            })
            .catch(() => handleError(res, 'Something goes wrong...'))

    } else {
        handleError(res, 'Wrong id...')

    }
})

app.post('/movies', (req, res) => {
    db
        .collection('movies')
        .insertOne(req.body)
        .then((result) => {
            res
                .status(200)
                .json(result)
        })
        .catch(() => handleError(res, 'Something goes wrong...'))
})


app.patch('/movies/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db
            .collection('movies')
            .updateOne({ _id: ObjectId(req.params.id) }, { $set: req.body })
            .then((result) => {
                res
                    .status(200)
                    .json(result)
            })
            .catch(() => handleError(res, 'Something goes wrong...'))

    } else {
        handleError(res, 'Wrong id...')

    }
})

