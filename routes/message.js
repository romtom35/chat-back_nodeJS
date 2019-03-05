var express = require('express');
var router = express.Router();
const Message = require('../models/Message')

router.post('/', function (req, res, next) {
    const message = new Message(req.body);
    message.save().then(msg => res.json(msg))
});

router.get('/', (req, res) => {
    console.log('ok')
    Message.find()
        .then(messages => res.json(messages))
        .catch(err => console.log(err));
});

module.exports = router;


