import React, { useEffect, useState, useContext } from "react";
import { getTrips } from "../../context/fireBaseContent";
import Trip from "./Trip";
import { TripContext } from "../../context/TripContext";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { tripData } = useContext(TripContext);

  useEffect(() => {
    async function fetchTrips() {
      try {
        const tripsData = await getTrips();
        setTrips(tripsData);
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  // const safeImage = (url) ={ url : ""};

  const TripCard = ({ trip, onClick }) => {
    const details = trip.tripData || {};
    return (
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={onClick}
      >
        <img
          src='https://aitrip.tubeguruji.com/placeholder.jpg'
          alt={details.location || "Trip Image"}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {details.location || trip.location || "Unknown Location"}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            📅 Duration: {details.duration || trip.duration || "N/A"}
          </p>
          <p className="text-gray-600 text-sm sm:text-base">💰 Budget: {details.budget || trip.budget || "N/A"}</p>
        </div>
      </div>
    );
  };

  const ModalOverlay = ({ trip, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-lg max-w-6xl w-full relative p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-900 font-bold z-50"
          aria-label="Close Modal"
        >
          &times;
        </button>
        <Trip tripData={trip} />
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium text-gray-700">Loading your trips...</div>;
  }

  // If only context trip exists (before Firestore fetch is persisted)
  if (trips.length === 0 && tripData) {
    return (
      <div className="px-4 sm:px-6 lg:px-20 max-w-screen-xl mx-auto mt-10 mb-20">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">My Trips</h1>
        <div className="max-w-md mx-auto">
          <TripCard trip={{ tripData }} onClick={() => setSelectedTrip(tripData)} />
        </div>
        {selectedTrip && <ModalOverlay trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
      </div>
    );
  }

  // No trip case
  if (trips.length === 0) {
    return <div className="text-center mt-10 text-lg text-gray-600">No trips found.</div>;
  }

  // Trips grid
  return (
    <div className="px-4 sm:px-6 lg:px-20 max-w-screen-xl mx-auto mt-10 mb-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">My Trips</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} onClick={() => setSelectedTrip(trip.tripData)} />
        ))}
      </div>

      {selectedTrip && <ModalOverlay trip={selectedTrip} onClose={() => setSelectedTrip(null)} />}
    </div>
  );
}

export default MyTrips;
