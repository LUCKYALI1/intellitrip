import React, { useContext } from 'react';
import { Button } from '../ui/button';
import landingImg from '../../assets/landing.png';
import { GlobalStateContext } from "../../context/GlobalStateContext";
import { useNavigate } from "react-router";

export default function Hero() {
  const { isLoggedIn } = useContext(GlobalStateContext);
  const navigate = useNavigate();

  const handle = () => {
    if (isLoggedIn) {
      navigate('/create-trip');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-10 flex flex-col items-center gap-8">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black  text-center leading-[50px] sm:leading-[70px] md:leading-[90px]">
        <span className="text-green-600 block">
          Discover Your Next Adventure with AI:
        </span>
        <span className="block">
          Personalized Itineraries at Your Fingertips
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-gray-500 text-center max-w-3xl">
        Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
      </p>

      <Button
        onClick={handle}
        className="text-base sm:text-lg px-6 py-3"
      >
        Get Started – It's Free
      </Button>

      <img
        src={landingImg}
        alt="Landing Visual"
        className="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] mt-4"
      />
    </div>
  );
}
