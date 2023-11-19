import https from 'https';

export const handler = async (event) => {
  let data = null;
  let restaurantName = null;
  try {
    console.log("Received event:");
    console.log(JSON.stringify(event, null, 2));

    // Ensure that there are interpretations in the event.
    if (event && event['interpretations'] && event['interpretations'].length > 0) {
      const interpretations = event['interpretations'];

      // Initialize variables to track the intent with the highest confidence.
      let highestConfidence = -1;
      let selectedIntent = null;

      // Iterate through interpretations to find the intent with the highest nluConfidence.
      interpretations.forEach((interpretation) => {
        if (interpretation.intent && interpretation.nluConfidence > highestConfidence) {
          highestConfidence = interpretation.nluConfidence;
          selectedIntent = interpretation.intent.name;
        }
      });

      if (selectedIntent) {
        console.log(selectedIntent);
        switch (selectedIntent) {
          case "inintChat":
            const responseMessage = `How can I assist you?`;
            return createGetRestaurantInfoResponse(selectedIntent, responseMessage, null);

          // Handle the "GetAllRestaurants" intent
          case "restaurantsList":

            const apiUrl = 'https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/restaurantlist';

            const response = await fetchDataFromAPI(apiUrl);
            data = JSON.parse(response);
            const restaurantsList = [];
            for (const item of data) {
              if (item.name) {
                restaurantsList.push(item.name);
              }
            }

            return createRestaurantsListResponse(selectedIntent, restaurantsList, data, true);

          // Handle the "getRestaurantInfo" intent  
          case "getRestaurantInfo":
            console.log("-------------------------------GET INFO INVOKED");
            const restaurantName = event.inputTranscript; // Use the user's input text
            console.log("restaurantName>>>>", restaurantName);
            if (restaurantName) {
              let selectedRestaurant = null;
              for (const item of data) {
                if (item.name && item.name.toLowerCase() === restaurantName.toLowerCase()) {
                  selectedRestaurant = item.name;
                  break; // Exit the loop when a matching restaurant is found
                }
              }

              if (selectedRestaurant) {
                const responseMessage = `What information do you need for ${restaurantName}`;
                return createGetRestaurantInfoResponse(selectedIntent, responseMessage, data);
              } else {
                // Handle the case where the restaurant was not found
                return createGetRestaurantInfoResponse(
                  selectedIntent,
                  "I couldn't find information for that restaurant.",
                  data
                );
              }
            }

          case "getLocation":

            let location = null;
            for (const item of data) {
              if (item.name && item.name.toLowerCase() === restaurantName.toLowerCase()) {
                location = item.city;
                break; // Exit the loop when a matching restaurant is found
              }
            }

            if (location) {
              const responseMessage = `The location for ${restaurantName} is in ${location}.`;
              return createGetRestaurantInfoResponse(selectedIntent, responseMessage, data);
            } else {
              // Handle the case where the restaurant was not found
              return createGetRestaurantInfoResponse(
                selectedIntent,
                "I couldn't find the location for that restaurant.",
                data
              );
            }
          default:
            // Handle unknown or unsupported intents
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
  return new Promise((resolve, reject) => {
    https.get(apiUrl, (response) => {
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
  });
}

function createRestaurantsListResponse(intentName, restaurantsList, data, invokeAnotherIntent) {
  const messages = [
    {
      contentType: "PlainText",
      content: "Sure, Here are all the restaurants:\n" + restaurantsList,
    },
  ];

  if (invokeAnotherIntent) {
    // If you want to invoke another intent, add it to the messages array
    messages.push({
      contentType: "PlainText",
      content: "For what can I help you?"
    });

    // Add the name of the intent you want to invoke
    intentName = "getRestaurantInfo"; // Replace with the actual intent name
  }

  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: intentName, // This will set the intent to the one you want to invoke
        state: "Fulfilled",
      },
    },
    messages,
    data,
  };
}

function createGetRestaurantInfoResponse(intentName, responseMessage, data) {
  return {
    sessionState: {
      dialogAction: {
        type: "Close",
        fulfillmentState: "Fulfilled",
      },
      intent: {
        confirmationState: "Confirmed",
        name: intentName,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: responseMessage,
      }
    ],
    data: data,
  };
}

function createUnknownIntentResponse() {
  return {
    // Your response for unknown or unsupported intents
  };
}
