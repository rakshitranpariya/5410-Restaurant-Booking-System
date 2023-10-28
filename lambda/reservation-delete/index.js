const admin = require("firebase-admin");
const serviceAccount = require("./serverless.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event, context) => {
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
          message: "Document ID is missing in the path parameters",
        })
      };
    }
	
	const docId = JSON.parse(event.body).pathParameters.id;

    // Check if the document with the provided ID exists before attempting to delete it
    const docSnapshot = await db.collection("reservations").doc(docId).get();
    if (!docSnapshot.exists) {
      return {
        statusCode: 404,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Not Found",
          message: "Document not found",
        })
      };
    }

    // Perform the Firestore delete operation
    await db.collection("reservations").doc(docId).delete();

    const response = {
      statusCode: 200,
	  headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
      body: JSON.stringify({ message: "Document deleted successfully" })
    };

    return response;
  } catch (error) {
    console.error("Error deleting document:", error);

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
