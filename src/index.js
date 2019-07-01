const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.use('/api/movies', require('./routes/movies'));
app.use('/api/directors', require('./routes/director'));
app.listen(3000, () => console.log('Server Starting....'));
