import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './components/header'
import Register from './components/Register'

export default function Layout(){
    return(
        <div className="min-h-screen pt-16">
            <Header/>
            <main>
                <Register/>
            </main>
        </div>
    )
}