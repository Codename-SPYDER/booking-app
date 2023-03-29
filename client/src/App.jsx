import axios from 'axios';
// Axios: promise-based HTTP library that lets developers make requests to a server to fetch data.
// Personal Opinion *- Easier to use then writing a .fetch (post) request

import { Route, Routes } from 'react-router-dom';
// Routes: Whenever path changes, <Routes> looks through all its child routes to find the best match and renders that branch of the UI.
// Route: Couples URL segments to components

import { UserContextProvider } from './UserContext';
// UserContextProvider: provides data or states to components in the compenent tree 

import './App.css'
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account"  element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
