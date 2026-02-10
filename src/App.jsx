import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Amenities from './components/Amenities';
import BookingForm from './components/BookingForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './components/Login';
import Dashboard from './components/ManagerDashboard/Dashboard';
import './styles/index.css';

function HomePage() {
    return (
        <>
            <Hero />
            <Amenities />
            <BookingForm />
            <Contact />
        </>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/booking" element={<><BookingForm /><Contact /></>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
