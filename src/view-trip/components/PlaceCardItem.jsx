import { Target } from "lucide-react";
import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";

function PlaceCardItem({ place }) {
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place.geoCoordinates.latitude},${place.geoCoordinates.longitude}`}
      target="_blank"
    >
      <div className="border roundex-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src="../../../public/placeholder.jpg"
          className="w-[130px] h-[130px] object-cover rounded-xl"
        />

        <div>
          <h2 className="font-bold text-lg">{place.placeName}</h2>
          <p className="text-sm text-gray-400">{place.placeDetails}</p>
          <h2 className="mt-2">
            🕙 {place.timeToVisit} {/* Using 'timeToVisit' as per your data */}
          </h2>
          <p className="mt-2">Ticket Pricing: {place.ticketPricing}</p>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
