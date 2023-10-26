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

AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: process.env.aws_sns_region,
    sessionToken: process.env.aws_session_token
})

const sns = new AWS.SNS();

app.post('/subscribeForMenuUpdates', (req, res) => {

    /*
    cURL: 
    curl --location 'localhost:3000/subscribe' \
        --header 'Content-Type: application/json' \
        --data-raw '{ 
                "email": "aaron25rony@gmail.com"
                }'
    */

    /*
       Steps before using this api:
       1. Turn on "Stream Details" of the dynamodb menu table; Table > Exports and Streams tab
       2. Choose the "New and Old images" option
       3. Attach the lambda function which publishes the email notifications to the customers
       Note: The lambda function is already created and attached to the dynamodb table and code is available in the lambda/ folder
    */

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

/*
    install firebase-tools:
    > npm install -g firebase-tools

    login to firebase:
    firebase login

    initialize firebase:
    firebase init

    deploy firebase:
    firebase deploy
*/


/*
    *********** Firestore to Lambda trigger ***********
    This is the lambda function that is triggered when there is a new entry in the google cloud firestore database.
*/


// Reservation created
exports.OnReservationCreated = functions.firestore.
    document("reservations/{reservationId}").onCreate((snap, context) => {
      const name = snap._fieldsProto.name.stringValue;
      const date = snap._fieldsProto.date.stringValue;
      const time = snap._fieldsProto.time.stringValue;
    //   const anotherAttributeFromCreatenapshot = snap._fieldsProto.name.stringValue;

      const params = {
        Subject: name,
        Message: "Your reservation has been successfully created on " + date + " at " + time,
        TopicArn: "arn:aws:sns:us-east-1:315128346896:menu-item-update",
      };

      console.log("Sending message to SNS topic");
      sns.publish(params, (err, data) => {
        if (err) console.error(err);
        console.log(data);
      });
      console.log("Message sent to SNS topic");
    });


// Reservation updated

exports.OnReservationCreated = functions.firestore.
    document("reservations/{reservationId}").onUpdate((snap, context) => {
        // const name = snap.Change.after._fieldsProto.name.stringValue;

        const params = {
            Subject: "We have an update for you !!",
            Message: "There's a change in ------",
            TopicArn: "arn:aws:sns:us-east-1:315128346896:menu-item-update",
          };
    
          console.log("Sending message to SNS topic");
          sns.publish(params, (err, data) => {
            if (err) console.error(err);
            console.log(data);
          });
          console.log("Message sent to SNS topic");


    });

// Restaurant closed

exports.OnReservationCreated = functions.firestore.
    document("restaurant/{restaurantID}").onUpdate((snap, context) => {
        // const isOpen = snap.Change.after._fieldsProto.isOpen.stringValue;
        // const reason = snap.Change.after._fieldsProto.reason.stringValue;

        const params = {
            Subject: "Sorry, we are closed !!",
            Message: "We have to close the restaurant because of the ------",
            TopicArn: "arn:aws:sns:us-east-1:315128346896:menu-item-update",
          };
    
          console.log("Sending message to SNS topic");
          sns.publish(params, (err, data) => {
            if (err) console.error(err);
            console.log(data);
          });
          console.log("Message sent to SNS topic");
    });


