import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig.jsx";
import { toast } from "sonner";
import InfoSection from "../components/InfoSection.jsx";
import Hotels from "../components/Hotels.jsx";
import PlacesToVisit from "../components/PlacesToVisit.jsx";
import Footer from "../components/Footer.jsx";

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such document");
      toast("No trip Found!", { icon: "🤷‍♂️" });
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56 ">
      {/* Informative Section */}
      <InfoSection trip={trip} />
      {/* Recommended Hotels */}
      <Hotels trip={trip} />
      {/* Daily Plan */}
      <PlacesToVisit trip={trip} />
      {/* Footer */}
      <Footer trip={trip} />
    </div>
  );
}

export default Viewtrip;
