const admin = require("firebase-admin");
const serviceAccount = require("./serverless.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    // Check if the request body is empty
    if (!event) {
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
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
      data = (event);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
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
    if (!data.customerName || !data.reservationDate || !data.reservationTime) {
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Missing required fields in the request body",
        })
      };
    }

    // Perform the Firestore operation
    const docRef = await db.collection("reservations").add(data);

    const response = {
      statusCode: 200,
	  headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
      body: JSON.stringify({
        message: "Document created successfully",
        id: docRef.id,
      })
    };

    return response;
  } catch (error) {
    console.error("Error creating document:", error);

    const errorResponse = {
      statusCode: 500,
	  headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
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
