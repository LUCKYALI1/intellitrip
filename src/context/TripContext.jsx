// src/context/TripContext.js
import { createContext, useState } from "react";

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripData, setTripData] = useState(null);
  const [location, setLocation] = useState("");
  const [companion, setCompanion] = useState("");
  const[fromduration , setDuration] = useState("");
  const[formbudget , setBudget] = useState("");

  return (
    <TripContext.Provider value={{ tripData, setTripData, location, setLocation, companion, setCompanion ,setDuration, setBudget , formbudget,fromduration }}>
      {children}
    </TripContext.Provider>
  );
};
