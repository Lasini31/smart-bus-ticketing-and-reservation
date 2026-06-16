
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import PaymentPage from './components/PaymentPage.jsx'

import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

//import Loader from './loader.jsx'

// Public imports
//import AppWrapper from './AppWrapper'
// //import Error from './erorr.jsx'
//import NotFound from './notFound.jsx'
import App from './App.jsx'
import Home from './components/home.jsx'
import About from './components/about.jsx'
import Login from './components/login.jsx'
import Profile from './components/profile.jsx'
import TicketBooking from './components/ticketBooking.jsx'
import Wallet from './components/wallet.jsx'
import SeatSelection from './components/SeatSelection.jsx'
import PaymentPage from './components/paymentPage.jsx'

import Register from './components/Register.jsx'

// Admin imports goes here

const router = createBrowserRouter(createRoutesFromElements(
  <>
    {/* Public Routes */}
    <Route path='/' element={<App />} > {/*errorElement={<Error />}*/} 
      <Route
          index
          element={<Home/>}
        />
      <Route
          path='payment'
          element={<PaymentPage/>}
          />
      <Route
          path='booking'
          element={<TicketBooking/>}
        />
      <Route
          path='booking/select'
          element={<SeatSelection/>}
        />
      <Route
          path='about'
          element={<About/>}
        />
      <Route
          path='login'
          element={<Login/>}
        />
        <Route
          path='register'
          element={<Register/>}
        />
      <Route
          path='profile'
          element={<Profile/>}
        />
      <Route
          path='wallet'
          element={<Wallet/>}
        />
      <Route
          path='payment'
          element={<PaymentPage/>}
        />
    </Route>
  </>
));

/*example 
<Route
  path='posts'
  element={<Posts/>}
  loader={PostLoader}
  errorElement={<Error />}
/>

after add loader
<Route element={<AppWrapper/>} >
        <Route
          index
          element={<Home/>}
        />
      </Route>

*/


function Index() {
  return (
    <RouterProvider router={router} />
  )
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)
