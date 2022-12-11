import React from 'react';
import './assets/css/Output.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Register from './pages/register'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
