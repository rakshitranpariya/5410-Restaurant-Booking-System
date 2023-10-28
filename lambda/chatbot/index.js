import https from 'https';

export const handler = async (event) => {
  let data;
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
          // Handle the "GetAllRestaurants" intent
          case "restaurantsList":

            const apiUrl = 'https://l1j6zvbe7c.execute-api.us-east-1.amazonaws.com/restaurantlist';

            data = await fetchDataFromAPI(apiUrl);
            console.log("DATA:::>>>>", data);
            const parsedData = JSON.parse(data);
            const restaurantsList = [];
              for (const item of parsedData) {
                if (item.name) {
                  restaurantsList.push(item.name);
                }
              }

            return createRestaurantsListResponse(selectedIntent, restaurantsList, data, true);
            
          // Handle the "getRestaurantInfo" intent  
          case "getRestaurantInfo":
            console.log("-------------------------------GET INFO IVOKED")
            const restaurantName = event.inputTranscript; // Use the user's input text
            console.log("restaurantName>>>>", restaurantName);

            // Find the restaurant in the parsed data
             const selectedRestaurant = parsedData.find(
               item => item.name && item.name.toLowerCase() === restaurantName.toLowerCase()
             );

             if (selectedRestaurant) {
               // Create a response with restaurant details
               const responseMessage = `Here is the information about`;

               return createGetRestaurantInfoResponse(selectedIntent, responseMessage, data);
             } else {
            // Handle the case where the restaurant was not found
              return createGetRestaurantInfoResponse(selectedIntent, "I couldn't find information for that restaurant.", data);
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
      content: "For which restaurant can I help you?"
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
