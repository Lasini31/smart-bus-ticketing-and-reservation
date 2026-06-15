import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header'

export default function Layout(){

    return(
        <div className="min-h-screen pt-[4.5rem]">
            <Header/>
            <main>
               <Outlet/> 
            </main>
        </div>
    )
}