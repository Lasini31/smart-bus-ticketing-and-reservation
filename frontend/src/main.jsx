import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import React from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

import App from './App.jsx'
import Home from './components/home.jsx'
import About from './components/about.jsx'
import Login from './components/login.jsx'
import Register from './components/register.jsx' 
import OwnerRegister from './components/ownerRegister.jsx'
import BusSetup from './components/BusSetup.jsx'
import Profile from './components/profile.jsx'
import TicketBooking from './components/ticketBooking.jsx'
import Wallet from './components/wallet.jsx'
import SeatSelection from './components/SeatSelection.jsx'
import TicketDownload from './components/TicketDownload.jsx'
import PaymentPage from './components/paymentPage.jsx'
import Contact from './components/Contact.jsx'
import Bookings from './components/Bookings.jsx'
import NotFound from './components/NotFound.jsx'
import OwnerLayout from './owner/OwnerLayout.jsx'
import { WalletProvider } from './contexts/WalletContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import { RequireOwnerAuth } from './components/RequireAuth.jsx'
import OwnerDashboard from './owner/OwnerDashboard.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<App />}>
      <Route index element={<Home />} />
      <Route path='booking' element={<RequireAuth><TicketBooking /></RequireAuth>} />
      <Route path='booking/select' element={<RequireAuth><SeatSelection /></RequireAuth>} />
      <Route path='booking/ticket' element={<RequireAuth><TicketDownload /></RequireAuth>} />
      <Route path='bookings' element={<RequireAuth><Bookings /></RequireAuth>} />
      <Route path='wallet' element={<RequireAuth><Wallet /></RequireAuth>} />
      <Route path='payment' element={<RequireAuth><PaymentPage /></RequireAuth>} />
      <Route path='contact' element={<Contact />} />
      <Route path='*' element={<NotFound />} />
      <Route path='about' element={<About />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='owner-register' element={<OwnerRegister />} />
      <Route path='owner/bus-setup' element={<BusSetup />} />
      <Route path='profile' element={<RequireAuth><Profile /></RequireAuth>} />
    </Route>
    <Route path='/owner/dashboard' element={<RequireOwnerAuth><OwnerDashboard /></RequireOwnerAuth>} />
  </>
))

function Index() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <WalletProvider>
          <RouterProvider router={router} />
        </WalletProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Index />
  </StrictMode>,
)
