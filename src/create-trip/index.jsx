import React, { useState, useEffect, useContext } from "react";
import { Input } from "../components/ui/input";
import { SelectBudgetOptions, SelectTravelsList } from "../constants/options";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TripContext } from "../context/TripContext";
import { saveTrip, auth } from "../context/fireBaseContent";

function CreateTrip() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [noOfDays, setNoOfDays] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(null);
  const [selectedTravelIndex, setSelectedTravelIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setTripData, setLocation, setCompanion, setDuration, setBudget } = useContext(TripContext);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 3) {
        fetch(`https://api.allorigins.win/raw?url=https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
          .then((res) => res.json())
          .then(setPlaces)
          .catch((err) => {
            console.error(err);
            toast.error("Failed to fetch locations.");
          });
      } else {
        setPlaces([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handlePlaceClick = (place) => {
    setQuery(place.display_name);
    handleInputChange("location", place.display_name);
    setPlaces([]);
  };

  const generateTrip = async () => {
    const { location, days, budget, travelCompanion } = formData;

    if (!location || !days || !budget || !travelCompanion) {
      toast("Please fill all the details!");
      return;
    }

    // 🔐 Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to generate and save your trip.");
      navigate("/login");
      return;
    }

    const toastId = toast.loading("Generating your custom trip...");
    setLoading(true);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;
    let lastError = null;

    while (attempt < maxRetries && !success) {
      try {
        const prompt = `
Generate a travel plan for the location: ${location}, for ${days} days for ${travelCompanion}, with a ${budget} budget.

1. Provide a list of hotel options. Each hotel should include:
   - hotelName
   - hotelAddress
   - price
   - hotelImageURL
   - geoCoordinates (latitude, longitude)
   - rating
   - description

2. Also suggest an itinerary for ${days} days. For each day, list 2-3 major activities/places with:
   - placeName
   - placeDetails
   - placeImageURL
   - geoCoordinates
   - ticketPricing
   - timeToTravel
   - bestTimeToVisit

Output everything strictly in valid JSON format.
Do NOT include any explanation or markdown formatting — only raw JSON.
`;

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAnZ8EXUOXpl3wYBX-_9BrS-azP_J6OKK0`,
          { contents: [{ parts: [{ text: prompt }] }] }
        );

        let rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error("Empty response from Gemini");

        rawText = rawText.replace(/```json|```/g, "").trim();
        let tripJSON = JSON.parse(rawText);
        if (tripJSON.travelPlan) tripJSON = tripJSON.travelPlan;

        if (!tripJSON.hotelOptions || !tripJSON.itinerary) {
          throw new Error("Invalid trip data received. Missing hotelOptions or itinerary.");
        }

        // Set context
        setTripData(tripJSON);
        setLocation(location);
        setCompanion(travelCompanion);
        setDuration(days);
        setBudget(budget);

        // Save trip to Firestore
        await saveTrip({
          location,
          duration: days,
          budget,
          travelCompanion,
          tripData: tripJSON,
          createdAt: new Date(),
        });

        toast.success("Trip generated successfully!");
        navigate("/trip");
        success = true;
      } catch (err) {
        lastError = err;
        attempt++;
        console.error(`Attempt ${attempt} failed:`, err);
        if (attempt < maxRetries) {
          toast(`Retrying... (${attempt}/${maxRetries})`);
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    }

    if (!success) {
      console.error("All retry attempts failed:", lastError);
      toast.error("Failed to generate trip after multiple attempts. Please try again later.");
    }

    toast.dismiss(toastId);
    setLoading(false);
  };

return (
  <div className="px-4 sm:px-8 md:px-16 lg:px-32 xl:px-44 mt-10 mb-16 max-w-screen-xl mx-auto">
    <h2 className="font-bold text-4xl text-gray-800 pt-10">Tell us your travel preferences 🏕️🌴</h2>
    <p className="mt-3 text-lg text-gray-500">
      Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
    </p>

    {/* Location Input */}
    <div className="mt-10 relative">
      <h2 className="text-2xl font-semibold mb-2 pt-5">What is your destination of choice?</h2>
      <input
        type="text"
        placeholder="Search places..."
        className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-3 rounded-md shadow-sm transition duration-150 ease-in-out"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleInputChange("location", e.target.value);
        }}
      />
      {places.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 border rounded-md max-h-60 overflow-y-auto bg-white shadow-lg z-50">
          {places.map((place, index) => (
            <li
              key={index}
              className="p-3 hover:bg-blue-100 cursor-pointer text-sm"
              onClick={() => handlePlaceClick(place)}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Days Input */}
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-2">How many days are you planning your trip?</h2>
      <Input
        type="number"
        placeholder="Enter number of days"
        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={noOfDays}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value > 0) {
            setNoOfDays(value);
            handleInputChange("days", value);
          }
        }}
      />
    </div>

    {/* Budget Options */}
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-3">What is your budget?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SelectBudgetOptions.map((item, index) => (
          <div
            key={index}
            className={`p-5 border rounded-xl cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${
              selectedBudgetIndex === index ? "bg-blue-100 border-blue-500 shadow-md" : "bg-white"
            }`}
            onClick={() => {
              setSelectedBudgetIndex(index);
              handleInputChange("budget", item.tittle);
            }}
          >
            <div className="text-4xl">{item.icon}</div>
            <h2 className="text-lg font-bold mt-2">{item.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Travel Companion */}
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-3">Who are you traveling with?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SelectTravelsList.map((item, index) => (
          <div
            key={index}
            className={`p-5 border rounded-xl cursor-pointer transition transform hover:scale-105 hover:shadow-lg ${
              selectedTravelIndex === index ? "bg-blue-100 border-blue-500 shadow-md" : "bg-white"
            }`}
            onClick={() => {
              setSelectedTravelIndex(index);
              handleInputChange("travelCompanion", item.tittle);
            }}
          >
            <div className="text-4xl">{item.icon}</div>
            <h2 className="text-lg font-bold mt-2">{item.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Button */}
    <div className="flex justify-end mt-12">
      <Button
        onClick={generateTrip}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Trip"}
      </Button>
    </div>
  </div>
);

}

export default CreateTrip;
