//load express module                               
const express = require("express");
const path = require('path');
var bodyParser = require('body-parser')
const { } = require('./controller.js');
const stripe = require('stripe')('sk_test_51GsRqCHBOqdNhpQrAJFlmes90OIjvVtNHlxPZNXOoeAeZlhS7BfxKEgcgGcjKFD1deYZJ7PGPybicAeEEtLnJSBb00VOmeCP2z');

//call function loaded to "express" variable to get express object
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/stripe', (req, res) => {
    console.log(req.body);
    const stripeToken = req.body.stoken;
    const price = req.body.amount;
    const priceInPence = price * 100;
    stripe.charges.create({
        amount: priceInPence,
        currency: req.body.currency,
        source: stripeToken,
        capture: false,
    }).then( response => {
        if (response.status == 'succeeded') {
            stripe.charges.capture(response.id).then(result => {
                if (result.status == 'succeeded' && (result.captured == true || result.captured == 'true')) {
                    res.send({
                        status: 200,
                        message: 'Payment captured successfully',
                        trn: result.id
                    })
                    return true;
                } else {
                    res.send ({
                        status: 400,
                        message: 'Failed to capture payment'
                    })
                    return true;
                }
            }).catch(err => {
                console.log(err)
                res.send(err)
                return true
            })
        } else {
            res.send({
                status: 400,
                message: 'Failed to capture'
            });
            return true
        }
    }).catch(error => {
        console.log(error);
        res.send(error);
        return true;
    });
})

//assign port number
app.listen(3000, () => {
    console.log("server starting on port 3000");
})


