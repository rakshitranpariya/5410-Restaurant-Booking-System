const admin = require("firebase-admin");
const serviceAccount = require("./serverless.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
	 
	
    const collectionRef = db.collection("reservations");
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
      body: JSON.stringify(documents)
      
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      })
      
    };
  }
};