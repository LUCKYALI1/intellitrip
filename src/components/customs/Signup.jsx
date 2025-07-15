import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { app } from '../../context/fireBaseContent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const createUser = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      toast.success("Account created successfully!");
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.message);
      toast.error(`Signup failed: ${error.message}`);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success(`Signed up as ${user.displayName || user.email}`);
      navigate('/');
    } catch (error) {
      console.error('Google signup error:', error.message);
      toast.error(`Google signup failed: ${error.message}`);
    }
  };

  return (
    <div className="w-screen h-screen bg-white text-black">
      <div className="w-full md:w-[90vw] m-auto h-full">
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="md:w-[50%] w-full flex flex-col items-center justify-center gap-8 p-6">
            <div className="w-full max-w-[600px] mx-auto text-center">
              <h2 className="text-3xl font-bold text-green-400">Create your Account</h2>
              <p className="text-base font-medium opacity-90 mt-2">
                Create and start your journey today!
              </p>
            </div>

            <div
              onClick={handleGoogleSignup}
              className="flex items-center gap-3 border bg-white text-black px-4 py-3 rounded cursor-pointer hover:bg-gray-200 transition-all"
            >
              <img
                src="https://freelogopng.com/images/all_img/1657952440google-logo-png-transparent.png"
                alt="Google"
                className="w-[25px]"
              />
              <span className="font-semibold">Sign up with Google</span>
            </div>

            <p>or use your Email to create an account</p>

            <form onSubmit={createUser} className="flex flex-col gap-3 w-full max-w-[400px]">
              <input
                type="text"
                placeholder="Full Name"
                className="border border-gray-600 py-2 px-4 rounded"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-600 py-2 px-4 rounded"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border border-gray-600 py-2 px-4 rounded"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="border border-gray-600 py-2 px-4 rounded"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
              <button
                type="submit"
                className="bg-green-400/80 hover:bg-green-400 text-white font-semibold py-2 px-4 rounded"
              >
                Create Account
              </button>
            </form>

            <p className="py-5 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="md:w-[50%] hidden md:flex relative items-center justify-center p-6">
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
      <ToastContainer />
    </div>
  );
}

export default Signup;
