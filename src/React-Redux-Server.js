import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Articles from './React-Redux-Server-pages/Articles2.js'
import Users from './React-Redux-Server-pages/Users.js'
import Photos from './React-Redux-Server-pages/Photos.js'
import './React-Redux-Server-pages/React-Redux-Server.css'
import { HashRouter as Router, Route, Routes, NavLink } from 'react-router-dom';


export default function App() {
    return (
        <Router>
            <div>
                <nav>
                    <NavLink className="menu" to="/articles" >Articles</NavLink>
                    <NavLink className="menu" to="/users" >Users</NavLink>
                    <NavLink className="menu" to="/photos" >Photos</NavLink>
                </nav>


                <Routes>
                    <Route path="/articles" element={<Articles />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/photos" element={<Photos />} />
                </Routes>
            </div>
        </Router>
    );
}