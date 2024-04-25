import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Home from "./Home";
import ProtectedRoutes from "./ProtectedRoute";
import Nav from "./Navbar";

function App() {
  return (
    <div className="App">
      <Nav />
      <div className="content">
        <Routes>
          <Route exact path="/" Component={Home} />
          <Route exact path="/register" Component={Register} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
