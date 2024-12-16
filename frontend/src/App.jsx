import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Create from "./components/Create";
import Read from "./components/Read";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/read" element={<Read />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
