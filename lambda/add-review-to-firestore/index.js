import { admin, db } from './firebaseConfig.mjs';

console.log("admin", admin);
console.log("db", db);

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  let dbResponse;
  const headers = {
    "Content-Type": "application/json",
  };

  console.log("event", event);

  try {
    switch (event.routeKey) {
      case "GET /reviews":
        // Handle GET /reviews
        break;

      case "PUT /reviews":
        // Handle PUT /reviews
        handlePutReviews(event, db);
        break;

      default:
        throw new Error(`Internal Server Error`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};

const handlePutReviews = async (event, db) => {
  const req = JSON.parse(event.body);
  console.log("req", req);

  const item = {
    name: req?.name,
    review: req?.review,
  };

  try {
    const response = await db.collection('reviews').add(item);
    console.log("firestore response", response);
    body = `Review with ${req?.name} added successfully`;
  } catch (err) {
    console.log(err);
    throw new Error(`Failed to add review: ${err.message}`);
  }
};
