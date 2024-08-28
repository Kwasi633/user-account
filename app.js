const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose")

const HttpError = require('./models/http-error')
const userRoutes = require('./routes/users-routes')

const app = express();

app.use(bodyParser.json())


app.use('/api/users/', userRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw error
})

app.use((error, req, res, next) => {
    if (res.headerSent){
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!'})
})

mongoose
    .connect('mongodb+srv://<username>:<password>6@cluster0.4epjd.mongodb.net/user-account?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        app.listen(5050)
    })
    .catch(err => {
        console.log(err)
});