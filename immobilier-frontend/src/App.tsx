import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import FirstDeisgn from "./components/first-design";
import SecondDeisgn from "./components/second-design";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="one" element={<FirstDeisgn />} />
        <Route path="two" element={<SecondDeisgn />} />
      </Routes>
    </Router>
  );
}

export default App;
