import https from 'https';
let data = null;
let restaurantName = null;
let restaurantData = null;
let selectedRestaurantData = null;
export const handler = async (event) => {

  try {
    if (event && event['interpretations'] && event['interpretations'].length > 0) {
      const interpretations = event['interpretations'];
      let highestConfidence = -1;
      let selectedIntent = null;

      interpretations.forEach((interpretation) => {
        if (interpretation.intent && interpretation.nluConfidence > highestConfidence) {
          highestConfidence = interpretation.nluConfidence;
          selectedIntent = interpretation.intent.name;
        }
      });

      if (selectedIntent) {
        switch (selectedIntent) {
          case "initChat":
            const data = await fetchRestaurantData("https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getRestaurantData");
            restaurantData = data["body"];
            console.log("DATA::::", data["body"]);
            return handleInitIntent(selectedIntent);

          case "restaurantsList":
            console.log("restaurant intent called");
            console.log("restaurantsData", restaurantData);
            let restaurantList = [];
            for (const item of JSON.parse(restaurantData)) {
              restaurantList.push(item["name"]);
            }
            return handleRestaurantsList(restaurantList, selectedIntent);

          case "getRestaurantInfo":
            let selectedName = event['inputTranscript'].trim();
            console.log("getInfo called::::", selectedName, event);
            console.log("restaurantsData", restaurantData);
            for (const item of JSON.parse(restaurantData)) {
              if (item["name"] === selectedName) {
                selectedRestaurantData = item; // Fix variable name here
                break;
              }
            }
            console.log("SELECTED restaurant::::", selectedRestaurantData); // Fix variable name here
            return handleRestaurantInfo(selectedRestaurantData, selectedIntent);


          case "getLocation":
            console.log("location called");
            console.log("OPENING TIME FOR::::::", selectedRestaurantData["city"]);
            return handleViewLocationIntent(selectedRestaurantData["name"], selectedRestaurantData["city"], selectedIntent);

          case "openingTime":
            console.log("OPENING TIME FOR::::::", selectedRestaurantData["openingHours"]);
            return handleOpeningTimeIntent(selectedRestaurantData["name"], selectedRestaurantData["openingHours"], selectedIntent);

          case "menuAvailability":
            console.log("OPENING TIME FOR::::::", selectedRestaurantData["availability"]);
            return handleMenuAvailabilityIntent(selectedRestaurantData["name"], selectedRestaurantData["availability"], selectedIntent);

          case "reservationAvailability":
            console.log("OPENING TIME FOR::::::", selectedRestaurantData["availability"]);
            return handleReservationAvailabilityIntent(selectedRestaurantData["name"], selectedRestaurantData["availability"], selectedIntent);

          case "addRatingToResatuarant":
            let rating = event['inputTranscript'];
            console.log("...................", rating);
            selectedRestaurantData["rating"] = rating;
            postData(selectedRestaurantData, "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertRestaurantKeys");
            return handleAddRatingIntent(selectedRestaurantData["name"], rating, selectedIntent);

          case "provideReviewRestaurant":
            let review = event['inputTranscript'];
            console.log("...................", review);
            selectedRestaurantData["review"] = review;
            const reqBodyForFireStore = {
              "name": selectedRestaurantData["name"],
              "review": selectedRestaurantData["review"] + review
            };
            postData(reqBodyForFireStore, "https://tga492botb.execute-api.us-east-1.amazonaws.com/reviews");
            postData(selectedRestaurantData, "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertRestaurantKeys");
            return handleAddreviewIntent(selectedRestaurantData["name"], review, selectedIntent);

          default:
            return createUnknownIntentResponse();
        }
      }
    }

    // Handle other event types or default behavior

  } catch (err) {
    console.log(err);
    throw err;
  }
};

async function fetchDataFromAPI(apiUrl) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(apiUrl, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    req.end();
  });
}

async function postDataAPI(requestData, apiUrl) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(apiUrl, options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });

    // Send the request data in the request body
    req.write(JSON.stringify(requestData));

    // End the request
    req.end();
  });
}


async function fetchRestaurantData(apiUrl) {
  const data = await fetchDataFromAPI(apiUrl);
  const resturnDataObj = JSON.parse(data);
  return resturnDataObj;
}

async function postData(requestBody, apiUrl) {
  const data = await postDataAPI(requestBody, apiUrl);
}

function handleInitIntent(selectedIntent) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: "How may I help you?",
      },
    ],
  };
}

function handleRestaurantsList(restaurantList, selectedIntent) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: `Sure, Here are all the restaurants:\n${restaurantList.join('\n')}`,
      },
      {
        contentType: "PlainText",
        content: `To move further type "Restaurant information"`,
      },
    ],
  };
}


function handleRestaurantInfo(selectedRestaurantData, selectedIntent) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: `For what I can help you?`,
      },
    ],
  };
}

function handleViewLocationIntent(name, location, selectedIntent) {
  let restaurantLocation = location;
  let restaurantLocationMessage = `Location of ${name} is ${restaurantLocation}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: restaurantLocationMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function handleOpeningTimeIntent(name, time, selectedIntent) {
  let openingTime = time;
  let openingTimeMessage = `Opening time for ${name} is ${openingTime}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: openingTimeMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function handleMenuAvailabilityIntent(name, availability, selectedIntent) {
  let menu = "menu list";
  let menuMessage = `Menu of ${name} is ${availability}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: menuMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function handleReservationAvailabilityIntent(name, availability, selectedIntent) {
  let reservation = "reservation list";
  let reservationMessage = `Reservation of ${name} is ${availability}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: reservationMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function handleAddreviewIntent(name, review, selectedIntent) {
  let editedLocationMessage = `Review added for ${name} is ${review}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: editedLocationMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function handleAddRatingIntent(name, rating, selectedIntent) {
  let editedLocationMessage = `Rating added for ${name} is ${rating}`;
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: selectedIntent,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: editedLocationMessage,
      },
      {
        contentType: "PlainText",
        content: "Is there anything else I can help you with?",
      },
    ],
  };
}

function createUnknownIntentResponse() {
  return {
    // Your response for unknown or unsupported intents
  };
}
