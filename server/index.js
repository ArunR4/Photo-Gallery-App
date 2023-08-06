const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const { json } = require('body-parser');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(json());

const { parsed: config } = dotenv.config();

const BASE_URL = `https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}`;
const auth = {
    username: config.API_KEY,
    password: config.API_SECRET
}

app.get('/photos', (req, res) => {
    axios.get(BASE_URL + '/resources/image', {
        auth,
        params: {
            next_cursor: req.query.next_cursor
        }
    }).then(r => res.send(r.data))
});

app.get('/search', (req, res) => {
    axios.get(BASE_URL + '/resources/search', {
        auth,
        params: {
            expression: req.query.expression
        }
    }).then(r => res.send(r.data))
});

const PORT = 5000;

app.listen(PORT, console.log('Server running on', PORT))