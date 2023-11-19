import https from 'https';

let restaurantsData = null;
let restaurantName = null;
let reservationDetails = null;

export const handler = async (event) => {
    try {
        console.log("Received event:");
        console.log(JSON.stringify(event, null, 2));

        if (event && event['interpretations'] && event['interpretations'].length > 0) {
            const selectedIntent = findHighestConfidenceIntent(event['interpretations']);

            if (selectedIntent) {
                console.log("SELECTED INTENT--------------", selectedIntent);

                switch (selectedIntent) {
                    case "init":
                        await fetchRestaurantData("https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getRestaurantData");
                        return handleInitIntent(selectedIntent);

                    case "ReservationInformation":
                        // await fetchReservationData("https://wvnzmflpyb.execute-api.us-east-1.amazonaws.com/reservation/getallreservations");
                        restaurantName = event['inputTranscript'];
                        return handleReservationInformationIntent(selectedIntent);

                    case "reservationOfDay":
                        let date = event['inputTranscript'];
                        return handleReservationOfDayIntent(date, selectedIntent);

                    case "reservationOfMonth":
                        let month = event['inputTranscript'];
                        return handleReservationOfMonthIntent(month, selectedIntent);

                    case "openingTime":
                        return handleOpeningTimeIntent(selectedIntent);

                    case "editOpeningTime":
                        let editedOpeningTime = event['inputTranscript'];
                        return handleEditOpeningTimeIntent(editedOpeningTime, selectedIntent);

                    case "restaurantTimeIntent":
                        return handleRestaurantTimeIntent(selectedIntent);

                    case "viewLocation":
                        return handleViewLocationIntent(selectedIntent);

                    case "editLocation":
                        let editedLocation = event['inputTranscript'];
                        return handleEditLocationIntent(editedLocation, selectedIntent);

                    case "RestaurantLocationInfo":
                        return handleRestaurantLocationInfoIntent(selectedIntent);

                    case "menuAvailability":
                        return handleMenuAvailabilityIntent(selectedIntent);

                    case "reservationAvailability":
                        return handleReservationAvailabilityIntent(selectedIntent);

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

function createUnknownIntentResponse() {
    return {
        // Your response for unknown or unsupported intents
    };
}

async function fetchRestaurantData(apiUrl) {
    const data = await fetchDataFromAPI(apiUrl);
    restaurantsData = JSON.parse(data);
    console.log("restaurantsData:::", restaurantsData);
}

async function fetchReservationData(apiUrl) {
    const data = await fetchDataFromAPI(apiUrl);
    reservationDetails = JSON.parse(data);
    console.log("reservationDetails:::", reservationDetails);
}

function findHighestConfidenceIntent(interpretations) {
    let highestConfidence = -1;
    let selectedIntent = null;

    interpretations.forEach((interpretation) => {
        if (interpretation.intent && interpretation.nluConfidence > highestConfidence) {
            highestConfidence = interpretation.nluConfidence;
            selectedIntent = interpretation.intent.name;
        }
    });

    return selectedIntent;
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

function handleReservationInformationIntent(selectedIntent) {
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
                content: restaurantName,
                imageResponseCard: {
                    title: "Can you select time period?",
                    subtitle: "Select any option from below:",
                    buttons
                },
            },
        ],
    };
}

function handleReservationOfDayIntent(date, selectedIntent) {
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
}

function handleReservationOfMonthIntent(month, selectedIntent) {
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
}

function handleOpeningTimeIntent(selectedIntent) {
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
}

function handleEditOpeningTimeIntent(editedOpeningTime, selectedIntent) {
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
}

function handleRestaurantTimeIntent(selectedIntent) {
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
                        },
                    ]
                },
            },
        ],
    };
}

function handleViewLocationIntent(selectedIntent) {
    let restaurantLocation = "Halifax";
    let restaurantLocationMessage = `Location of ${restaurantName} is ${restaurantLocation}`;
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

function handleEditLocationIntent(editedLocation, selectedIntent) {
    let editedLocationMessage = `Updated location of ${restaurantName} is ${editedLocation}`;
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

function handleRestaurantLocationInfoIntent(selectedIntent) {
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
                        },
                    ]
                },
            },
        ],
    };
}

function handleMenuAvailabilityIntent(selectedIntent) {
    let menu = "menu list";
    let menuMessage = `Menu of ${restaurantName} is ${menu}`;
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

function handleReservationAvailabilityIntent(selectedIntent) {
    let reservation = "reservation list";
    let reservationMessage = `Reservation availability of ${restaurantName} is ${reservation}`;
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
