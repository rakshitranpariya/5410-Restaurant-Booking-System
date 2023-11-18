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
          message: "Params missing",
        })
       
      };
    }
	
	const docIdCheck = event.pathParameters;
	 
    if (!docIdCheck) {
      return {
        statusCode: 400,
		headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "Body is missing in the parameters",
        })
      };
    }

const docId = event.pathParameters.id;
    

    // Parse the request body as JSON
    let updatedData;
    try {
      updatedData = event.body;
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

    // Perform the Firestore update operation
    await db.collection("reservations").doc(docId).update(updatedData);

    const response = {
      statusCode: 200,
	  headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        },
      body: JSON.stringify({ message: "Document updated successfully" })
    };

    return response;
  } catch (error) {
    console.error("Error updating document:", error);

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
