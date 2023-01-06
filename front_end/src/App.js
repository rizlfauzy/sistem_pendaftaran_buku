import React from "react";
import "./assets/css/Output.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Index from "./pages/index";
import Profil from "./pages/profil";

const { REACT_APP_PREFIX } = process.env;

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path={`${REACT_APP_PREFIX}register`} element={<Register />} />
          <Route path={`${REACT_APP_PREFIX}login`} element={<Login />} />
          <Route path={`${REACT_APP_PREFIX}`} element={<Index title="Beranda" />} />
          <Route path={`${REACT_APP_PREFIX}profil`} element={<Profil />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
