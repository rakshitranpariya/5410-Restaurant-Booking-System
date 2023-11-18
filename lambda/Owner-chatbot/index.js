import https from 'https';

let restaurantsData = null;
let restaurantName = null;
export const handler = async (event) => {
    // let restaurantsData = null;
    // let restaurantName = null;
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
                console.log("SELECTED INTENT--------------", selectedIntent);
                switch (selectedIntent) {
                    case "init":
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

                    case "ReservationInformation":
                        console.log("Handling ReservationInformation:::::", event);
                        restaurantName = event['inputTranscript'];

                        const buttons = [
                            {
                                text: 'Day',
                                value: 'day',
                            },
                            {
                                text: 'Week',
                                value: 'week',
                            },
                            {
                                text: 'Month',
                                value: 'month',
                            },
                        ];


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
                                    contentType: "ImageResponseCard",
                                    content: "Can you select time period?",
                                    imageResponseCard: {
                                        title: restaurantName,
                                        subtitle: "Select any option from below:",
                                        buttons

                                    },

                                },

                            ],
                        };

                    case "reservationOfDay":
                        console.log("Handling TimePeriod:::::", event);
                        let date = event['inputTranscript'];

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
                                    content: date,
                                },
                                {
                                    contentType: "PlainText",
                                    content: "Is there anything else I can help you with?",
                                },
                            ],
                        };

                    case "reservationOfMonth":
                        console.log("Handling TimePeriod:::::", event);
                        let month = event['inputTranscript'];

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
                                    content: month,
                                },
                                {
                                    contentType: "PlainText",
                                    content: "Is there anything else I can help you with?",
                                },
                            ],
                        };

                    case "openingTime":
                        console.log("Handling opening time:::::", event);
                        let openingTime = "11 pm";
                        let openingTimeMessage = `Opening time for ${restaurantName} is ${openingTime}`;
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
                    case "editOpeningTime":
                        console.log("Handling opening time:::::", event);
                        let editedOpeningTime = event['inputTranscript'];
                        let editedOpeningTimeMessage = `Updated opening time for ${restaurantName} is ${editedOpeningTime}`;
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
                                    content: editedOpeningTimeMessage,
                                },
                                {
                                    contentType: "PlainText",
                                    content: "Is there anything else I can help you with?",
                                },
                            ],
                        };

                    case "restaurantTimeIntent":
                        console.log("Handling restaurantTimeIntent:::::", event);
                        let timeInfo = event['inputTranscript'];

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
                                    contentType: "ImageResponseCard",
                                    content: "please select any option?",
                                    imageResponseCard: {
                                        title: "Operations related opening time",
                                        subtitle: "Select any option from below:",
                                        buttons: [
                                            {
                                                text: 'View',
                                                value: 'View time',
                                            },
                                            {
                                                text: 'Edit',
                                                value: 'Edit time',
                                            }
                                        ]

                                    },

                                },

                            ],
                        };

                    case "viewLocation":
                        console.log("Handling opening time:::::", event);
                        let restaurantLocation = "Halifax";
                        let restaurantLocationMessage = `Opening time for ${restaurantName} is ${restaurantLocation}`;
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
                    case "editLocation":
                        console.log("Handling opening time:::::", event);
                        let editedLocation = event['inputTranscript'];
                        let editedLocationMessage = `Updated opening time for ${restaurantName} is ${editedLocation}`;
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

                    case "RestaurantLocationInfo":
                        console.log("Handling restaurantTimeIntent:::::", event);
                        let restaurantLocationInfo = event['inputTranscript'];

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
                                    contentType: "ImageResponseCard",
                                    content: "please select any option?",
                                    imageResponseCard: {
                                        title: "Operations related Location",
                                        subtitle: "Select any option from below:",
                                        buttons: [
                                            {
                                                text: 'View location',
                                                value: 'View location',
                                            },
                                            {
                                                text: 'Edit location',
                                                value: 'Edit location',
                                            }
                                        ]

                                    },

                                },

                            ],
                        };

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


function createUnknownIntentResponse() {
    return {
        // Your response for unknown or unsupported intents
    };
}
