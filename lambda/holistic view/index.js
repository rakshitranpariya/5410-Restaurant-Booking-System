const admin = require("firebase-admin");
const serviceAccount = require("./serverless.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {

    // if (event.httpMethod === 'OPTIONS') {
    //   // Handling OPTIONS request for CORS
    //   return {
    //     statusCode: 200,
    //     // headers: {
    //     //   'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    //     //   'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your React app's domain during development
    //     //   'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE', // Adjust with the allowed methods in your API
    //     //   'Content-Type': 'application/json',
    //     // },
    //     body: JSON.stringify({ message: 'OPTIONS request handled' }),
    //   };
    // }

    // Check if the request body is empty
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Request body is empty",
        })
      };
    }

    // Parse the request body as JSON
    let data;
    try {
      data = event?.body;
    } catch (parseError) {
      // console.error("Error parsing JSON:", parseError);
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Invalid JSON format in the request body",
        })
      };
    }

    // Validate the parsed data (e.g., check required fields)
    if (!data?.restaurantid) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Missing required fields in the request body +" + data,
        })
      };
    }



    if (data?.selectedYears) {
      const collectionRef = db.collection("reservations")
        .where("restaurantid", "==", data.restaurantid)
        .where("reservationDate", ">=", `${data.selectedYears}-01-01`)
        .where("reservationDate", "<=", `${data.selectedYears}-12-31`)

      const snapshot = await collectionRef.get();

      const documents = [];

      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: {
          outdata: documents
        }

      };

    }

    else if (data?.selectedDate) {
      const collectionRef = db.collection("reservations")
        .where("restaurantid", "==", data.restaurantid)
        .where("reservationDate", "==", `${data.selectedDate}`)

      const snapshot = await collectionRef.get();

      const documents = [];

      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: {
          outdata: documents
        }

      };

    } else if (data?.startDate && data?.endDate) {
      const collectionRef = db.collection("reservations")
        .where("restaurantid", "==", data.restaurantid)
        .where("reservationDate", ">=", `${data.startDate}`)
        .where("reservationDate", "<=", `${data.endDate}`)

      const snapshot = await collectionRef.get();

      const documents = [];

      snapshot.forEach((doc) => {
        documents.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: {
          outdata: documents
        }

      };
    }

    else {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Missing required fields in the request body",
        })
      };
    }





  } catch (error) {
    // console.error("Error creating document:", error);

    const errorResponse = {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      })
    };

    return errorResponse;
  }
};
