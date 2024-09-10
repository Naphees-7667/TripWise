import React, { useEffect, useState} from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useNavigate } from "react-router-dom";

import { Input } from "../components/ui/input.jsx";
import { AI_PROMPT, SelectBudgetOptions } from "@/constants/options.jsx";
import { SelectTravelesList } from "@/constants/options.jsx";

import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel.jsx";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [manualLocation, setManualLocation] = useState(""); // For manual input
  const [formData, setFormData] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      location: {
        label: value?.label || manualLocation,
        value: value?.value || "",
      },
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const OnGenerateTrip = async () => {
    // Use manualLocation if place is not selected
    const locationLabel = formData?.location?.label || manualLocation;
    if (
      !locationLabel ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please fill all details");
      return;
    }

    if (formData?.noOfDays < 1 || formData?.noOfDays > 5) {
      toast("Please enter a valid number of days (1 to 5).");
      return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", locationLabel)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

    const res = await chatSession.sendMessage(FINAL_PROMPT);
    console.log(res?.response?.text());
    navigate("/next-slide");
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
          {/* Input for manual location if place is not selected */}
          {!place && (
            <div className="mt-3">
              <Input
                placeholder={"Enter location manually"}
                onChange={(e) => setManualLocation(e.target.value)}
                value={manualLocation}
              />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            min={1}
            max={5}
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.title)}
              className={`p-4 border  cursor-pointer rounded-lg hover:shadow-lg ${
                formData.budget === item.title
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on travelling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("traveler", item.people)}
              className={`p-4 border  cursor-pointer rounded-lg hover:shadow-lg ${
                formData.traveler === item.people
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 flex justify-end">
        <Button onClick={OnGenerateTrip}>Generate Trip</Button>
      </div>

    </div>
  );
}

export default CreateTrip;