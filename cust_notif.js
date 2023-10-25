const express = require('express');
require('dotenv').config();
const app = express();
const AWS = require('aws-sdk');
const port = 3000;

app.use(express.json())

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/subscribeForMenuUpdates', (req, res) => {

    /*
    cURL: 
    curl --location 'localhost:3000/subscribe' \
        --header 'Content-Type: application/json' \
        --data-raw '{ 
                "email": "aaron25rony@gmail.com"
                }'
    */

    AWS.config.update({
        accessKeyId: process.env.aws_access_key_id,
        secretAccessKey: process.env.aws_secret_access_key,
        region: process.env.aws_sns_region,
        sessionToken: process.env.aws_session_token
    })

    const sns = new AWS.SNS();

    const params = {
        Protocol: 'email',
        TopicArn: process.env.aws_sns_menu_item_update_topic_arn,
        Endpoint: req.body.email
    }

    sns.subscribe(params, (err, data) => {
        if (err) console.error(err);
        res.send(data);
    });

});