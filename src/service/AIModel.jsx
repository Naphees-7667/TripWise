import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// export const chatSession = model.startChat({
//   generationConfig,
//   history: [
//     {
//       role: "user",
//       parts: [
//         {
//           text: "Generate Travel Plan for Location : Las Vegas,for 3 Days for Couple with a Cheap budget ,Give me a Hotels options list with HotelName, Hotel address, Price, hotel image URL,geo coordinates,rating,description and suggest itineary with placeName, Place Details, Place Image URL,Geo Coordinates,ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.",
//         },
//       ],
//     },
//     {
//       role: "model",
//       parts: [
//         {
//           text: "```json\n{\n \"hotels\": [\n  {\n \"hotelName\": \"The D Las Vegas\",\n\"hotelAdress\": \"301 Fremont Street, Las Vegas, NV 89101\",\n   \"price\": \"$50-$100 per night\",\n   \"hotelImageUrl\": \"https://www.theDcasino.com/images/hero/main-hero-02.jpg\",\n  \"groCoordinates\": \"36.1695, -115.1438\",\n \"rating\": \"3.5 starts\",\n    \"description\": \"A budget-friendly hotel located in downtown Las Vegas with a retro vibe. It features a casino, a pool, and several dinning options \"\n  },\n  {\n        \"hotelName\":\"Circus Circus Hotel & Casino\",\n}}]
//           ",
//         },
//       ],
//     },
//   ],
// });

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate Travel Plan for Location: Las Vegas, for 3 Days for a Couple with a Cheap budget.
                 Provide hotel options with name, address, price, image URL, geo coordinates, rating, and description.
                 Suggest an itinerary with place details, including name, image URL, geo coordinates, ticket pricing, rating,
                 time to travel to each location, and best time to visit, all in JSON format.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: `{
            "hotels": [
              {
                "hotelName": "The D Las Vegas",
                "hotelAddress": "301 Fremont Street, Las Vegas, NV 89101",
                "price": "$50-$100 per night",
                "hotelImageUrl": "https://www.theDcasino.com/images/hero/main-hero-02.jpg",
                "geoCoordinates": {
                  "latitude": 36.1695,
                  "longitude": -115.1438
                },
                "rating": "3.5 stars",
                "description": "A budget-friendly hotel located in downtown Las Vegas with a retro vibe. It features a casino, a pool, and several dining options."
              },
              {
                "hotelName": "Circus Circus Hotel & Casino",
                "hotelAddress": "2880 S Las Vegas Blvd, Las Vegas, NV 89109",
                "price": "$30-$80 per night",
                "hotelImageUrl": "https://example.com/circus-circus.jpg",
                "geoCoordinates": {
                  "latitude": 36.1378,
                  "longitude": -115.1676
                },
                "rating": "3.0 stars",
                "description": "A family-friendly hotel offering affordable rooms, a theme park, and several dining options."
              }
            ],
            "itinerary": [
              {
                "day": 1,
                "places": [
                  {
                    "placeName": "The Strip",
                    "placeDetails": "The famous Las Vegas Strip with its casinos, entertainment, and iconic hotels.",
                    "placeImageUrl": "https://example.com/strip.jpg",
                    "geoCoordinates": {
                      "latitude": 36.1147,
                      "longitude": -115.1728
                    },
                    "ticketPricing": "Free",
                    "rating": "4.7 stars",
                    "timeToVisit": "Morning",
                    "bestTimeToVisit": "Evening"
                  },
                  {
                    "placeName": "Fremont Street",
                    "placeDetails": "A pedestrian mall with a variety of entertainment, casinos, and restaurants.",
                    "placeImageUrl": "https://example.com/fremont.jpg",
                    "geoCoordinates": {
                      "latitude": 36.1699,
                      "longitude": -115.1428
                    },
                    "ticketPricing": "Free",
                    "rating": "4.5 stars",
                    "timeToVisit": "Afternoon",
                    "bestTimeToVisit": "Night"
                  }
                ]
              },
              {
                "day": 2,
                "places": [
                  {
                    "placeName": "Hoover Dam",
                    "placeDetails": "An iconic dam located near Las Vegas with tours and an observation deck.",
                    "placeImageUrl": "https://example.com/hoover-dam.jpg",
                    "geoCoordinates": {
                      "latitude": 36.0155,
                      "longitude": -114.7378
                    },
                    "ticketPricing": "$10",
                    "rating": "4.8 stars",
                    "timeToVisit": "Morning",
                    "bestTimeToVisit": "Morning"
                  }
                ]
              }
            ]
          }`,
        },
      ],
    },
  ],
});