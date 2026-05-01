import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'

//import Loader from './loader.jsx'

// Public imports
import App from './App.jsx'
//import AppWrapper from './AppWrapper'
import Home from './components/home.jsx'
//import Error from './erorr.jsx'
//import NotFound from './notFound.jsx'

// Admin imports goes here

const router = createBrowserRouter(createRoutesFromElements(
  <>
    {/* Public Routes */}
    <Route path='/' element={<App />} > {/*errorElement={<Error />}*/} 
      <Route
          index
          element={<Home/>}
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
