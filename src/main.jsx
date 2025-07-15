// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from './App.jsx';
import CreateTrip from './create-trip/index.jsx';
import Trip from './components/customs/Trip.jsx';
import Login from './components/customs/Login.jsx';
import Signup from './components/customs/Signup.jsx';
import Layout from './components/customs/Layout.jsx';

import { GlobalStateProvider } from './context/GlobalStateContext';
import { TripProvider } from './context/TripContext';

// Router with shared layout
const router = createBrowserRouter([
  {
    element: <Layout />,  // shared layout with Header
    children: [
      { path: '/', element: <Home /> },
      { path: '/create-trip', element: <CreateTrip /> },
      { path: '/trip', element: <Trip /> },
      { path: '/my-trips', element: <MyTrips /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

import MyTrips from './components/customs/MyTrips.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStateProvider>
      <TripProvider>
        <RouterProvider router={router} />
        <Toaster />
      </TripProvider>
    </GlobalStateProvider>
  </StrictMode>
);
