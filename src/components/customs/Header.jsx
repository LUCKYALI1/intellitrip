import React, { useContext } from 'react';
import logoImg from '../../assets/logo.svg';
import { Button } from '../ui/button';
import { GlobalStateContext } from '../../context/GlobalStateContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { isLoggedIn } = useContext(GlobalStateContext);
  const navigate = useNavigate();

  const handleSignin = () => {
    navigate('/login');
  };

  return (
    <nav className="px-4 sm:px-6 md:px-10 py-4 shadow-md flex justify-between items-center">
      <img
        src={logoImg}
        alt="Logo"
        className="w-32 sm:w-44 md:w-[230px] cursor-pointer"
        onClick={() => navigate('/')}
      />

      <div className="flex flex-wrap justify-end items-center gap-3 sm:gap-5">
        {isLoggedIn ? (
          <>
            <Button
              onClick={() => navigate('/create-trip')}
              className="text-sm sm:text-base"
            >
              + Create Trips
            </Button>
            <Button
              onClick={() => navigate('/my-trips')}
              className="text-sm sm:text-base"
            >
              My Trips
            </Button>
          </>
        ) : (
          <Button onClick={handleSignin} className="text-sm sm:text-base">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Header;
