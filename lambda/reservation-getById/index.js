const admin = require("firebase-admin");
const serviceAccount = require("./serverless.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    // Check if a valid document ID is provided in the path parameters
    const bodyCheck = event.body;
    if (!bodyCheck) {
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Params are missing ",
		  events: event,
		  dataBody: event.body,
		  dataBodyParse: JSON.parse(event.body) 
        })
      };
    }
	
	const docId = JSON.parse(event.body).pathParameters.id;
    if (!docId) {
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Document ID is missing in the path parameters",
        })
      };
    }

    // Retrieve the document from Firestore
    const doc = await db.collection("reservations").doc(docId).get();

    // Check if the document exists
    if (doc.exists) {
      return {
        statusCode: 200,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify(doc.data())
      };
    } else {
      return {
        statusCode: 404,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({ error: "Document not found" })
      };
    }
  } catch (error) {
    console.error("Error retrieving document:", error);

    return {
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
  }
};
