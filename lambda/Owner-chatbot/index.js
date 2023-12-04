const https = require('https');

let restaurantsData = null;
let selectedRestaurantData = null;
let ownerEmail = null;
let restaurantName = null;
let reservationDetails = null;

exports.handler = async (event) => {
    try {
        console.log("Received event:");
        console.log(JSON.stringify(event, null, 2));

        if (event && event['interpretations'] && event['interpretations'].length > 0) {
            const selectedIntent = findHighestConfidenceIntent(event['interpretations']);

            if (selectedIntent) {
                console.log("SELECTED INTENT-------------", selectedIntent);

                switch (selectedIntent) {
                    case "init":
                        const data = await fetchRestaurantData("https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/getRestaurantData");
                        restaurantsData = data["body"];
                        console.log("DATA::::", data["body"]);
                        const reservationInfo = await fetchRestaurantData("https://wvnzmflpyb.execute-api.us-east-1.amazonaws.com/reservation/getallreservations");
                        console.log("reservationInformation::::", reservationInfo["body"]);
                        reservationDetails = reservationInfo["body"];
                        return handleInitIntent(selectedIntent);

                    case "ReservationInformation":
                        ownerEmail = event['inputTranscript'].trim();  // Trim any leading or trailing whitespaces
                        console.log("ownerEmail", ownerEmail);
                        console.log("restaurantsData", JSON.parse(restaurantsData));

                        for (const item of JSON.parse(restaurantsData)) {
                            console.log("ITEM:::", item["email"]);
                            if (item["email"] == ownerEmail) {
                                console.log("ITEM:::", item);
                                selectedRestaurantData = item;
                                break;
                            }
                        }

                        if (selectedRestaurantData) {
                            console.log("Owner's Restaurant Details:", selectedRestaurantData);
                        } else {
                            console.log("No Restaurant Details found for the ownerEmail:", ownerEmail);
                        }

                        return handleReservationInformationIntent(selectedIntent);


                    case "reservationOfDay":
                        let date = event['inputTranscript'];
                        console.log("DATE:::", date, reservationDetails);

                        const filteredData = [];

                        for (const item of JSON.parse(reservationDetails)) {
                            if (item && item["data"] && item["data"]["restaurantEmail"] && item["data"]["reservationDate"]) {
                                if (item["data"]["restaurantEmail"] === ownerEmail && item["data"]["reservationDate"] === date) {
                                    filteredData.push(item);
                                }
                            }
                        }


                        console.log("filteredData::::", filteredData);



                        return handleReservationOfDayIntent(filteredData, selectedIntent);


                    case "reservationOfMonth":
                        let month = event['inputTranscript'];
                        const year = 2023; // Adjust the year as needed
                        const startDateString = `${year}-${month}-01`;
                        const endDateString = `${year}-${month}-31`;

                        const filteredMonthData = [];

                        for (const item of JSON.parse(reservationDetails)) {
                            if (item && item["data"] && item["data"]["restaurantEmail"] && item["data"]["reservationDate"]) {
                                let reservationDate = new Date(item["data"]["reservationDate"]);

                                if (
                                    item["data"]["restaurantEmail"] === ownerEmail &&
                                    reservationDate >= new Date(startDateString) &&
                                    reservationDate <= new Date(endDateString)
                                ) {
                                    filteredMonthData.push(item);
                                }
                            }
                        }

                        console.log("filteredData::::", filteredMonthData);



                        return handleReservationOfMonthIntent(filteredMonthData, selectedIntent);

                    case "openingTime":
                        console.log("OPENING TIME FOR::::::", selectedRestaurantData["openingHours"]);
                        return handleOpeningTimeIntent(selectedRestaurantData["name"], selectedRestaurantData["openingHours"], selectedIntent);

                    case "editOpeningTime":
                        let editedOpeningTime = event['inputTranscript'];
                        console.log("...................", editedOpeningTime);
                        selectedRestaurantData["openingHours"] = editedOpeningTime;
                        postData(selectedRestaurantData, "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertRestaurantKeys");
                        return handleEditOpeningTimeIntent(selectedRestaurantData["name"], editedOpeningTime, selectedIntent);

                    case "restaurantTimeIntent":
                        return handleRestaurantTimeIntent(selectedIntent);

                    case "viewLocation":
                        console.log("OPENING TIME FOR::::::", selectedRestaurantData["city"]);
                        return handleViewLocationIntent(selectedRestaurantData["name"], selectedRestaurantData["city"], selectedIntent);

                    case "editLocation":
                        let editedLocation = event['inputTranscript'];
                        console.log("...................", editedLocation);
                        selectedRestaurantData["city"] = editedLocation;
                        postData(selectedRestaurantData, "https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/insertRestaurantKeys");
                        return handleEditLocationIntent(selectedRestaurantData["name"], editedLocation, selectedIntent);

                    case "RestaurantLocationInfo":
                        return handleRestaurantLocationInfoIntent(selectedIntent);

                    case "menuAvailability":
                        console.log("OPENING TIME FOR::::::", selectedRestaurantData["availability"]);
                        return handleMenuAvailabilityIntent(selectedRestaurantData["name"], selectedRestaurantData["availability"], selectedIntent);

                    case "reservationAvailability":
                        console.log("OPENING TIME FOR::::::", selectedRestaurantData["availability"]);
                        return handleReservationAvailabilityIntent(selectedRestaurantData["name"], selectedRestaurantData["availability"], selectedIntent);

                    case "readRestaurantRating":
                        console.log("Rating::::", selectedRestaurantData["rating"]);
                        return handleReadRestaurantRating(selectedRestaurantData["name"], selectedRestaurantData["rating"], selectedIntent);

                    case "readRestaurantReviews":
                        console.log("Reviews::::", selectedRestaurantData["review"]);
                        return handleReadRestaurantReviews(selectedRestaurantData["name"], selectedRestaurantData["review"], selectedIntent);

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


function createUnknownIntentResponse() {
    return {
        // Your response for unknown or unsupported intents
    };
}

async function fetchRestaurantData(apiUrl) {
    const data = await fetchDataFromAPI(apiUrl);
    const resturnDataObj = JSON.parse(data);
    return resturnDataObj;
}

async function postData(requestBody, apiUrl) {
    const data = await postDataAPI(requestBody, apiUrl);
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

function handleReservationOfDayIntent(filteredData, selectedIntent) {
    // Display reservation details for all customers
    const reservationMessages = [];

    for (const reservation of filteredData) {
        const reservationTime = reservation.data.reservationTime;
        const customerName = reservation.data.customerName;
        const numberOfGuests = reservation.data.numberOfGuests;
        const reservationDate = reservation.data.reservationDate;

        reservationMessages.push({
            contentType: "PlainText",
            content: `Reservation Time: ${reservationTime}, Name: ${customerName}, No. of Guests: ${numberOfGuests}, Date: ${reservationDate}`
        });
    }

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
            ...reservationMessages,
            {
                contentType: "PlainText",
                content: "Is there anything else I can help you with?",
            },
        ],
    };
}


function handleReservationOfMonthIntent(filteredData, selectedIntent) {
    const reservationMessages = [];

    for (const reservation of filteredData) {
        const reservationTime = reservation.data.reservationTime;
        const customerName = reservation.data.customerName;
        const numberOfGuests = reservation.data.numberOfGuests;
        const reservationDate = reservation.data.reservationDate;

        reservationMessages.push({
            contentType: "PlainText",
            content: `Reservation Time: ${reservationTime}, Name: ${customerName}, No. of Guests: ${numberOfGuests}, Date: ${reservationDate}`
        });
    }

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
            ...reservationMessages,
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

function handleEditOpeningTimeIntent(name, editedOpeningTime, selectedIntent) {
    let editedOpeningTimeMessage = `Updated opening time for ${name} is ${editedOpeningTime}`;
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

function handleEditLocationIntent(name, editedLocation, selectedIntent) {
    let editedLocationMessage = `Updated location of ${name} is ${editedLocation}`;
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

function handleReadRestaurantRating(name, rating, selectedIntent) {
    let reservation = "reservation list";
    let reservationMessage = `Rating of ${name} is ${rating}`;
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

function handleReadRestaurantReviews(name, reviews, selectedIntent) {
    let reservation = "reservation list";
    let reservationMessage = `Reviews of ${name} is ${reviews}`;
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