import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Input } from "../components/ui/input.jsx";
import { AI_PROMPT, SelectBudgetOptions } from "@/constants/options.jsx";
import { SelectTravelesList } from "@/constants/options.jsx";

import { Button } from "@/components/ui/button.jsx";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModel.jsx";
import { useUser } from "@clerk/clerk-react";
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
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig.jsx";
function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [manualLocation, setManualLocation] = useState(""); // For manual input
  const [formData, setFormData] = useState({}); // Initialize as object

  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // If you plan to navigate after trip creation

  const { user, isSignedIn } = useUser(); // Destructure user and isSignedIn

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

  // Fetch user profile on sign-in
  // ! Baad ke liye hai ye
  // useEffect(() => {
  //   if (isSignedIn && user) {
  //     GetUserProfile();
  //   }
  // }, [isSignedIn, user]);

  const OnGenerateTrip = async () => {
    const storedUser = localStorage.getItem("user");
    const locationLabel = formData?.location?.label || manualLocation;

    // Validate form inputs before proceeding
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

    if (!storedUser) {
      setOpenDialog(true);
      return;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", locationLabel)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);

    console.log(FINAL_PROMPT);

    try {
      const res = await chatSession.sendMessage(FINAL_PROMPT);
      console.log("--", res?.response?.text());
      SaveAiTrip(res?.response?.text());
    } catch (error) {
      console.error("Error generating trip:", error);
      toast("Failed to generate trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast("User not found. Please sign in again.");
      setLoading(false);
      return;
    }
    const docId = Date.now().toString();
    try {
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user.email_addresses[0].email_address,
        id: docId,
      });
      toast("Trip saved successfully!");
      // Optionally, navigate to another page
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast("Failed to save trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GetUserProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clerk-user/${user.id}`
      );

      if (response.ok) {
        const userData = await response.json();
        console.log(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setOpenDialog(false);
      } else {
        console.error(
          "Failed to fetch user data from backend",
          response.status
        );
        toast("Failed to retrieve user data. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast("An error occurred. Please try again.");
    }
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
            onChange={(e) =>
              handleInputChange("noOfDays", parseInt(e.target.value, 10))
            }
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
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
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
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
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
        <Button disabled={loading} onClick={OnGenerateTrip}>
          {loading ? (
            <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
          ) : (
            "Generate Trip"
          )}
        </Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <h2 className="text-xl font-bold text-center">
                Please Sign in to continue
              </h2>
              <SignInButton className="mt-5 w-full text-white text-lg p-2">
                Sign In
              </SignInButton>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
