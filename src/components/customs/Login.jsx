import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { app } from '../../context/fireBaseContent';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { GlobalStateContext } from '../../context/GlobalStateContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUsername } = useContext(GlobalStateContext);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUsername(user.displayName || user.email.split('@')[0]);
      setIsLoggedIn(true);
      toast.success(`Welcome back, ${user.displayName || user.email.split('@')[0]}!`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/create-trip');
      }, 1500);
    } catch (error) {
      toast.error("Login failed: " + error.message, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUsername(user.displayName || user.email.split('@')[0]);
      setIsLoggedIn(true);
      toast.success(`Logged in as ${user.displayName || user.email.split('@')[0]}`, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/create-trip');
      }, 1500);
    } catch (error) {
      toast.error("Google login failed: " + error.message, {
        position: 'top-right',
        autoClose: 3000,
        theme: 'dark',
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-white text-black relative ">
      <ToastContainer />

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 z-[100] backdrop-blur flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-400 border-solid"></div>
        </div>
      )}

      <div className="w-full md:w-[90vw] m-auto h-full">
        <div className="flex flex-col md:flex-row w-full h-full">

          {/* Left Section */}
          <div
            className="md:w-[50%] w-full flex flex-col items-center justify-center gap-8 p-6"
          >
            <div className="w-full max-w-[500px] text-center">
              <h2 className="text-3xl font-bold text-green-400 mb-2">Log in to your Account</h2>
              <p className="text-base font-medium opacity-90 mb-6">
                Welcome back! Select a method to log in:
              </p>
            </div>

            {/* Google Sign-in */}
            <div
              onClick={handleGoogleLogin}
              className="flex items-center justify-between gap-3 border w-fit bg-white cursor-pointer hover:bg-gray-200 transition-all rounded"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src="https://freelogopng.com/images/all_img/1657952440google-logo-png-transparent.png"
                  alt="Google"
                  className="w-[25px]"
                />
                <span className="text-black font-semibold">Login with Google</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">or login using email & password</p>

            {/* Login Form */}
            <form onSubmit={loginUser} className="flex flex-col gap-3 w-full max-w-[400px]">
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-600 py-2 px-4 rounded bg-white text-black placeholder-gray-400"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-600 py-2 px-4 rounded bg-white text-black placeholder-gray-400"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />

              <div className="flex justify-end text-sm text-blue-400 underline">
                <a href="#">Forgot Password?</a>
              </div>

              <button
                type="submit"
                className="bg-green-400/80 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded transition-all"
              >
                Login
              </button>
            </form>

            <div className="mt-4 text-sm">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-500 underline">Create one</Link>
            </div>
          </div>

          {/* Right Section */}
          <div
          
            className="md:w-[50%] hidden md:flex relative items-center justify-center p-6"
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://www.getawaycouple.com/wp-content/uploads/2021/12/top-view-woman-planning-a-trip-with-a-map-and-laptop-writing-in-a-notebook-flat-lay_t20_jjKPod-1024x684.jpg')",
              }}
            />
           
          
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
