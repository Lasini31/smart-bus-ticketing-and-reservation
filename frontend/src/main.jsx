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
import Profile from './components/profile.jsx'
import TicketBooking from './components/ticketBooking.jsx'
import Wallet from './components/wallet.jsx'
import SeatSelection from './components/SeatSelection.jsx'
import TicketDownload from './components/TicketDownload.jsx'
import PaymentPage from './components/paymentPage.jsx'
import Contact from './components/Contact.jsx'
import Bookings from './components/Bookings.jsx'
import NotFound from './components/NotFound.jsx'
import { WalletProvider } from './contexts/WalletContext.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='/' element={<App />}>
      <Route index element={<Home />} />
      <Route path='booking' element={<TicketBooking />} />
      <Route path='booking/select' element={<SeatSelection />} />
      <Route path='booking/ticket' element={<TicketDownload />} />
      <Route path='bookings' element={<Bookings />} />
      <Route path='contact' element={<Contact />} />
      <Route path='*' element={<NotFound />} />
      <Route path='about' element={<About />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='owner-register' element={<OwnerRegister />} />
      <Route path='profile' element={<Profile />} />
      <Route path='wallet' element={<Wallet />} />
      <Route path='payment' element={<PaymentPage />} />
    </Route>
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
