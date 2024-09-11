import React from "react";
import PlaceCardItem from "./PlaceCardItem.jsx";

function PlacesToVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-lg">Places To Visit</h2>
      <div>
        {trip?.tripData?.itinerary?.map((dayItem, dayIndex) => (
          <div key={dayIndex} className="mt-5">
            <h2 className="font-medium text-lg">Day {dayItem.day}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {dayItem.places?.map((place, placeIndex) => (
                <div key={placeIndex}>
                  <h2 className="font-medium text-sm text-orange-600">
                    {place.bestTimeToVisit}
                  </h2>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default PlacesToVisit;