import React, { useContext } from 'react';
import { TripContext } from '../../context/TripContext';
import { useNavigate } from 'react-router-dom';

function Trip() {
  const { tripData, location: contextLocation, companion, formbudget, fromduration } = useContext(TripContext);
  const navigate = useNavigate();

  if (!tripData) return <div className="text-center text-xl mt-10">Loading...</div>;

  const { tripDetails = {}, hotelOptions = [], itinerary = {} } = tripData;
  const { duration = "N/A", budget = "N/A", location: tripLocation } = tripDetails;

  const location = tripLocation || contextLocation || "N/A";

  // Utility function for placeholder image fallback
  const safeImage = (url) =>
    url && url.startsWith("http") ? url : "https://aitrip.tubeguruji.com/placeholder.jpg";

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 max-w-screen-xl mx-auto mt-10 mb-20">
      {/* Trip Overview */}
      <div className="border p-5 rounded-2xl flex flex-col gap-5 shadow-lg bg-white">
        <img
          className="w-full h-[250px] sm:h-[400px] object-cover rounded-xl"
          src="https://aitrip.tubeguruji.com/placeholder.jpg"
          alt="Trip Visual"
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold capitalize text-gray-800">{location}</h1>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 text-sm sm:text-base bg-gray-200 rounded-2xl font-semibold flex items-center gap-2">
              📅 {fromduration || "N/A"}
            </span>
            <span className="px-4 py-2 text-sm sm:text-base bg-gray-200 rounded-2xl font-semibold flex items-center gap-2">
              💰 {formbudget || "N/A"}
            </span>
            <span className="px-4 py-2 text-sm sm:text-base bg-gray-200 rounded-2xl font-semibold flex items-center gap-2">
              🥂 {companion || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Hotel Recommendations */}
      <div className="mt-14">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Hotel Recommendations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotelOptions.map((hotel, index) => (
            <div
              key={hotel.hotelName + index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 p-4 cursor-pointer"
            >
              <img
                src={safeImage(hotel.hotelImageURL)}
                alt={hotel.hotelName}
                className="w-full h-[180px] object-cover rounded-lg mb-3"
              />
              <h2 className="text-lg font-semibold text-gray-800">{hotel.hotelName}</h2>
              <p className="text-sm text-gray-600 mt-1">📌 {hotel.hotelAddress}</p>
              <p className="text-sm mt-1">💰 {hotel.price}</p>
              <p className="text-sm mt-1">⭐ {hotel.rating}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Day-wise Itinerary */}
      <div className="mt-14">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Day-wise Itinerary</h1>
        {Object.entries(itinerary).map(([day, dayData]) => {
          const activities = Object.values(dayData); // normalize object to array

          return (
            <div key={day} className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 capitalize text-blue-600">
                {day.replace(/day/i, "Day")} 🗓️
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {activities.map((activity, index) => {
                  const timeStr = activity.timeToTravel || "1";
                  const hoursToSpend = parseFloat(timeStr) || 1;
                  const buffer = 1;

                  const activityStartTime = new Date(0, 0, 0, 9, 0); // 9:00 AM
                  for (let i = 0; i < index; i++) {
                    const prev = activities[i];
                    const prevTime = parseFloat(prev.timeToTravel || "1") + buffer;
                    activityStartTime.setHours(activityStartTime.getHours() + prevTime);
                  }

                  const activityEndTime = new Date(activityStartTime.getTime());
                  activityEndTime.setHours(activityEndTime.getHours() + hoursToSpend);

                  const formatTime = (date) =>
                    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  const timeSlot = `${formatTime(activityStartTime)} - ${formatTime(activityEndTime)}`;

                  return (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-300 p-4 flex flex-col gap-3 cursor-pointer"
                    >
                      <div className="text-sm font-semibold text-orange-600">{timeSlot}</div>
                      <img
                        src={safeImage(activity.placeImageURL)}
                        alt={activity.placeName}
                        className="rounded-lg w-full h-[180px] object-cover"
                      />
                      <div className="text-sm font-semibold text-orange-600">
                        <h1 className="text-[15px] font-medium text-black">Best Time to Visit</h1>
                        {activity.bestTimeToVisit || "Not Available"}
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">{activity.placeName}</h3>
                      <p className="text-sm text-gray-700">{activity.placeDetails}</p>
                      <div className="flex flex-col gap-1 text-sm mt-2 text-gray-600">
                        <span>⏱️ {activity.timeToTravel || "1 hour"}</span>
                        <span>🎟️ {activity.ticketPricing || "N/A"}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Trip;
