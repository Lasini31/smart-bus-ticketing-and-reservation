import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/Footer'

export default function Layout(){

    return(
        <div className="min-h-screen pt-[4.5rem] flex flex-col">
            <Header/>
            <main className="flex-grow">
               <Outlet/> 
            </main>
            <Footer />
        </div>
    )
}