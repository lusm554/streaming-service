const app = require('express')();
const config = require('config')
const bodyParser = require('body-parser')

app.get('/', (req, res) => {
    res.send('Hi')
})

app.listen(config.get('port'))